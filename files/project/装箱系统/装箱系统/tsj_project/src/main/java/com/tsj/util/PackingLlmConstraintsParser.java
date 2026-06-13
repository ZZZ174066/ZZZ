package com.tsj.util;

import com.tsj.dto.PackingLlmConstraints;

import java.util.*;


public final class PackingLlmConstraintsParser {

    private PackingLlmConstraintsParser() {
    }

    @SuppressWarnings("unchecked")
    public static PackingLlmConstraints fromRequestBody(Map<String, Object> body) {
        if (body == null || body.isEmpty()) {
            return PackingLlmConstraints.empty();
        }
        Object raw = body.get("packingConstraintsForRegeneration");
        if (raw == null) {
            raw = body.get("constraints");
        }
        if (raw instanceof Map) {
            return fromNestedMap((Map<String, Object>) raw);
        }
        if (body.containsKey("forbiddenBottomLayerItemIds")) {
            return fromNestedMap(body);
        }
        return PackingLlmConstraints.empty();
    }

    private static PackingLlmConstraints fromNestedMap(Map<String, Object> m) {
        PackingLlmConstraints c = PackingLlmConstraints.empty();
        Object ids = m.get("forbiddenBottomLayerItemIds");
        if (ids == null) {
            ids = m.get("noBottomLayerItemIds");
        }
        if (ids instanceof List<?> list) {
            Set<Long> set = new HashSet<>();
            for (Object x : list) {
                if (x == null) continue;
                if (x instanceof Number) {
                    set.add(((Number) x).longValue());
                } else {
                    String s = x.toString().trim();
                    if (!s.isEmpty()) {
                        set.add(Long.parseLong(s));
                    }
                }
            }
            c.setForbiddenBottomLayerItemIds(set);
        }
        return c;
    }
}
