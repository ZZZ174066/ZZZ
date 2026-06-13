package com.tsj.entity;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class Container {

    private Long containerId;

    private String containerName;

    private Integer lengthMm;

    private Integer widthMm;

    private Integer heightMm;

    private Integer quantity;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;


    private Boolean orderImported;
}
