package com.tsj.entity;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class PlanContainerDetail {

    private Long id;

    private Long planId;

    private Long containerId;

    private Integer filled;

    private Integer filledItemQty;

    private BigDecimal fillRate;

    private BigDecimal avgSupportRate;
}
