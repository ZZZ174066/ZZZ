package com.tsj.entity;

import lombok.Data;

@Data
public class PlanContainer {

    private Long id;

    private Long planId;

    private Long containerId;

    private Integer containerQty;
}
