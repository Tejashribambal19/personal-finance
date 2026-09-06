package com.finance.dashboard.dto;

import java.math.BigDecimal;

public record CategoryBreakdownResponse(

        Long categoryId,

        String categoryName,

        BigDecimal amount,

        BigDecimal percentage

) {
}