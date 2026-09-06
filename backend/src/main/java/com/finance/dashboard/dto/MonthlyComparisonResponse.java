package com.finance.dashboard.dto;

import java.math.BigDecimal;

public record MonthlyComparisonResponse(

        BigDecimal currentMonthExpense,

        BigDecimal previousMonthExpense,

        BigDecimal difference,

        BigDecimal percentageChange

) {
}