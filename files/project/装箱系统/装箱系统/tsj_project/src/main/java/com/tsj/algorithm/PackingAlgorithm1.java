package com.tsj.algorithm;

import com.tsj.dto.PackingLlmConstraints;
import com.tsj.entity.Container;
import com.tsj.entity.Item;
import com.tsj.entity.PlanItemDetail;

import java.math.BigDecimal;
import java.util.*;

public class PackingAlgorithm1 {

    public static final String DISPLAY_NAME = "常规算法";

    public static List<PlanItemDetail> optimize(List<Item> items, List<Container> containers, double minSupportRate) {
        return optimize(items, containers, minSupportRate, null);
    }


    public static List<PlanItemDetail> optimize(List<Item> items, List<Container> containers, double minSupportRate, PackingLlmConstraints llmConstraints) {
        List<PlanItemDetail> empty = new ArrayList<>();
        if (items == null || containers == null || items.isEmpty() || containers.isEmpty()) return empty;

        List<Container> baseContainers = new ArrayList<>();
        for (Container c : containers) if (c != null) baseContainers.add(c);
        if (baseContainers.isEmpty()) return empty;

        List<List<Container>> orders = generateContainerOrders(baseContainers);
        List<PlanItemDetail> best = empty;
        double bestFill = -1.0;

        for (List<Container> order : orders) {
            List<PlanItemDetail> result = packWithFillRatePriority(items, order, minSupportRate, llmConstraints);
            if (result == null || result.isEmpty()) continue;
            double fill = calculateFillRate(result, items, order);
            if (fill > bestFill + 1e-9) {
                best = result;
                bestFill = fill;
            }
        }
        return best;
    }

    private static List<PlanItemDetail> packWithFillRatePriority(List<Item> items, List<Container> containers, double minSupportRate, PackingLlmConstraints llmConstraints) {
        List<PlanItemDetail> result = new ArrayList<>();
        List<ItemUnit> units = new ArrayList<>();
        for (Item it : items) {
            int q = it.getQuantity() == null ? 0 : it.getQuantity();
            for (int i = 0; i < q; i++) units.add(new ItemUnit(it));
        }
        if (units.isEmpty()) return result;

        for (Container c : containers) {
            if (units.isEmpty()) break;
            if (c == null) continue;
            packContainer(c, units, result, minSupportRate, llmConstraints);
        }
        return result;
    }

    private static void packContainer(Container c, List<ItemUnit> units, List<PlanItemDetail> result, double minSupportRate, PackingLlmConstraints llmConstraints) {
        double L = nz(c.getLengthMm()), W = nz(c.getWidthMm()), H = nz(c.getHeightMm());
        if (L <= 0 || W <= 0 || H <= 0) return;

        List<LayerInfo> layers = new ArrayList<>();
        double z = 0;
        int layer = 1;

        while (!units.isEmpty() && z < H - 1e-6) {
            LayerInfo li = new LayerInfo(c.getContainerId(), layer, z, L, W);
            double maxH = 0;
            boolean placed = false;

            units.sort((a, b) -> Double.compare(b.baseArea(), a.baseArea()));

            boolean progress = true;
            while (progress && !units.isEmpty()) {
                progress = false;
                for (int i = 0; i < units.size(); i++) {
                    ItemUnit u = units.get(i);
                    double il = nz(u.item.getLengthMm()), iw = nz(u.item.getWidthMm()), ih = nz(u.item.getHeightMm());
                    if (il <= 0 || iw <= 0 || ih <= 0) continue;
                    if (z + Math.max(maxH, ih) > H + 1e-6) continue;

                    if (shouldSkipAsForbiddenBottomLayer(llmConstraints, layer, li, units, u)) {
                        continue;
                    }

                    PlaceInfo pi = tryPlace(li, layers, il, iw, ih, minSupportRate, layer);
                    if (pi != null) {
                        PlanItemDetail d = new PlanItemDetail();
                        d.setItemId(u.item.getItemId());
                        d.setContainerInstanceId(c.getContainerId());
                        d.setLayerIndex(layer);
                        d.setPosX(BigDecimal.valueOf(pi.x));
                        d.setPosY(BigDecimal.valueOf(pi.y));
                        d.setPosZ(BigDecimal.valueOf(z));
                        d.setSwapLengthWidth(pi.rot == 90 ? 1 : 0);
                        d.setSupportRate(BigDecimal.valueOf(pi.support * 100.0));
                        result.add(d);

                        li.addRect(pi.x, pi.y, pi.l, pi.w);
                        maxH = Math.max(maxH, ih);
                        placed = true;
                        units.remove(i);
                        progress = true;
                        break;
                    }
                }
            }

            if (placed) {
                li.height = maxH;
                layers.add(li);
                z += maxH;
                layer++;
            } else {
                break;
            }
        }
    }


    private static boolean shouldSkipAsForbiddenBottomLayer(PackingLlmConstraints c, int layer, LayerInfo li, List<ItemUnit> units, ItemUnit u) {
        if (c == null || !c.hasBottomLayerRules() || layer != 1) return false;
        Long itemId = u.item.getItemId();
        if (itemId == null || !c.getForbiddenBottomLayerItemIds().contains(itemId)) return false;
        if (!li.rects.isEmpty()) {
            return true;
        }
        for (ItemUnit uu : units) {
            Long id = uu.item.getItemId();
            if (id == null || !c.getForbiddenBottomLayerItemIds().contains(id)) {
                return true;
            }
        }
        return false;
    }

    private static PlaceInfo tryPlace(LayerInfo layer, List<LayerInfo> allLayers, double il, double iw, double ih, double minSupport, int currentLayer) {
        double[][] ori = {{il, iw, 0}, {iw, il, 90}};
        PlaceInfo best = null;

        for (int fi = 0; fi < layer.freeRects.size(); fi++) {
            double[] fr = layer.freeRects.get(fi);
            for (double[] o : ori) {
                double l = o[0], w = o[1];
                int rot = (int) o[2];
                if (l > fr[2] + 1e-6 || w > fr[3] + 1e-6) continue;

                double support = calcSupport(layer, allLayers, fr[0], fr[1], l, w, currentLayer);

                if (currentLayer > 1 && support + 1e-9 < minSupport) continue;

                double edge = calcEdge(layer, fr[0], fr[1], l, w);
                PlaceInfo pi = new PlaceInfo(fi, fr[0], fr[1], l, w, rot, ih, support, edge);

                if (best == null || pi.support > best.support + 1e-9) best = pi;
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
        for (double[] r : below.rects) {
            overlap += intersect(x, y, l, w, r[0], r[1], r[2], r[3]);
        }
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
        List<List<Container>> orders = new ArrayList<>();
        orders.add(new ArrayList<>(base));

        List<Container> desc = new ArrayList<>(base);
        desc.sort((a, b) -> Double.compare(nz(b.getLengthMm()) * nz(b.getWidthMm()) * nz(b.getHeightMm()),
                nz(a.getLengthMm()) * nz(a.getWidthMm()) * nz(a.getHeightMm())));
        orders.add(desc);

        List<Container> asc = new ArrayList<>(base);
        asc.sort((a, b) -> Double.compare(nz(a.getLengthMm()) * nz(a.getWidthMm()) * nz(a.getHeightMm()),
                nz(b.getLengthMm()) * nz(b.getWidthMm()) * nz(b.getHeightMm())));
        orders.add(asc);
        return orders;
    }

    private static double calculateFillRate(List<PlanItemDetail> details, List<Item> items, List<Container> containers) {
        if (details == null || details.isEmpty()) return 0.0;

        Map<Long, Item> im = new HashMap<>();
        for (Item it : items) if (it != null) im.put(it.getItemId(), it);

        Map<Long, Container> cm = new HashMap<>();
        for (Container c : containers) if (c != null) cm.put(c.getContainerId(), c);

        Set<Long> used = new HashSet<>();
        double packed = 0;
        for (PlanItemDetail d : details) {
            if (d.getContainerInstanceId() != null) used.add(d.getContainerInstanceId());
            Item it = im.get(d.getItemId());
            if (it == null) continue;
            packed += nz(it.getLengthMm()) * nz(it.getWidthMm()) * nz(it.getHeightMm());
        }

        double total = 0;
        for (Long cid : used) {
            Container c = cm.get(cid);
            if (c != null) total += nz(c.getLengthMm()) * nz(c.getWidthMm()) * nz(c.getHeightMm());
        }

        return total > 0 ? (packed / total) * 100.0 : 0.0;
    }

    private static double nz(Number v) { return v == null ? 0.0 : v.doubleValue(); }

    private static class ItemUnit {
        final Item item;
        ItemUnit(Item item) { this.item = item; }
        double baseArea() { return nz(item.getLengthMm()) * nz(item.getWidthMm()); }
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

        PlaceInfo(int fi, double x, double y, double l, double w, int rot, double h, double support, double edge) {
            this.fi = fi;
            this.x = x;
            this.y = y;
            this.l = l;
            this.w = w;
            this.rot = rot;
            this.h = h;
            this.support = support;
            this.edge = edge;
        }
    }
}
