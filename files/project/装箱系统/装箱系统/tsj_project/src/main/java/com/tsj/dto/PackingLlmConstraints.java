package com.tsj.dto;

import java.util.HashSet;
import java.util.Set;


public class PackingLlmConstraints {


    private Set<Long> forbiddenBottomLayerItemIds = new HashSet<>();

    public Set<Long> getForbiddenBottomLayerItemIds() {
        return forbiddenBottomLayerItemIds;
    }

    public void setForbiddenBottomLayerItemIds(Set<Long> forbiddenBottomLayerItemIds) {
        this.forbiddenBottomLayerItemIds = forbiddenBottomLayerItemIds != null
                ? forbiddenBottomLayerItemIds
                : new HashSet<>();
    }

    public static PackingLlmConstraints empty() {
        return new PackingLlmConstraints();
    }

    public boolean hasBottomLayerRules() {
        return forbiddenBottomLayerItemIds != null && !forbiddenBottomLayerItemIds.isEmpty();
    }
}
