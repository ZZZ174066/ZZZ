package com.tsj.algorithm;

import com.tsj.dto.PackingLlmConstraints;
import com.tsj.entity.Container;
import com.tsj.entity.Item;
import com.tsj.entity.PlanItemDetail;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;


public class PackingAlgorithm3 {

    private static final String IMPORTED_CONTAINER_PREFIX = "__IMPORTED_CONTAINER__";


    public static final String DISPLAY_NAME = "序贯锚位紧凑退火算法";

    private static String stripImportedContainerPrefix(String name) {
        if (name == null || name.isEmpty()) return "";
        return name.startsWith(IMPORTED_CONTAINER_PREFIX)
                ? name.substring(IMPORTED_CONTAINER_PREFIX.length())
                : name;
    }

    public static List<PlanItemDetail> optimize(List<Item> items, List<Container> containers, double minSupportRate) {
        return optimize(items, containers, minSupportRate, null);
    }

    public static List<PlanItemDetail> optimize(List<Item> items, List<Container> containers, double minSupportRate, PackingLlmConstraints llmConstraints) {
        return optimize(items, containers, minSupportRate, llmConstraints, null);
    }


    public static List<PlanItemDetail> optimize(List<Item> items, List<Container> containers, double minSupportRate, PackingLlmConstraints llmConstraints, PackingStepListener listener) {
        if (items == null || containers == null || items.isEmpty() || containers.isEmpty()) return List.of();

        List<Unit> units = expandUnits(items);
        if (units.isEmpty()) return List.of();


        List<List<Container>> orders = generateContainerOrders(containers);
        List<PlanItemDetail> best = List.of();
        double bestFill = -1;

        for (List<Container> order : orders) {
            List<PlanItemDetail> res = runOuterContainerScript(units, order, minSupportRate, llmConstraints, listener);
            double fill = calculateFillRate(res, units, order);
            if (fill > bestFill + 1e-9) {
                bestFill = fill;
                best = res;
            }
        }
        return best;
    }


    private static List<Unit> expandUnits(List<Item> items) {
        List<Unit> units = new ArrayList<>();
        for (Item it : items) {
            if (it == null || it.getItemId() == null) continue;
            int q = it.getQuantity() == null ? 0 : it.getQuantity();
            for (int i = 0; i < q; i++) {
                double l = nz(it.getLengthMm());
                double w = nz(it.getWidthMm());
                double h = nz(it.getHeightMm());
                if (l <= 0 || w <= 0 || h <= 0) continue;
                units.add(new Unit(it.getItemId(), it.getItemName(), l, w, h, isPlateLike(l, w, h)));
            }
        }
        return units;
    }


    private static boolean isPlateLike(double l, double w, double h) {
        double[] a = {l, w, h};
        Arrays.sort(a);
        double min = a[0], mid = a[1];
        if (min <= 0 || mid <= 0) return false;
        return Math.abs(min - h) < 1e-9 && (min / mid) <= 0.35;
    }


    private static List<PlanItemDetail> runOuterContainerScript(List<Unit> units, List<Container> containers, double minSupportRate, PackingLlmConstraints llmConstraints, PackingStepListener listener) {

        List<Integer> remainingIdx = new ArrayList<>(units.size());
        for (int i = 0; i < units.size(); i++) remainingIdx.add(i);

        List<PlanItemDetail> all = new ArrayList<>();
        for (Container c : containers) {
            if (remainingIdx.isEmpty()) break;
            if (c == null) continue;
            if (listener != null) {
                LinkedHashMap<String, Object> startEv = new LinkedHashMap<>();
                startEv.put("type", "container_start");
                startEv.put("containerInstanceId", c.getContainerId());
                startEv.put("containerName", stripImportedContainerPrefix(c.getContainerName()));
                startEv.put("lengthMm", nz(c.getLengthMm()));
                startEv.put("widthMm", nz(c.getWidthMm()));
                startEv.put("heightMm", nz(c.getHeightMm()));
                listener.onEvent(startEv);
            }
            PackResult bestForContainer = runSequentialAnnealingInBin(units, remainingIdx, c, minSupportRate, llmConstraints, listener);
            if (bestForContainer == null || bestForContainer.details.isEmpty()) continue;
            all.addAll(bestForContainer.details);


            List<Integer> used = new ArrayList<>(bestForContainer.usedUnitIdx);
            used.sort(Comparator.reverseOrder());
            for (int u : used) remainingIdx.remove((Integer) u);

            if (listener != null) {
                listener.onEvent(new LinkedHashMap<>(Map.of(
                        "type", "container_end",
                        "containerInstanceId", c.getContainerId(),
                        "placedCount", bestForContainer.details.size()
                )));
            }
        }
        return all;
    }


    private static PackResult runSequentialAnnealingInBin(List<Unit> units, List<Integer> remainingIdx, Container c, double minSupportRate, PackingLlmConstraints llmConstraints, PackingStepListener listener) {
        double L = nz(c.getLengthMm()), W = nz(c.getWidthMm()), H = nz(c.getHeightMm());
        if (L <= 0 || W <= 0 || H <= 0) return null;


        int n = remainingIdx.size();
        int[] seq = new int[n];
        for (int i = 0; i < n; i++) seq[i] = remainingIdx.get(i);
        buildInitialContactFirstOrder(units, seq);


        Int2IntMap oriGene = new Int2IntMap();
        Random rnd = new Random(20260408L ^ (c.getContainerId() == null ? 0 : c.getContainerId()));
        for (int idx : seq) oriGene.put(idx, rnd.nextInt(2));


        double t = 1.0;
        double tf = 0.02;
        double cooling = 0.96;
        int chain = Math.min(220, Math.max(72, (int) (n * 5.5)));
        int outer = 0;

        AssemblyOutcome best = decodeSequentialAssembly(units, c.getContainerId(), L, W, H, seq, oriGene, minSupportRate, llmConstraints);
        AssemblyOutcome curr = best;

        if (listener != null) {
            listener.onEvent(new LinkedHashMap<>(Map.of(
                    "type", "phase",
                    "name", "sequential_annealing"
            )));
        }

        while (t > tf && outer < 56) {
            outer++;
            for (int i = 0; i < chain; i++) {
                Neighbor nb = neighborMove(seq, oriGene, units, rnd);
                AssemblyOutcome next = decodeSequentialAssembly(units, c.getContainerId(), L, W, H, nb.seq, nb.oriGene, minSupportRate, llmConstraints);

                double delta = next.packedVolume - curr.packedVolume;
                boolean accept = delta >= -1e-9 || rnd.nextDouble() < Math.exp(delta / Math.max(t, 1e-9));
                if (accept) {
                    curr = next;
                    seq = nb.seq;
                    oriGene = nb.oriGene;
                }
                if (curr.betterThan(best)) best = curr;
            }
            t *= cooling;
            if (listener != null) {
                listener.onEvent(new LinkedHashMap<>(Map.of(
                        "type", "temperature",
                        "value", t,
                        "outer", outer
                )));
            }
        }

        if (listener != null) {
            listener.onEvent(new LinkedHashMap<>(Map.of(
                    "type", "phase",
                    "name", "assembly_replay",
                    "outer", outer
            )));
        }


        AssemblyOutcome finalOutcome = decodeSequentialAssembly(units, c.getContainerId(), L, W, H, best.seqSnapshot(), best.oriSnapshot(), minSupportRate, llmConstraints, listener);
        return finalOutcome.toPackResult();
    }

    private static Neighbor neighborMove(int[] seq, Int2IntMap oriGene, List<Unit> units, Random rnd) {
        int n = seq.length;
        int[] s2 = Arrays.copyOf(seq, n);
        Int2IntMap o2 = new Int2IntMap(oriGene);

        int op = rnd.nextInt(100);
        if (op < 65 && n >= 2) {

            int a = rnd.nextInt(n);
            int b = rnd.nextInt(n);
            int tmp = s2[a];
            s2[a] = s2[b];
            s2[b] = tmp;
        } else {

            int pos = rnd.nextInt(n);
            int unitIdx = s2[pos];
            Unit u = units.get(unitIdx);
            o2.put(unitIdx, rnd.nextInt(2));
        }

        return new Neighbor(s2, o2);
    }


    private static void buildInitialContactFirstOrder(List<Unit> units, int[] seq) {
        Integer[] boxed = new Integer[seq.length];
        for (int i = 0; i < seq.length; i++) boxed[i] = seq[i];
        Arrays.sort(boxed, (a, b) -> {
            Unit ua = units.get(a), ub = units.get(b);
            int cmp = Double.compare(ub.baseArea(), ua.baseArea());
            if (cmp != 0) return cmp;
            return Double.compare(ub.volume(), ua.volume());
        });
        for (int i = 0; i < seq.length; i++) seq[i] = boxed[i];
    }


    private static AssemblyOutcome decodeSequentialAssembly(List<Unit> units, Long containerInstanceId,
                                                            double L, double W, double H,
                                                            int[] seq, Int2IntMap oriGene,
                                                            double minSupportRate,
                                                            PackingLlmConstraints llmConstraints) {
        return decodeSequentialAssembly(units, containerInstanceId, L, W, H, seq, oriGene, minSupportRate, llmConstraints, null);
    }

    private static AssemblyOutcome decodeSequentialAssembly(List<Unit> units, Long containerInstanceId,
                                                            double L, double W, double H,
                                                            int[] seq, Int2IntMap oriGene,
                                                            double minSupportRate,
                                                            PackingLlmConstraints llmConstraints,
                                                            PackingStepListener listener) {
        FeasibleAnchorSet anchors = new FeasibleAnchorSet();
        anchors.add(new Anchor(0, 0, 0));

        List<PlacedCuboid> placed = new ArrayList<>();
        List<PlanItemDetail> details = new ArrayList<>();
        List<Integer> used = new ArrayList<>();

        double packedVol = 0.0;

        for (int k = 0; k < seq.length; k++) {
            int unitIdx = seq[k];
            Unit u = units.get(unitIdx);

            List<Oriented> orientations = allowedOrientations(u, oriGene.getOrDefault(unitIdx, 0));

            double oldMaxX = maxX(placed);
            double oldMaxY = maxY(placed);
            double oldMaxZ = maxZ(placed);
            double hullVolBefore = oldMaxX * oldMaxY * oldMaxZ;

            Candidate best = null;
            for (Anchor p : anchors.snapshotSorted()) {
                for (Oriented o : orientations) {
                    if (p.x + o.l > L + 1e-9 || p.y + o.w > W + 1e-9 || p.z + o.h > H + 1e-9) continue;
                    if (intersectsAny(placed, p.x, p.y, p.z, o.l, o.w, o.h)) continue;

                    Pos snapped = triAxisSnap(placed, p.x, p.y, p.z, o.l, o.w, o.h, L, W);
                    if (snapped == null) continue;


                    final double Z_EPS = 1e-4;
                    double support = (snapped.z <= Z_EPS) ? 1.0 : projectionSupportRatio(placed, snapped.x, snapped.y, snapped.z, o.l, o.w);
                    if (snapped.z > Z_EPS && support + 1e-9 < minSupportRate) continue;


                    if (shouldSkipAsForbiddenBottom(llmConstraints, snapped.z, details, u.itemId, seq, units)) {
                        continue;
                    }

                    double newMaxX = Math.max(oldMaxX, snapped.x + o.l);
                    double newMaxY = Math.max(oldMaxY, snapped.y + o.w);
                    double newMaxZ = Math.max(oldMaxZ, snapped.z + o.h);
                    double pieceVol = o.l * o.w * o.h;
                    double newPackedVol = packedVol + pieceVol;
                    double newHullVol = newMaxX * newMaxY * newMaxZ;

                    double deltaHull = Math.max(0.0, newHullVol - hullVolBefore);
                    double deltaPerVol = deltaHull / Math.max(pieceVol, 1e-9);
                    double hullCompactness = newHullVol / Math.max(newPackedVol, 1e-9);
                    double touch = contactSurfaceArea(placed, snapped.x, snapped.y, snapped.z, o.l, o.w, o.h, L, W);

                    Candidate cand = new Candidate(snapped.x, snapped.y, snapped.z, o, support, hullCompactness,
                            deltaPerVol, touch, newMaxX, newMaxY, newMaxZ);
                    if (best == null || cand.betterThan(best)) best = cand;
                }
            }

            if (best == null) {
                continue;
            }

            PlacedCuboid b = new PlacedCuboid(u.itemId, best.x, best.y, best.z, best.o.l, best.o.w, best.o.h);
            placed.add(b);
            packedVol += b.volume();
            used.add(unitIdx);

            PlanItemDetail d = new PlanItemDetail();
            d.setItemId(u.itemId);
            d.setContainerInstanceId(containerInstanceId);
            d.setLayerIndex(0);

            d.setPosX(BigDecimal.valueOf(best.x).setScale(6, RoundingMode.HALF_UP));
            d.setPosY(BigDecimal.valueOf(best.y).setScale(6, RoundingMode.HALF_UP));
            d.setPosZ(BigDecimal.valueOf(best.z).setScale(6, RoundingMode.HALF_UP));
            d.setSwapLengthWidth(best.o.swapLW ? 1 : 0);
            d.setSupportRate(BigDecimal.valueOf(best.support * 100.0).setScale(3, RoundingMode.HALF_UP));
            details.add(d);

            if (listener != null) {
                Map<String, Object> ev = new LinkedHashMap<>();
                ev.put("type", "place");
                ev.put("containerInstanceId", containerInstanceId);
                ev.put("itemId", u.itemId);
                ev.put("itemName", u.itemName == null ? "" : u.itemName);
                ev.put("x", best.x);
                ev.put("y", best.y);
                ev.put("z", best.z);
                ev.put("lengthMm", best.o.l);
                ev.put("widthMm", best.o.w);
                ev.put("heightMm", best.o.h);
                ev.put("swapLengthWidth", best.o.swapLW ? 1 : 0);
                ev.put("supportRate", best.support * 100.0);
                ev.put("packedVolume", packedVol);
                listener.onEvent(ev);

                try {
                    Thread.sleep(12L);
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                }
            }

            anchors.removeIfInsideAny(placed);
            anchors.removeNear(best.x, best.y, best.z);

            addExtremeAnchorsForBox(anchors, best.x, best.y, best.z, best.o.l, best.o.w, best.o.h, L, W, H);

            if (anchors.size() > 280) {
                anchors.pruneDominated(L, W, H);
            }
        }

        double heightUsed = maxZ(placed);
        return new AssemblyOutcome(details, used, packedVol, heightUsed, seq, oriGene);
    }

    private static boolean shouldSkipAsForbiddenBottom(PackingLlmConstraints c, double z,
                                                      List<PlanItemDetail> alreadyPlaced,
                                                      Long candidateItemId,
                                                      int[] seq, List<Unit> units) {
        if (c == null || !c.hasBottomLayerRules()) return false;
        if (candidateItemId == null || !c.getForbiddenBottomLayerItemIds().contains(candidateItemId)) return false;

        if (z > 1e-4) return false;


        for (PlanItemDetail d : alreadyPlaced) {
            if (d == null || d.getPosZ() == null) continue;
            if (d.getPosZ().doubleValue() <= 1e-4) return true;
        }


        for (int idx : seq) {
            Unit u = units.get(idx);
            if (u != null && u.itemId != null && !c.getForbiddenBottomLayerItemIds().contains(u.itemId)) {
                return true;
            }
        }
        return false;
    }

    private static List<Oriented> allowedOrientations(Unit u, int gene) {


        if (Math.floorMod(gene, 2) == 1) {
            return List.of(new Oriented(u.w, u.l, u.h, true));
        }
        return List.of(new Oriented(u.l, u.w, u.h, false));
    }


    private static double contactSurfaceArea(List<PlacedCuboid> placed, double x, double y, double z,
                                             double l, double w, double h, double L, double W) {
        double a = 0.0;
        final double eps = 1e-3;
        double x2 = x + l, y2 = y + w, z2 = z + h;
        if (z <= eps) a += l * w;
        if (x <= eps) a += w * h;
        if (y <= eps) a += l * h;
        if (x2 >= L - eps) a += w * h;
        if (y2 >= W - eps) a += l * h;
        for (PlacedCuboid b : placed) {
            double bx2 = b.x + b.l, by2 = b.y + b.w, bz2 = b.z + b.h;
            if (Math.abs(bx2 - x) < eps && overlap1d(y, y2, b.y, by2) && overlap1d(z, z2, b.z, bz2)) {
                a += (Math.min(y2, by2) - Math.max(y, b.y)) * (Math.min(z2, bz2) - Math.max(z, b.z));
            }
            if (Math.abs(b.x - x2) < eps && overlap1d(y, y2, b.y, by2) && overlap1d(z, z2, b.z, bz2)) {
                a += (Math.min(y2, by2) - Math.max(y, b.y)) * (Math.min(z2, bz2) - Math.max(z, b.z));
            }
            if (Math.abs(by2 - y) < eps && overlap1d(x, x2, b.x, bx2) && overlap1d(z, z2, b.z, bz2)) {
                a += (Math.min(x2, bx2) - Math.max(x, b.x)) * (Math.min(z2, bz2) - Math.max(z, b.z));
            }
            if (Math.abs(b.y - y2) < eps && overlap1d(x, x2, b.x, bx2) && overlap1d(z, z2, b.z, bz2)) {
                a += (Math.min(x2, bx2) - Math.max(x, b.x)) * (Math.min(z2, bz2) - Math.max(z, b.z));
            }
            if (Math.abs(bz2 - z) < eps && overlap1d(x, x2, b.x, bx2) && overlap1d(y, y2, b.y, by2)) {
                a += (Math.min(x2, bx2) - Math.max(x, b.x)) * (Math.min(y2, by2) - Math.max(y, b.y));
            }
        }
        return a;
    }


    private static void addExtremeAnchorsForBox(FeasibleAnchorSet anchors, double x, double y, double z,
                                                double l, double w, double h, double L, double W, double H) {
        tryAddFeasibleAnchor(anchors, x + l, y, z, L, W, H);
        tryAddFeasibleAnchor(anchors, x, y + w, z, L, W, H);
        tryAddFeasibleAnchor(anchors, x, y, z + h, L, W, H);
        tryAddFeasibleAnchor(anchors, x + l, y + w, z, L, W, H);
        tryAddFeasibleAnchor(anchors, x + l, y, z + h, L, W, H);
        tryAddFeasibleAnchor(anchors, x, y + w, z + h, L, W, H);
        tryAddFeasibleAnchor(anchors, x + l, y + w, z + h, L, W, H);
    }

    private static void tryAddFeasibleAnchor(FeasibleAnchorSet anchors, double x, double y, double z,
                                             double L, double W, double H) {
        if (x < -1e-9 || y < -1e-9 || z < -1e-9) return;
        if (x >= L - 1e-9 || y >= W - 1e-9 || z >= H - 1e-9) return;
        anchors.add(new Anchor(x, y, z));
    }


    private static Pos triAxisSnap(List<PlacedCuboid> placed, double x, double y, double z, double l, double w, double h, double L, double W) {
        double nx = 0.0;
        for (PlacedCuboid b : placed) {
            if (!overlap1d(z, z + h, b.z, b.z + b.h)) continue;
            if (!overlap1d(y, y + w, b.y, b.y + b.w)) continue;
            if (b.x + b.l <= x + 1e-9) {
                nx = Math.max(nx, b.x + b.l);
            }
        }
        nx = clamp(nx, 0.0, L - l);
        if (intersectsAny(placed, nx, y, z, l, w, h)) nx = x;


        double ny = 0.0;
        for (PlacedCuboid b : placed) {
            if (!overlap1d(z, z + h, b.z, b.z + b.h)) continue;
            if (!overlap1d(nx, nx + l, b.x, b.x + b.l)) continue;
            if (b.y + b.w <= y + 1e-9) {
                ny = Math.max(ny, b.y + b.w);
            }
        }
        ny = clamp(ny, 0.0, W - w);
        if (intersectsAny(placed, nx, ny, z, l, w, h)) ny = y;

        double nz = 0.0;
        for (PlacedCuboid b : placed) {
            if (!overlap1d(nx, nx + l, b.x, b.x + b.l)) continue;
            if (!overlap1d(ny, ny + w, b.y, b.y + b.w)) continue;
            if (b.z + b.h <= z + 1e-9) {
                nz = Math.max(nz, b.z + b.h);
            }
        }
        nz = Math.max(0.0, nz);
        if (intersectsAny(placed, nx, ny, nz, l, w, h)) nz = z;
        return new Pos(nx, ny, nz);
    }


    private static double projectionSupportRatio(List<PlacedCuboid> placed, double x, double y, double z, double l, double w) {
        double area = l * w;
        if (area <= 0) return 0.0;
        double overlap = 0.0;
        final double eps = 1e-4;
        for (PlacedCuboid b : placed) {
            double top = b.z + b.h;
            if (Math.abs(top - z) > eps) continue;
            overlap += intersect2d(x, y, l, w, b.x, b.y, b.l, b.w);
        }
        return Math.min(overlap, area) / area;
    }

    private static boolean intersectsAny(List<PlacedCuboid> placed, double x, double y, double z, double l, double w, double h) {
        for (PlacedCuboid b : placed) {
            if (intersect3d(x, y, z, l, w, h, b.x, b.y, b.z, b.l, b.w, b.h)) return true;
        }
        return false;
    }

    private static boolean intersect3d(double ax, double ay, double az, double al, double aw, double ah,
                                       double bx, double by, double bz, double bl, double bw, double bh) {
        final double eps = 1e-9;
        double ax2 = ax + al, ay2 = ay + aw, az2 = az + ah;
        double bx2 = bx + bl, by2 = by + bw, bz2 = bz + bh;
        if (ax2 <= bx + eps || bx2 <= ax + eps) return false;
        if (ay2 <= by + eps || by2 <= ay + eps) return false;
        if (az2 <= bz + eps || bz2 <= az + eps) return false;
        return true;
    }

    private static double intersect2d(double ax, double ay, double al, double aw, double bx, double by, double bl, double bw) {
        double x1 = Math.max(ax, bx), y1 = Math.max(ay, by), x2 = Math.min(ax + al, bx + bl), y2 = Math.min(ay + aw, by + bw);
        return (x2 - x1 <= 0 || y2 - y1 <= 0) ? 0 : (x2 - x1) * (y2 - y1);
    }

    private static boolean overlap1d(double a1, double a2, double b1, double b2) {
        return Math.min(a2, b2) - Math.max(a1, b1) > 1e-9;
    }

    private static double clamp(double v, double lo, double hi) {
        if (v < lo) return lo;
        if (v > hi) return hi;
        return v;
    }

    private static double maxX(List<PlacedCuboid> placed) {
        double m = 0.0;
        for (PlacedCuboid b : placed) m = Math.max(m, b.x + b.l);
        return m;
    }
    private static double maxY(List<PlacedCuboid> placed) {
        double m = 0.0;
        for (PlacedCuboid b : placed) m = Math.max(m, b.y + b.w);
        return m;
    }
    private static double maxZ(List<PlacedCuboid> placed) {
        double m = 0.0;
        for (PlacedCuboid b : placed) m = Math.max(m, b.z + b.h);
        return m;
    }


    private static List<List<Container>> generateContainerOrders(List<Container> base) {
        List<Container> list = new ArrayList<>();
        for (Container c : base) if (c != null) list.add(c);
        if (list.isEmpty()) return List.of();

        List<List<Container>> orders = new ArrayList<>();
        orders.add(new ArrayList<>(list));

        List<Container> desc = new ArrayList<>(list);
        desc.sort((a, b) -> Double.compare(volume(b), volume(a)));
        orders.add(desc);

        List<Container> asc = new ArrayList<>(list);
        asc.sort(Comparator.comparingDouble(PackingAlgorithm3::volume));
        orders.add(asc);
        return orders;
    }

    private static double volume(Container c) {
        return nz(c.getLengthMm()) * nz(c.getWidthMm()) * nz(c.getHeightMm());
    }

    private static double calculateFillRate(List<PlanItemDetail> details, List<Unit> units, List<Container> containers) {
        if (details == null || details.isEmpty()) return 0.0;

        Map<Long, Unit> anyUnitByItemId = new HashMap<>();
        for (Unit u : units) {
            if (u != null && u.itemId != null) anyUnitByItemId.putIfAbsent(u.itemId, u);
        }

        Map<Long, Container> cm = new HashMap<>();
        for (Container c : containers) if (c != null) cm.put(c.getContainerId(), c);

        Set<Long> usedContainers = new HashSet<>();
        double packed = 0.0;
        for (PlanItemDetail d : details) {
            if (d == null) continue;
            if (d.getContainerInstanceId() != null) usedContainers.add(d.getContainerInstanceId());
            Unit u = anyUnitByItemId.get(d.getItemId());
            if (u == null) continue;
            packed += u.volume();
        }

        double total = 0.0;
        for (Long cid : usedContainers) {
            Container c = cm.get(cid);
            if (c != null) total += nz(c.getLengthMm()) * nz(c.getWidthMm()) * nz(c.getHeightMm());
        }
        return total > 0 ? (packed / total) * 100.0 : 0.0;
    }

    private static double nz(Number v) { return v == null ? 0.0 : v.doubleValue(); }

    private record Unit(Long itemId, String itemName, double l, double w, double h, boolean plateLike) {
        double baseArea() { return l * w; }
        double volume() { return l * w * h; }
    }

    private record Oriented(double l, double w, double h, boolean swapLW) {}


    private record PlacedCuboid(Long itemId, double x, double y, double z, double l, double w, double h) {
        double volume() { return l * w * h; }
    }


    private record Anchor(double x, double y, double z) {}

    private record Pos(double x, double y, double z) {}


    private record Candidate(double x, double y, double z, Oriented o, double support, double hullCompactness,
                             double deltaHullPerVol, double touchArea,
                             double newMaxX, double newMaxY, double newMaxZ) {
        boolean betterThan(Candidate other) {
            if (other == null) return true;
            if (Math.abs(this.deltaHullPerVol - other.deltaHullPerVol) > 1e-7) return this.deltaHullPerVol < other.deltaHullPerVol;
            if (Math.abs(this.touchArea - other.touchArea) > 1e-6) return this.touchArea > other.touchArea;
            if (Math.abs(this.support - other.support) > 1e-9) return this.support > other.support;
            if (Math.abs(this.z - other.z) > 1e-7) return this.z < other.z;
            double sxy = this.x + this.y;
            double oxy = other.x + other.y;
            if (Math.abs(sxy - oxy) > 1e-7) return sxy < oxy;
            if (Math.abs(this.hullCompactness - other.hullCompactness) > 1e-9) return this.hullCompactness < other.hullCompactness;
            double v1 = this.o.l * this.o.w * this.o.h;
            double v2 = other.o.l * other.o.w * other.o.h;
            if (Math.abs(v1 - v2) > 1e-9) return v1 > v2;
            return !this.o.swapLW && other.o.swapLW;
        }
    }


    private static class FeasibleAnchorSet {
        private final List<Anchor> pts = new ArrayList<>();

        int size() {
            return pts.size();
        }

        void add(Anchor p) {
            if (p == null) return;
            if (p.x < -1e-9 || p.y < -1e-9 || p.z < -1e-9) return;
            for (Anchor q : pts) {
                if (Math.abs(q.x - p.x) < 1e-6 && Math.abs(q.y - p.y) < 1e-6 && Math.abs(q.z - p.z) < 1e-6) return;
            }
            pts.add(p);
        }

        void removeNear(double x, double y, double z) {
            pts.removeIf(p -> Math.abs(p.x - x) < 1e-6 && Math.abs(p.y - y) < 1e-6 && Math.abs(p.z - z) < 1e-6);
        }

        void removeIfInsideAny(List<PlacedCuboid> placed) {
            pts.removeIf(p -> insideAny(placed, p));
        }

        private boolean insideAny(List<PlacedCuboid> placed, Anchor p) {
            for (PlacedCuboid b : placed) {
                if (p.x > b.x - 1e-9 && p.x < b.x + b.l + 1e-9
                        && p.y > b.y - 1e-9 && p.y < b.y + b.w + 1e-9
                        && p.z > b.z - 1e-9 && p.z < b.z + b.h + 1e-9) {
                    return true;
                }
            }
            return false;
        }

        void pruneDominated(double L, double W, double H) {
            pts.removeIf(p -> p.x > L + 1e-9 || p.y > W + 1e-9 || p.z > H + 1e-9);
            pts.removeIf(p -> {
                for (Anchor q : pts) {
                    if (q == p) continue;
                    if (Math.abs(q.z - p.z) > 1e-6) continue;
                    if (q.x <= p.x + 1e-9 && q.y <= p.y + 1e-9 && (q.x < p.x - 1e-9 || q.y < p.y - 1e-9)) {
                        return true;
                    }
                }
                return false;
            });
        }

        List<Anchor> snapshotSorted() {
            List<Anchor> out = new ArrayList<>(pts);
            out.sort((a, b) -> {
                int cz = Double.compare(a.z, b.z);
                if (cz != 0) return cz;
                int cs = Double.compare(a.x + a.y, b.x + b.y);
                if (cs != 0) return cs;
                int cx = Double.compare(a.x, b.x);
                if (cx != 0) return cx;
                return Double.compare(a.y, b.y);
            });
            return out;
        }
    }

    private record Neighbor(int[] seq, Int2IntMap oriGene) {}

    private record PackResult(List<PlanItemDetail> details, List<Integer> usedUnitIdx) {}


    private record AssemblyOutcome(List<PlanItemDetail> details, List<Integer> usedUnitIdx, double packedVolume, double heightUsed, int[] seqRef, Int2IntMap oriGeneRef) {
        boolean betterThan(AssemblyOutcome other) {
            if (other == null) return true;
            if (Math.abs(this.packedVolume - other.packedVolume) > 1e-9) return this.packedVolume > other.packedVolume;
            if (Math.abs(this.heightUsed - other.heightUsed) > 1e-9) return this.heightUsed < other.heightUsed;
            return this.details.size() > other.details.size();
        }

        PackResult toPackResult() {
            return new PackResult(details == null ? List.of() : details, usedUnitIdx == null ? List.of() : usedUnitIdx);
        }

        int[] seqSnapshot() {
            return seqRef == null ? new int[0] : Arrays.copyOf(seqRef, seqRef.length);
        }

        Int2IntMap oriSnapshot() {
            return oriGeneRef == null ? new Int2IntMap() : new Int2IntMap(oriGeneRef);
        }
    }


    private static class Int2IntMap {
        private final HashMap<Integer, Integer> m;
        Int2IntMap() { this.m = new HashMap<>(); }
        Int2IntMap(Int2IntMap other) { this.m = new HashMap<>(other.m); }
        void put(int k, int v) { m.put(k, v); }
        int getOrDefault(int k, int def) { return m.getOrDefault(k, def); }
    }
}
