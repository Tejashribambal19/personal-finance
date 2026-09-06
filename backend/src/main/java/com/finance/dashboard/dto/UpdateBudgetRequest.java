package com.finance.dashboard.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

public record UpdateBudgetRequest(

        @NotNull(message = "Budget amount is required")
        @DecimalMin(
                value = "0.01",
                message = "Budget amount must be greater than zero"
        )
        BigDecimal amount

) {
}