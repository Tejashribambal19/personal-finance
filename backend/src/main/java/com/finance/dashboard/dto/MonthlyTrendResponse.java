package com.finance.dashboard.dto;

import java.math.BigDecimal;

public record MonthlyTrendResponse(

        Integer month,

        String monthName,

        BigDecimal income,

        BigDecimal expense,

        BigDecimal balance

) {
}