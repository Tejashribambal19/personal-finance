package com.finance.dashboard.dto;

import java.math.BigDecimal;

public record BudgetResponse(

        Long id,

        Long categoryId,

        String categoryName,

        BigDecimal budgetAmount,

        BigDecimal spentAmount,

        BigDecimal remainingAmount,

        BigDecimal percentageUsed,

        Integer month,

        Integer year,

        String status

) {
}