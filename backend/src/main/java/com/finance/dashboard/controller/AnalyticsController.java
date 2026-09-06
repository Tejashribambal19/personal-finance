package com.finance.dashboard.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.finance.dashboard.dto.AnalyticsSummaryResponse;
import com.finance.dashboard.dto.CategoryBreakdownResponse;
import com.finance.dashboard.dto.MonthlyComparisonResponse;
import com.finance.dashboard.dto.MonthlyTrendResponse;
import com.finance.dashboard.security.CurrentUserService;
import com.finance.dashboard.service.AnalyticsService;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;
    private final CurrentUserService currentUserService;

    public AnalyticsController(
            AnalyticsService analyticsService,
            CurrentUserService currentUserService
    ) {
        this.analyticsService = analyticsService;
        this.currentUserService = currentUserService;
    }

    @GetMapping("/summary")
    public ResponseEntity<AnalyticsSummaryResponse> getSummary() {

        Long userId = currentUserService.getCurrentUserId();

        return ResponseEntity.ok(
                analyticsService.getSummary(userId)
        );
    }

    @GetMapping("/category-breakdown")
    public ResponseEntity<List<CategoryBreakdownResponse>>
    getCategoryBreakdown(
            @RequestParam Integer year,
            @RequestParam Integer month
    ) {

        Long userId = currentUserService.getCurrentUserId();

        return ResponseEntity.ok(
                analyticsService.getCategoryBreakdown(
                        userId,
                        year,
                        month
                )
        );
    }

    @GetMapping("/monthly-trend")
    public ResponseEntity<List<MonthlyTrendResponse>>
    getMonthlyTrend(
            @RequestParam Integer year
    ) {

        Long userId = currentUserService.getCurrentUserId();

        return ResponseEntity.ok(
                analyticsService.getMonthlyTrend(
                        userId,
                        year
                )
        );
    }

    @GetMapping("/monthly-comparison")
    public ResponseEntity<MonthlyComparisonResponse>
    getMonthlyComparison(
            @RequestParam Integer year,
            @RequestParam Integer month
    ) {

        Long userId = currentUserService.getCurrentUserId();

        return ResponseEntity.ok(
                analyticsService.getMonthlyComparison(
                        userId,
                        year,
                        month
                )
        );
    }
}