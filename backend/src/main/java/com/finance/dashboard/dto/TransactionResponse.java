package com.finance.dashboard.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import com.finance.dashboard.entity.TransactionType;

public record TransactionResponse(

        Long id,

        Long userId,

        Long categoryId,

        String categoryName,

        TransactionType type,

        BigDecimal amount,

        String description,

        LocalDate transactionDate,

        LocalDateTime createdAt,

        LocalDateTime updatedAt

) {
}