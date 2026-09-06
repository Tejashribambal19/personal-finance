package com.finance.dashboard.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.finance.dashboard.entity.Budget;

public interface BudgetRepository
        extends JpaRepository<Budget, Long> {

    List<Budget> findByUserIdAndYearAndMonthOrderByCategoryNameAsc(
            Long userId,
            Integer year,
            Integer month
    );

    Optional<Budget> findByIdAndUserId(
            Long budgetId,
            Long userId
    );

    boolean existsByUserIdAndCategoryIdAndYearAndMonth(
            Long userId,
            Long categoryId,
            Integer year,
            Integer month
    );
}