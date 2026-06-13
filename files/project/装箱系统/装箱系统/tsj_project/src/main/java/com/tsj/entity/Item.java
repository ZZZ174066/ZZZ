package com.tsj.entity;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class Item {

    private Long itemId;

    private String itemName;

    private Integer lengthMm;

    private Integer widthMm;

    private Integer heightMm;

    private Integer quantity;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;


    private Boolean orderImported;
}
