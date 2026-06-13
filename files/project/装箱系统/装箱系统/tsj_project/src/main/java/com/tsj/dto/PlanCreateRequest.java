package com.tsj.dto;

import lombok.Data;

import java.util.List;

@Data
public class PlanCreateRequest {

    private String planName;

    private Integer plannedTotalItemQty;

    private Integer plannedTotalContainerQty;

    private Integer needUpdate;

    private List<ItemRef> items;

    private List<ContainerRef> containers;

    @Data
    public static class ItemRef {
        private Long itemId;
        private Integer quantity;
    }

    @Data
    public static class ContainerRef {
        private Long containerId;
        private Integer quantity;
    }
}
