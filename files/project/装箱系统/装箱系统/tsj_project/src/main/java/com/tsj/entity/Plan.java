package com.tsj.entity;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class Plan {

    private Long planId;

    private String planName;

    private Integer plannedTotalItemQty;

    private Integer actualTotalItemQty;

    private BigDecimal avgItemSupportRate;

    private Integer plannedTotalContainerQty;

    private Integer actualTotalContainerQty;

    private BigDecimal avgFilledContainerFillRate;

    private Integer planStatus;

    private Integer needUpdate;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
