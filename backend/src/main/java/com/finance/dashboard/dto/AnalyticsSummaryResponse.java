package com.finance.dashboard.dto;

import java.math.BigDecimal;

public record AnalyticsSummaryResponse(

        BigDecimal totalIncome,

        BigDecimal totalExpense,

        BigDecimal balance

) {
}