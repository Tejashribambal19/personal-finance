package com.finance.dashboard.dto;

public record AuthResponse(

        String token,
        String tokenType,
        Long userId,
        String name,
        String email

) {
}