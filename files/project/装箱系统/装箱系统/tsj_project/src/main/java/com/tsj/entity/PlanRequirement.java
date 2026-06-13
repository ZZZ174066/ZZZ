package com.tsj.entity;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PlanRequirement {

    private Long id;

    private Long planId;

    private Integer finished;

    private String content;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
