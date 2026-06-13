package com.tsj.entity;

import lombok.Data;

@Data
public class PlanItem {

    private Long id;

    private Long planId;

    private Long itemId;

    private Integer itemQty;
}
