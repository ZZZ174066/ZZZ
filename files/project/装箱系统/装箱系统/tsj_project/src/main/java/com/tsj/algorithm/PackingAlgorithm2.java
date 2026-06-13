package com.tsj.algorithm;

import com.tsj.dto.PackingLlmConstraints;
import com.tsj.entity.Container;
import com.tsj.entity.Item;
import com.tsj.entity.PlanItemDetail;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;


public class PackingAlgorithm2 {

    public static final String DISPLAY_NAME = "填充率优先算法";

    private static final String IMPORTED_CONTAINER_PREFIX = "__IMPORTED_CONTAINER__";

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


        List<ItemUnit> units = new ArrayList<>();
        for (Item it : items) {
            if (it == null || it.getItemId() == null) continue;
            int q = it.getQuantity() == null ? 0 : it.getQuantity();
            for (int i = 0; i < q; i++) {
                units.add(new ItemUnit(it.getItemId(), it.getLengthMm(), it.getWidthMm(), it.getHeightMm()));
            }
        }
        if (units.isEmpty()) return List.of();

        if (listener != null) {
            listener.onEvent(new LinkedHashMap<>(Map.of("type", "phase", "name", "fill_priority_search")));
        }


        List<List<Container>> orders = generateContainerOrders(containers);

        TrialResult bestOverall = null;
        List<Container> bestOrder = null;
        for (List<Container> order : orders) {
            TrialResult r = packAllContainers(units, order, minSupportRate, llmConstraints);
            if (bestOverall == null || r.betterThan(bestOverall)) {
                bestOverall = r;
                bestOrder = order;
            }
        }

        if (listener != null && bestOverall != null && !bestOverall.details.isEmpty() && bestOrder != null) {
            streamFillPriorityReplay(bestOverall.details, bestOrder, items, listener);
        }

        return bestOverall == null ? List.of() : bestOverall.details;
    }


    private static void streamFillPriorityReplay(List<PlanItemDetail> details, List<Container> order, List<Item> itemCatalog, PackingStepListener listener) {
        if (listener == null || details == null || details.isEmpty() || order == null) return;

        Map<Long, Item> itemById = new HashMap<>();
        for (Item it : itemCatalog) {
            if (it != null && it.getItemId() != null) itemById.putIfAbsent(it.getItemId(), it);
        }

        Map<Long, List<PlanItemDetail>> byInst = new LinkedHashMap<>();
        for (PlanItemDetail d : details) {
            if (d == null || d.getContainerInstanceId() == null) continue;
            byInst.computeIfAbsent(d.getContainerInstanceId(), k -> new ArrayList<>()).add(d);
        }

        listener.onEvent(new LinkedHashMap<>(Map.of("type", "phase", "name", "fill_priority_replay")));

        for (Container c : order) {
            if (c == null) continue;
            Long cid = c.getContainerId();
            List<PlanItemDetail> list = byInst.get(cid);
            if (list == null || list.isEmpty()) continue;

            LinkedHashMap<String, Object> startEv = new LinkedHashMap<>();
            startEv.put("type", "container_start");
            startEv.put("containerInstanceId", cid);
            startEv.put("containerName", stripImportedContainerPrefix(c.getContainerName()));
            startEv.put("lengthMm", nz(c.getLengthMm()));
            startEv.put("widthMm", nz(c.getWidthMm()));
            startEv.put("heightMm", nz(c.getHeightMm()));
            listener.onEvent(startEv);

            list.sort(Comparator
                    .comparing((PlanItemDetail x) -> x.getPosZ() == null ? 0.0 : x.getPosZ().doubleValue())
                    .thenComparing(x -> x.getPosY() == null ? 0.0 : x.getPosY().doubleValue())
                    .thenComparing(x -> x.getPosX() == null ? 0.0 : x.getPosX().doubleValue()));

            for (PlanItemDetail d : list) {
                Item it = itemById.get(d.getItemId());
                double lm = it == null ? 0.0 : nz(it.getLengthMm());
                double wm = it == null ? 0.0 : nz(it.getWidthMm());
                double hm = it == null ? 0.0 : nz(it.getHeightMm());
                boolean swap = d.getSwapLengthWidth() != null && d.getSwapLengthWidth() == 1;
                double effL = swap ? wm : lm;
                double effW = swap ? lm : wm;

                Map<String, Object> ev = new LinkedHashMap<>();
                ev.put("type", "place");
                ev.put("containerInstanceId", cid);
                ev.put("itemId", d.getItemId());
                ev.put("itemName", it != null && it.getItemName() != null ? it.getItemName() : "");
                ev.put("x", d.getPosX() != null ? d.getPosX().doubleValue() : 0.0);
                ev.put("y", d.getPosY() != null ? d.getPosY().doubleValue() : 0.0);
                ev.put("z", d.getPosZ() != null ? d.getPosZ().doubleValue() : 0.0);
                ev.put("lengthMm", effL);
                ev.put("widthMm", effW);
                ev.put("heightMm", hm);
                ev.put("swapLengthWidth", swap ? 1 : 0);
                if (d.getSupportRate() != null) {
                    ev.put("supportRate", d.getSupportRate().doubleValue());
                }
                listener.onEvent(ev);
                try {
                    Thread.sleep(12L);
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                    return;
                }
            }

            listener.onEvent(new LinkedHashMap<>(Map.of(
                    "type", "container_end",
                    "containerInstanceId", cid,
                    "placedCount", list.size()
            )));
        }
    }

    private static TrialResult packAllContainers(List<ItemUnit> units, List<Container> containers, double minSupportRate, PackingLlmConstraints llmConstraints) {

        List<Integer> remainingIndexes = new ArrayList<>(units.size());
        for (int i = 0; i < units.size(); i++) remainingIndexes.add(i);

        List<PlanItemDetail> all = new ArrayList<>();
        double sumEdge = 0.0;
        int edgeCount = 0;

        for (Container c : containers) {
            if (remainingIndexes.isEmpty()) break;
            if (c == null) continue;

            TrialResult bestForContainer = packOneContainerWithTrials(units, remainingIndexes, c, minSupportRate, llmConstraints);
            if (bestForContainer == null || bestForContainer.details.isEmpty()) continue;


            List<Integer> used = new ArrayList<>(bestForContainer.usedUnitIndexes);
            used.sort(Comparator.reverseOrder());
            for (int u : used) remainingIndexes.remove((Integer) u);

            all.addAll(bestForContainer.details);
            if (bestForContainer.edgeCount > 0) {
                sumEdge += bestForContainer.sumEdge;
                edgeCount += bestForContainer.edgeCount;
            }
        }

        double fill = calculateFillRate(all, units, containers);
        double avgSupport = averageSupport(all);
        double avgEdge = edgeCount == 0 ? 0.0 : (sumEdge / edgeCount);
        return new TrialResult(all, fill, avgSupport, avgEdge, List.of(), sumEdge, edgeCount);
    }

    private static TrialResult packOneContainerWithTrials(List<ItemUnit> units, List<Integer> remainingIndexes, Container c, double minSupportRate, PackingLlmConstraints llmConstraints) {
        final int TRIALS = 10;
        TrialResult best = null;

        for (int t = 0; t < TRIALS; t++) {
            List<Integer> order = new ArrayList<>(remainingIndexes);
            applyOrderingStrategy(units, order, t);

            TrialResult r = packOneContainerGreedy(units, order, c, minSupportRate, llmConstraints);
            if (r == null) continue;
            if (best == null || r.betterThan(best)) best = r;
        }
        return best;
    }

    private static void applyOrderingStrategy(List<ItemUnit> units, List<Integer> order, int trialIndex) {
        switch (trialIndex) {
            case 0 -> order.sort((a, b) -> Double.compare(units.get(b).baseArea(), units.get(a).baseArea()));
            case 1 -> order.sort((a, b) -> Double.compare(units.get(b).volume(), units.get(a).volume()));
            case 2 -> order.sort((a, b) -> Double.compare(units.get(b).maxSide(), units.get(a).maxSide()));
            case 3 -> order.sort((a, b) -> Double.compare(units.get(a).baseArea(), units.get(b).baseArea()));
            case 4 -> order.sort((a, b) -> Double.compare(units.get(a).volume(), units.get(b).volume()));
            case 5 -> {
                Random rnd = new Random(12345L);
                Collections.shuffle(order, rnd);
            }
            case 6 -> order.sort((a, b) -> Double.compare(units.get(b).perimeter(), units.get(a).perimeter()));
            case 7 -> order.sort((a, b) -> {
                ItemUnit ua = units.get(a), ub = units.get(b);
                int cmp = Double.compare(ub.baseArea(), ua.baseArea());
                if (cmp != 0) return cmp;
                return Double.compare(ub.maxSide(), ua.maxSide());
            });
            default -> {

                order.sort((a, b) -> Double.compare(units.get(b).baseArea(), units.get(a).baseArea()));
                if (order.size() > 12) {
                    List<Integer> tail = new ArrayList<>(order.subList(order.size() - 6, order.size()));
                    order.subList(order.size() - 6, order.size()).clear();
                    order.addAll(6, tail);
                }
            }
        }
    }

    private static TrialResult packOneContainerGreedy(List<ItemUnit> units, List<Integer> order, Container c, double minSupportRate, PackingLlmConstraints llmConstraints) {
        double L = nz(c.getLengthMm()), W = nz(c.getWidthMm()), H = nz(c.getHeightMm());
        if (L <= 0 || W <= 0 || H <= 0) return null;

        List<Placement> placements = new ArrayList<>();
        List<Integer> used = new ArrayList<>();

        List<LayerInfo> layers = new ArrayList<>();
        double z = 0;
        int layer = 1;

        while (!order.isEmpty() && z < H - 1e-6) {
            LayerInfo li = new LayerInfo(c.getContainerId(), layer, z, L, W);
            double maxH = 0;
            boolean placedAny = false;

            boolean progress = true;
            while (progress && !order.isEmpty()) {
                progress = false;

                for (int oi = 0; oi < order.size(); oi++) {
                    int unitIndex = order.get(oi);
                    ItemUnit u = units.get(unitIndex);
                    if (u.l <= 0 || u.w <= 0 || u.h <= 0) continue;
                    if (z + Math.max(maxH, u.h) > H + 1e-6) continue;

                    if (shouldSkipAsForbiddenBottomLayer(llmConstraints, layer, li, order, units, u)) {
                        continue;
                    }

                    PlaceInfo pi = tryPlaceWithPriority(li, layers, u.l, u.w, u.h, minSupportRate, layer);
                    if (pi == null) continue;

                    Placement p = new Placement();
                    p.itemId = u.itemId;
                    p.unitIndex = unitIndex;
                    p.layer = layer;
                    p.z = z;
                    p.x = pi.x;
                    p.y = pi.y;
                    p.l = pi.l;
                    p.w = pi.w;
                    p.h = pi.h;
                    p.rot = pi.rot;
                    p.support = pi.support;
                    p.edge = pi.edge;
                    placements.add(p);

                    li.addRect(pi.x, pi.y, pi.l, pi.w);
                    maxH = Math.max(maxH, pi.h);
                    placedAny = true;
                    used.add(unitIndex);

                    order.remove(oi);
                    progress = true;
                    break;
                }
            }

            if (!placedAny) break;
            li.height = maxH;
            layers.add(li);
            z += maxH;
            layer++;
        }


        applySecondaryCompression(placements, L, W, minSupportRate);


        List<PlanItemDetail> details = new ArrayList<>();
        double sumEdge = 0.0;
        int edgeCount = 0;
        for (Placement p : placements) {
            PlanItemDetail d = new PlanItemDetail();
            d.setItemId(p.itemId);
            d.setContainerInstanceId(c.getContainerId());
            d.setLayerIndex(p.layer);
            d.setPosX(BigDecimal.valueOf(p.x).setScale(3, RoundingMode.HALF_UP));
            d.setPosY(BigDecimal.valueOf(p.y).setScale(3, RoundingMode.HALF_UP));
            d.setPosZ(BigDecimal.valueOf(p.z).setScale(3, RoundingMode.HALF_UP));
            d.setSwapLengthWidth(p.rot == 90 ? 1 : 0);
            d.setSupportRate(BigDecimal.valueOf(p.support * 100.0).setScale(2, RoundingMode.HALF_UP));
            details.add(d);
            sumEdge += p.edge;
            edgeCount++;
        }

        double fill = calculateFillRate(details, units, List.of(c));
        double avgSupport = averageSupport(details);
        double avgEdge = edgeCount == 0 ? 0.0 : (sumEdge / edgeCount);
        return new TrialResult(details, fill, avgSupport, avgEdge, used, sumEdge, edgeCount);
    }
    private static boolean shouldSkipAsForbiddenBottomLayer(PackingLlmConstraints c, int layer, LayerInfo li, List<Integer> order, List<ItemUnit> units, ItemUnit u) {
        if (c == null || !c.hasBottomLayerRules() || layer != 1) return false;
        Long itemId = u.itemId;
        if (itemId == null || !c.getForbiddenBottomLayerItemIds().contains(itemId)) return false;
        if (!li.rects.isEmpty()) {
            return true;
        }
        for (Integer idx : order) {
            ItemUnit uu = units.get(idx);
            Long id = uu.itemId;
            if (id == null || !c.getForbiddenBottomLayerItemIds().contains(id)) {
                return true;
            }
        }
        return false;
    }


    private static void applySecondaryCompression(List<Placement> placements, double L, double W, double minSupportRate) {
        if (placements == null || placements.isEmpty()) return;

        Map<Integer, List<Placement>> byLayer = new HashMap<>();
        int maxLayer = 1;
        for (Placement p : placements) {
            if (p == null) continue;
            byLayer.computeIfAbsent(p.layer, k -> new ArrayList<>()).add(p);
            maxLayer = Math.max(maxLayer, p.layer);
        }


        List<double[]> belowRects = List.of();

        for (int layer = 1; layer <= maxLayer; layer++) {
            List<Placement> lp = byLayer.get(layer);
            if (lp == null || lp.isEmpty()) {
                belowRects = List.of();
                continue;
            }


            for (int iter = 0; iter < 8; iter++) {
                boolean improved = false;


                List<Placement> snapshot = new ArrayList<>(lp);

                for (Placement p : lp) {
                    if (p == null) continue;
                    double currentEdge = edgeRateAt(snapshot, p, p.x, p.y, L, W);
                    double currentSupport = (layer <= 1) ? 1.0 : supportRateAt(belowRects, p.x, p.y, p.l, p.w);

                    double minAllowedSupport = (layer <= 1) ? 1.0 : Math.max(minSupportRate, Math.min(p.support, currentSupport) - 1e-9);

                    Candidate best = new Candidate(p.x, p.y, currentSupport, currentEdge);


                    Candidate[] cands = new Candidate[]{
                            candidateSlideLeft(snapshot, p, L, W, belowRects, layer, minAllowedSupport),
                            candidateSlideRight(snapshot, p, L, W, belowRects, layer, minAllowedSupport),
                            candidateSlideDown(snapshot, p, L, W, belowRects, layer, minAllowedSupport),
                            candidateSlideUp(snapshot, p, L, W, belowRects, layer, minAllowedSupport)
                    };

                    for (Candidate cnd : cands) {
                        if (cnd == null) continue;
                        if (cnd.edge > best.edge + 1e-9) best = cnd;
                    }

                    if (best.edge > currentEdge + 1e-9) {

                        p.x = best.x;
                        p.y = best.y;
                        p.support = best.support;

                        p.edge = best.edge;
                        improved = true;
                    } else {
                        p.edge = currentEdge;
                        p.support = currentSupport;
                    }
                }

                if (!improved) break;
            }


            List<double[]> newBelow = new ArrayList<>();
            for (Placement p : lp) {
                p.edge = edgeRateAt(lp, p, p.x, p.y, L, W);
                newBelow.add(new double[]{p.x, p.y, p.l, p.w});
            }
            belowRects = newBelow;
        }
    }

    private static Candidate candidateSlideLeft(List<Placement> lp, Placement p, double L, double W,
                                                List<double[]> belowRects, int layer, double minAllowedSupport) {
        double targetX = 0.0;
        for (Placement o : lp) {
            if (o == null || o == p) continue;
            if (!overlaps1d(p.y, p.y + p.w, o.y, o.y + o.w)) continue;

            if (o.x + o.l <= p.x + 1e-9) {
                targetX = Math.max(targetX, o.x + o.l);
            }
        }
        return buildCandidate(lp, p, targetX, p.y, L, W, belowRects, layer, minAllowedSupport);
    }

    private static Candidate candidateSlideRight(List<Placement> lp, Placement p, double L, double W,
                                                 List<double[]> belowRects, int layer, double minAllowedSupport) {
        double targetX = L - p.l;
        for (Placement o : lp) {
            if (o == null || o == p) continue;
            if (!overlaps1d(p.y, p.y + p.w, o.y, o.y + o.w)) continue;

            if (o.x >= p.x + p.l - 1e-9) {
                targetX = Math.min(targetX, o.x - p.l);
            }
        }
        return buildCandidate(lp, p, targetX, p.y, L, W, belowRects, layer, minAllowedSupport);
    }

    private static Candidate candidateSlideDown(List<Placement> lp, Placement p, double L, double W,
                                                List<double[]> belowRects, int layer, double minAllowedSupport) {
        double targetY = 0.0;
        for (Placement o : lp) {
            if (o == null || o == p) continue;
            if (!overlaps1d(p.x, p.x + p.l, o.x, o.x + o.l)) continue;

            if (o.y + o.w <= p.y + 1e-9) {
                targetY = Math.max(targetY, o.y + o.w);
            }
        }
        return buildCandidate(lp, p, p.x, targetY, L, W, belowRects, layer, minAllowedSupport);
    }

    private static Candidate candidateSlideUp(List<Placement> lp, Placement p, double L, double W,
                                              List<double[]> belowRects, int layer, double minAllowedSupport) {
        double targetY = W - p.w;
        for (Placement o : lp) {
            if (o == null || o == p) continue;
            if (!overlaps1d(p.x, p.x + p.l, o.x, o.x + o.l)) continue;

            if (o.y >= p.y + p.w - 1e-9) {
                targetY = Math.min(targetY, o.y - p.w);
            }
        }
        return buildCandidate(lp, p, p.x, targetY, L, W, belowRects, layer, minAllowedSupport);
    }

    private static Candidate buildCandidate(List<Placement> lp, Placement p, double x, double y,
                                            double L, double W, List<double[]> belowRects, int layer, double minAllowedSupport) {
        x = clamp(x, 0.0, L - p.l);
        y = clamp(y, 0.0, W - p.w);
        if (Math.abs(x - p.x) < 1e-9 && Math.abs(y - p.y) < 1e-9) return null;
        if (overlapsAny(lp, p, x, y)) return null;

        double support = (layer <= 1) ? 1.0 : supportRateAt(belowRects, x, y, p.l, p.w);
        if (layer > 1 && support + 1e-9 < minAllowedSupport) return null;

        double edge = edgeRateAt(lp, p, x, y, L, W);
        return new Candidate(x, y, support, edge);
    }

    private static boolean overlapsAny(List<Placement> lp, Placement p, double x, double y) {
        final double eps = 1e-9;
        double x2 = x + p.l, y2 = y + p.w;
        for (Placement o : lp) {
            if (o == null || o == p) continue;
            double ox1 = o.x, oy1 = o.y, ox2 = o.x + o.l, oy2 = o.y + o.w;
            if (x2 <= ox1 + eps || ox2 <= x + eps || y2 <= oy1 + eps || oy2 <= y + eps) continue;
            return true;
        }
        return false;
    }

    private static double supportRateAt(List<double[]> belowRects, double x, double y, double l, double w) {
        if (belowRects == null || belowRects.isEmpty()) return 0.0;
        double area = l * w;
        if (area <= 0) return 0.0;
        double overlap = 0.0;
        for (double[] r : belowRects) {
            overlap += intersect(x, y, l, w, r[0], r[1], r[2], r[3]);
        }
        return Math.min(overlap, area) / area;
    }

    private static double edgeRateAt(List<Placement> lp, Placement p, double x, double y, double L, double W) {
        double perim = 2.0 * (p.l + p.w);
        if (perim <= 0) return 0.0;
        double contact = 0.0;
        final double eps = 1e-6;


        if (Math.abs(x) < eps) contact += p.w;
        if (Math.abs(x + p.l - L) < eps) contact += p.w;
        if (Math.abs(y) < eps) contact += p.l;
        if (Math.abs(y + p.w - W) < eps) contact += p.l;


        for (Placement o : lp) {
            if (o == null || o == p) continue;

            if (Math.abs(o.x + o.l - x) < eps) contact += overlapLen(y, y + p.w, o.y, o.y + o.w);

            if (Math.abs(o.x - (x + p.l)) < eps) contact += overlapLen(y, y + p.w, o.y, o.y + o.w);

            if (Math.abs(o.y + o.w - y) < eps) contact += overlapLen(x, x + p.l, o.x, o.x + o.l);

            if (Math.abs(o.y - (y + p.w)) < eps) contact += overlapLen(x, x + p.l, o.x, o.x + o.l);
        }

        return Math.min(contact, perim) / perim;
    }

    private static boolean overlaps1d(double a1, double a2, double b1, double b2) {
        return Math.min(a2, b2) - Math.max(a1, b1) > 1e-9;
    }

    private static double overlapLen(double a1, double a2, double b1, double b2) {
        return Math.max(0.0, Math.min(a2, b2) - Math.max(a1, b1));
    }

    private static double clamp(double v, double lo, double hi) {
        if (v < lo) return lo;
        if (v > hi) return hi;
        return v;
    }

    private static class Candidate {
        final double x, y;
        final double support;
        final double edge;
        Candidate(double x, double y, double support, double edge) {
            this.x = x;
            this.y = y;
            this.support = support;
            this.edge = edge;
        }
    }

    private static class Placement {
        Long itemId;
        int unitIndex;
        int layer;
        double z;
        double x, y;
        double l, w, h;
        int rot;
        double support;
        double edge;
    }


    private static PlaceInfo tryPlaceWithPriority(LayerInfo layer, List<LayerInfo> allLayers,
                                                  double il, double iw, double ih,
                                                  double minSupport, int currentLayer) {
        double[][] ori = {{il, iw, 0}, {iw, il, 90}};
        PlaceInfo best = null;

        for (int fi = 0; fi < layer.freeRects.size(); fi++) {
            double[] fr = layer.freeRects.get(fi);
            double frArea = fr[2] * fr[3];
            for (double[] o : ori) {
                double l = o[0], w = o[1];
                int rot = (int) o[2];
                if (l > fr[2] + 1e-6 || w > fr[3] + 1e-6) continue;

                double support = calcSupport(layer, allLayers, fr[0], fr[1], l, w, currentLayer);
                if (currentLayer > 1 && support + 1e-9 < minSupport) continue;

                double edge = calcEdge(layer, fr[0], fr[1], l, w);
                double waste = frArea - (l * w);
                double shortSide = Math.min(fr[2] - l, fr[3] - w);

                PlaceInfo pi = new PlaceInfo(fi, fr[0], fr[1], l, w, rot, ih, support, edge, waste, shortSide);
                if (best == null || pi.betterThan(best)) best = pi;
            }
        }
        return best;
    }

    private static double calcSupport(LayerInfo curr, List<LayerInfo> all, double x, double y, double l, double w, int currentLayer) {
        if (currentLayer <= 1) return 1.0;
        LayerInfo below = null;
        for (LayerInfo li : all) {
            if (Objects.equals(li.cid, curr.cid) && li.layer == currentLayer - 1) {
                below = li;
                break;
            }
        }
        if (below == null || below.rects.isEmpty()) return 0.0;

        double area = l * w;
        if (area <= 0) return 0.0;

        double overlap = 0;
        for (double[] r : below.rects) overlap += intersect(x, y, l, w, r[0], r[1], r[2], r[3]);
        return Math.min(overlap, area) / area;
    }

    private static double calcEdge(LayerInfo layer, double x, double y, double l, double w) {
        double perim = 2.0 * (l + w);
        if (perim <= 0) return 0.0;

        double contact = 0;
        final double eps = 1e-6;


        if (Math.abs(x) < eps) contact += w;
        if (Math.abs(x + l - layer.L) < eps) contact += w;
        if (Math.abs(y) < eps) contact += l;
        if (Math.abs(y + w - layer.W) < eps) contact += l;


        for (double[] r : layer.rects) {
            if (Math.abs(r[0] + r[2] - x) < eps) contact += overlap1d(y, y + w, r[1], r[1] + r[3]);
            if (Math.abs(r[0] - x - l) < eps) contact += overlap1d(y, y + w, r[1], r[1] + r[3]);
            if (Math.abs(r[1] + r[3] - y) < eps) contact += overlap1d(x, x + l, r[0], r[0] + r[2]);
            if (Math.abs(r[1] - y - w) < eps) contact += overlap1d(x, x + l, r[0], r[0] + r[2]);
        }

        return Math.min(contact, perim) / perim;
    }

    private static double intersect(double ax, double ay, double al, double aw, double bx, double by, double bl, double bw) {
        double x1 = Math.max(ax, bx), y1 = Math.max(ay, by), x2 = Math.min(ax + al, bx + bl), y2 = Math.min(ay + aw, by + bw);
        return (x2 - x1 <= 0 || y2 - y1 <= 0) ? 0 : (x2 - x1) * (y2 - y1);
    }

    private static double overlap1d(double a1, double a2, double b1, double b2) {
        return Math.max(0, Math.min(a2, b2) - Math.max(a1, b1));
    }

    private static List<List<Container>> generateContainerOrders(List<Container> base) {
        List<Container> list = new ArrayList<>();
        for (Container c : base) if (c != null) list.add(c);
        if (list.isEmpty()) return List.of();

        List<List<Container>> orders = new ArrayList<>();
        orders.add(new ArrayList<>(list));

        List<Container> desc = new ArrayList<>(list);
        desc.sort((a, b) -> Double.compare(nz(b.getLengthMm()) * nz(b.getWidthMm()) * nz(b.getHeightMm()),
                nz(a.getLengthMm()) * nz(a.getWidthMm()) * nz(a.getHeightMm())));
        orders.add(desc);

        List<Container> asc = new ArrayList<>(list);
        asc.sort((a, b) -> Double.compare(nz(a.getLengthMm()) * nz(a.getWidthMm()) * nz(a.getHeightMm()),
                nz(b.getLengthMm()) * nz(b.getWidthMm()) * nz(b.getHeightMm())));
        orders.add(asc);

        return orders;
    }

    private static double calculateFillRate(List<PlanItemDetail> details, List<ItemUnit> units, List<Container> containers) {
        if (details == null || details.isEmpty()) return 0.0;

        Map<Long, ItemUnit> anyUnitByItemId = new HashMap<>();
        for (ItemUnit u : units) {
            if (u != null && u.itemId != null) anyUnitByItemId.putIfAbsent(u.itemId, u);
        }

        Map<Long, Container> cm = new HashMap<>();
        for (Container c : containers) if (c != null) cm.put(c.getContainerId(), c);

        Set<Long> used = new HashSet<>();
        double packed = 0;
        for (PlanItemDetail d : details) {
            if (d.getContainerInstanceId() != null) used.add(d.getContainerInstanceId());
            ItemUnit u = anyUnitByItemId.get(d.getItemId());
            if (u == null) continue;
            packed += u.l * u.w * u.h;
        }

        double total = 0;
        for (Long cid : used) {
            Container c = cm.get(cid);
            if (c != null) total += nz(c.getLengthMm()) * nz(c.getWidthMm()) * nz(c.getHeightMm());
        }
        return total > 0 ? (packed / total) * 100.0 : 0.0;
    }

    private static double averageSupport(List<PlanItemDetail> details) {
        if (details == null || details.isEmpty()) return 0.0;
        double sum = 0;
        int n = 0;
        for (PlanItemDetail d : details) {
            if (d == null || d.getSupportRate() == null) continue;
            sum += d.getSupportRate().doubleValue();
            n++;
        }
        return n == 0 ? 0.0 : sum / n;
    }

    private static double nz(Number v) { return v == null ? 0.0 : v.doubleValue(); }

    private static class ItemUnit {
        final Long itemId;
        final double l, w, h;

        ItemUnit(Long itemId, Integer l, Integer w, Integer h) {
            this.itemId = itemId;
            this.l = l == null ? 0.0 : l.doubleValue();
            this.w = w == null ? 0.0 : w.doubleValue();
            this.h = h == null ? 0.0 : h.doubleValue();
        }

        double baseArea() { return l * w; }
        double volume() { return l * w * h; }
        double perimeter() { return 2.0 * (l + w); }
        double maxSide() { return Math.max(l, w); }
    }

    private static class LayerInfo {
        final Long cid;
        final int layer;
        final double z;
        double height;
        final double L, W;
        final List<double[]> freeRects = new ArrayList<>();
        final List<double[]> rects = new ArrayList<>();

        LayerInfo(Long cid, int layer, double z, double L, double W) {
            this.cid = cid;
            this.layer = layer;
            this.z = z;
            this.L = L;
            this.W = W;
            freeRects.add(new double[]{0, 0, L, W});
        }

        void addRect(double x, double y, double l, double w) {
            rects.add(new double[]{x, y, l, w});
            for (int i = 0; i < freeRects.size(); i++) {
                double[] fr = freeRects.get(i);
                if (Math.abs(fr[0] - x) < 1e-6 && Math.abs(fr[1] - y) < 1e-6) {
                    freeRects.remove(i);
                    if (fr[2] - l > 1e-6 && w > 1e-6) freeRects.add(new double[]{x + l, y, fr[2] - l, w});
                    if (fr[3] - w > 1e-6) freeRects.add(new double[]{fr[0], y + w, fr[2], fr[3] - w});
                    break;
                }
            }
        }
    }

    private static class PlaceInfo {
        final int fi;
        final double x, y, l, w;
        final int rot;
        final double h;
        final double support;
        final double edge;
        final double waste;
        final double shortSide;

        PlaceInfo(int fi, double x, double y, double l, double w, int rot, double h,
                  double support, double edge, double waste, double shortSide) {
            this.fi = fi;
            this.x = x;
            this.y = y;
            this.l = l;
            this.w = w;
            this.rot = rot;
            this.h = h;
            this.support = support;
            this.edge = edge;
            this.waste = waste;
            this.shortSide = shortSide;
        }

        boolean betterThan(PlaceInfo other) {

            if (Math.abs(this.waste - other.waste) > 1e-9) return this.waste < other.waste;
            if (Math.abs(this.shortSide - other.shortSide) > 1e-9) return this.shortSide < other.shortSide;

            if (Math.abs(this.support - other.support) > 1e-9) return this.support > other.support;

            if (Math.abs(this.edge - other.edge) > 1e-9) return this.edge > other.edge;

            return this.rot < other.rot;
        }
    }

    private static class TrialResult {
        final List<PlanItemDetail> details;
        final double fillRate;
        final double avgSupportRate;
        final double avgEdgeRate;
        final List<Integer> usedUnitIndexes;
        final double sumEdge;
        final int edgeCount;

        TrialResult(List<PlanItemDetail> details, double fillRate, double avgSupportRate, double avgEdgeRate,
                    List<Integer> usedUnitIndexes, double sumEdge, int edgeCount) {
            this.details = details == null ? List.of() : details;
            this.fillRate = fillRate;
            this.avgSupportRate = avgSupportRate;
            this.avgEdgeRate = avgEdgeRate;
            this.usedUnitIndexes = usedUnitIndexes == null ? List.of() : usedUnitIndexes;
            this.sumEdge = sumEdge;
            this.edgeCount = edgeCount;
        }

        boolean betterThan(TrialResult other) {
            if (other == null) return true;
            if (Math.abs(this.fillRate - other.fillRate) > 1e-9) return this.fillRate > other.fillRate;
            if (Math.abs(this.avgSupportRate - other.avgSupportRate) > 1e-9) return this.avgSupportRate > other.avgSupportRate;
            if (Math.abs(this.avgEdgeRate - other.avgEdgeRate) > 1e-9) return this.avgEdgeRate > other.avgEdgeRate;
            return this.details.size() > other.details.size();
        }
    }
}
