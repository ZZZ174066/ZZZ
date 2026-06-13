package com.tsj.entity;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class PlanItemDetail {

    private Long id;

    private Long planId;

    private Long itemId;

    private Integer loaded;

    private Long containerInstanceId;

    private Integer layerIndex;

    private BigDecimal posX;

    private BigDecimal posY;

    private BigDecimal posZ;

    private Integer swapLengthWidth;

    private BigDecimal supportRate;
}
