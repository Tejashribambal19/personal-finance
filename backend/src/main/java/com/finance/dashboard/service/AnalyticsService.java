package com.finance.dashboard.service;

import com.finance.dashboard.dto.AnalyticsSummaryResponse;
import com.finance.dashboard.dto.CategoryBreakdownResponse;
import com.finance.dashboard.dto.MonthlyComparisonResponse;
import com.finance.dashboard.dto.MonthlyTrendResponse;
import com.finance.dashboard.entity.TransactionType;
import com.finance.dashboard.repository.TransactionRepository;
import com.finance.dashboard.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.Month;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;

@Service
public class AnalyticsService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    public AnalyticsService(
            TransactionRepository transactionRepository,
            UserRepository userRepository
    ) {
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
    }


    // =============================
    // SUMMARY
    // =============================

    @Transactional(readOnly = true)
    public AnalyticsSummaryResponse getSummary(Long userId) {

        validateUser(userId);

        BigDecimal totalIncome =
                transactionRepository.sumAmountByUserAndType(
                        userId,
                        TransactionType.INCOME
                );

        BigDecimal totalExpense =
                transactionRepository.sumAmountByUserAndType(
                        userId,
                        TransactionType.EXPENSE
                );

        BigDecimal balance =
                totalIncome.subtract(totalExpense);

        return new AnalyticsSummaryResponse(
                totalIncome,
                totalExpense,
                balance
        );
    }


    // =============================
    // CATEGORY BREAKDOWN
    // =============================

    @Transactional(readOnly = true)
    public List<CategoryBreakdownResponse> getCategoryBreakdown(
            Long userId,
            Integer year,
            Integer month
    ) {

        validateUser(userId);
        validateMonth(month);

        List<Object[]> results =
                transactionRepository.getCategoryBreakdown(
                        userId,
                        TransactionType.EXPENSE,
                        year,
                        month
                );

        BigDecimal totalExpense = results.stream()
                .map(row -> (BigDecimal) row[2])
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return results.stream()
                .map(row -> {

                    Long categoryId = (Long) row[0];

                    String categoryName =
                            (String) row[1];

                    BigDecimal amount =
                            (BigDecimal) row[2];

                    BigDecimal percentage =
                            BigDecimal.ZERO;

                    if (totalExpense.compareTo(BigDecimal.ZERO) > 0) {

                        percentage = amount
                                .multiply(BigDecimal.valueOf(100))
                                .divide(
                                        totalExpense,
                                        2,
                                        RoundingMode.HALF_UP
                                );
                    }

                    return new CategoryBreakdownResponse(
                            categoryId,
                            categoryName,
                            amount,
                            percentage
                    );
                })
                .toList();
    }


    // =============================
    // MONTHLY TREND
    // =============================

    @Transactional(readOnly = true)
    public List<MonthlyTrendResponse> getMonthlyTrend(
            Long userId,
            Integer year
    ) {

        validateUser(userId);

        List<Object[]> databaseResults =
                transactionRepository.getMonthlyTrend(
                        userId,
                        year
                );

        List<MonthlyTrendResponse> response =
                new ArrayList<>();

        for (int month = 1; month <= 12; month++) {

            BigDecimal income = BigDecimal.ZERO;
            BigDecimal expense = BigDecimal.ZERO;

            for (Object[] row : databaseResults) {

                Integer rowMonth =
                        ((Number) row[0]).intValue();

                TransactionType type =
                        (TransactionType) row[1];

                BigDecimal amount =
                        (BigDecimal) row[2];

                if (rowMonth == month) {

                    if (type == TransactionType.INCOME) {
                        income = amount;
                    }

                    if (type == TransactionType.EXPENSE) {
                        expense = amount;
                    }
                }
            }

            BigDecimal balance =
                    income.subtract(expense);

            response.add(
                    new MonthlyTrendResponse(
                            month,
                            Month.of(month).name(),
                            income,
                            expense,
                            balance
                    )
            );
        }

        return response;
    }


    // =============================
    // MONTH-OVER-MONTH COMPARISON
    // =============================

    @Transactional(readOnly = true)
    public MonthlyComparisonResponse getMonthlyComparison(
            Long userId,
            Integer year,
            Integer month
    ) {

        validateUser(userId);
        validateMonth(month);

        YearMonth current =
                YearMonth.of(year, month);

        YearMonth previous =
                current.minusMonths(1);

        LocalDate currentStart =
                current.atDay(1);

        LocalDate currentEnd =
                current.atEndOfMonth();

        LocalDate previousStart =
                previous.atDay(1);

        LocalDate previousEnd =
                previous.atEndOfMonth();

        BigDecimal currentExpense =
                transactionRepository.sumAmountByDateRange(
                        userId,
                        TransactionType.EXPENSE,
                        currentStart,
                        currentEnd
                );

        BigDecimal previousExpense =
                transactionRepository.sumAmountByDateRange(
                        userId,
                        TransactionType.EXPENSE,
                        previousStart,
                        previousEnd
                );

        BigDecimal difference =
                currentExpense.subtract(previousExpense);

        BigDecimal percentageChange = null;

        if (previousExpense.compareTo(BigDecimal.ZERO) != 0) {

            percentageChange = difference
                    .multiply(BigDecimal.valueOf(100))
                    .divide(
                            previousExpense,
                            2,
                            RoundingMode.HALF_UP
                    );
        }

        return new MonthlyComparisonResponse(
                currentExpense,
                previousExpense,
                difference,
                percentageChange
        );
    }


    private void validateUser(Long userId) {

        if (!userRepository.existsById(userId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "User not found"
            );
        }
    }

    private void validateMonth(Integer month) {

        if (month == null || month < 1 || month > 12) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Month must be between 1 and 12"
            );
        }
    }
}