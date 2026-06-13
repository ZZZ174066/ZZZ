package com.tsj.dto;

import lombok.Data;

@Data
public class OrderImportRequest {
    private String orderText;
    private String planName;

    private Long replacePlanId;
}
