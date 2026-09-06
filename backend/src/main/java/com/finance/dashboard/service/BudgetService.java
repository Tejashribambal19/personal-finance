package com.finance.dashboard.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.finance.dashboard.dto.BudgetResponse;
import com.finance.dashboard.dto.CreateBudgetRequest;
import com.finance.dashboard.dto.UpdateBudgetRequest;
import com.finance.dashboard.entity.Budget;
import com.finance.dashboard.entity.Category;
import com.finance.dashboard.entity.TransactionType;
import com.finance.dashboard.entity.User;
import com.finance.dashboard.repository.BudgetRepository;
import com.finance.dashboard.repository.CategoryRepository;
import com.finance.dashboard.repository.TransactionRepository;
import com.finance.dashboard.repository.UserRepository;

@Service
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final TransactionRepository transactionRepository;

    public BudgetService(
            BudgetRepository budgetRepository,
            UserRepository userRepository,
            CategoryRepository categoryRepository,
            TransactionRepository transactionRepository
    ) {
        this.budgetRepository = budgetRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.transactionRepository = transactionRepository;
    }

    @Transactional
    public BudgetResponse createBudget(
            Long userId,
            CreateBudgetRequest request
    ) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "User not found"
                ));

        Category category = categoryRepository
                .findByIdAndUserId(request.categoryId(), userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Category not found"
                ));

        if (category.getType() != TransactionType.EXPENSE) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Budgets can only be created for expense categories"
            );
        }

        boolean exists =
                budgetRepository
                        .existsByUserIdAndCategoryIdAndYearAndMonth(
                                userId,
                                category.getId(),
                                request.year(),
                                request.month()
                        );

        if (exists) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Budget already exists for this category and month"
            );
        }

        Budget budget = Budget.builder()
                .user(user)
                .category(category)
                .amount(request.amount())
                .month(request.month())
                .year(request.year())
                .build();

        Budget savedBudget =
                budgetRepository.save(budget);

        return toResponse(savedBudget);
    }

    @Transactional(readOnly = true)
    public List<BudgetResponse> getBudgets(
            Long userId,
            Integer year,
            Integer month
    ) {

        if (!userRepository.existsById(userId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "User not found"
            );
        }

        return budgetRepository
                .findByUserIdAndYearAndMonthOrderByCategoryNameAsc(
                        userId,
                        year,
                        month
                )
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public BudgetResponse updateBudget(
            Long userId,
            Long budgetId,
            UpdateBudgetRequest request
    ) {

        Budget budget = budgetRepository
                .findByIdAndUserId(budgetId, userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Budget not found"
                ));

        budget.setAmount(request.amount());

        Budget savedBudget =
                budgetRepository.save(budget);

        return toResponse(savedBudget);
    }

    @Transactional
    public void deleteBudget(
            Long userId,
            Long budgetId
    ) {

        Budget budget = budgetRepository
                .findByIdAndUserId(budgetId, userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Budget not found"
                ));

        budgetRepository.delete(budget);
    }

    private BudgetResponse toResponse(Budget budget) {

        BigDecimal spent =
                transactionRepository.sumExpenseByCategoryAndMonth(
                        budget.getUser().getId(),
                        budget.getCategory().getId(),
                        budget.getYear(),
                        budget.getMonth()
                );

        BigDecimal remaining =
                budget.getAmount().subtract(spent);

        BigDecimal percentageUsed =
                spent
                        .multiply(BigDecimal.valueOf(100))
                        .divide(
                                budget.getAmount(),
                                2,
                                RoundingMode.HALF_UP
                        );

        String status;

        if (percentageUsed.compareTo(
                BigDecimal.valueOf(100)) >= 0) {

            status = "EXCEEDED";

        } else if (percentageUsed.compareTo(
                BigDecimal.valueOf(80)) >= 0) {

            status = "WARNING";

        } else {

            status = "SAFE";
        }

        return new BudgetResponse(
                budget.getId(),
                budget.getCategory().getId(),
                budget.getCategory().getName(),
                budget.getAmount(),
                spent,
                remaining,
                percentageUsed,
                budget.getMonth(),
                budget.getYear(),
                status
        );
    }
}