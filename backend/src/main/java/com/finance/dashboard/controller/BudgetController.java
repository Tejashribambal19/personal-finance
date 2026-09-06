package com.finance.dashboard.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.finance.dashboard.dto.BudgetResponse;
import com.finance.dashboard.dto.CreateBudgetRequest;
import com.finance.dashboard.dto.UpdateBudgetRequest;
import com.finance.dashboard.security.CurrentUserService;
import com.finance.dashboard.service.BudgetService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/budgets")
public class BudgetController {

    private final BudgetService budgetService;
    private final CurrentUserService currentUserService;

    public BudgetController(
            BudgetService budgetService,
            CurrentUserService currentUserService
    ) {
        this.budgetService = budgetService;
        this.currentUserService = currentUserService;
    }

    @PostMapping
    public ResponseEntity<BudgetResponse> createBudget(
            @Valid @RequestBody CreateBudgetRequest request
    ) {

        Long userId = currentUserService.getCurrentUserId();

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        budgetService.createBudget(
                                userId,
                                request
                        )
                );
    }

    @GetMapping
    public ResponseEntity<List<BudgetResponse>> getBudgets(
            @RequestParam Integer year,
            @RequestParam Integer month
    ) {

        Long userId = currentUserService.getCurrentUserId();

        return ResponseEntity.ok(
                budgetService.getBudgets(
                        userId,
                        year,
                        month
                )
        );
    }

    @PutMapping("/{budgetId}")
    public ResponseEntity<BudgetResponse> updateBudget(
            @PathVariable Long budgetId,
            @Valid @RequestBody UpdateBudgetRequest request
    ) {

        Long userId = currentUserService.getCurrentUserId();

        return ResponseEntity.ok(
                budgetService.updateBudget(
                        userId,
                        budgetId,
                        request
                )
        );
    }

    @DeleteMapping("/{budgetId}")
    public ResponseEntity<Void> deleteBudget(
            @PathVariable Long budgetId
    ) {

        Long userId = currentUserService.getCurrentUserId();

        budgetService.deleteBudget(
                userId,
                budgetId
        );

        return ResponseEntity.noContent().build();
    }
}