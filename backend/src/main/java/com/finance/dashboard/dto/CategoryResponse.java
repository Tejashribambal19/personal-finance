package com.finance.dashboard.dto;

import java.time.LocalDateTime;

import com.finance.dashboard.entity.TransactionType;

public record CategoryResponse(
        Long id,
        String name,
        TransactionType type,
        Long userId,
        LocalDateTime createdAt
        ) {

}
