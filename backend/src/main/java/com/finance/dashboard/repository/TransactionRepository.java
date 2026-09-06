package com.finance.dashboard.repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.finance.dashboard.entity.Transaction;
import com.finance.dashboard.entity.TransactionType;

public interface TransactionRepository
        extends JpaRepository<Transaction, Long> {

    List<Transaction>
            findByUserIdOrderByTransactionDateDescIdDesc(Long userId);

    Optional<Transaction>
            findByIdAndUserId(Long transactionId, Long userId);

    // =========================
    // Overall summary
    // =========================
    @Query("""
            SELECT COALESCE(SUM(t.amount), 0)
            FROM Transaction t
            WHERE t.user.id = :userId
            AND t.type = :type
            """)
    BigDecimal sumAmountByUserAndType(
            @Param("userId") Long userId,
            @Param("type") TransactionType type
    );

    // =========================
    // Category breakdown
    // =========================
    @Query("""
            SELECT
                t.category.id,
                t.category.name,
                SUM(t.amount)
            FROM Transaction t
            WHERE t.user.id = :userId
            AND t.type = :type
            AND YEAR(t.transactionDate) = :year
            AND MONTH(t.transactionDate) = :month
            GROUP BY t.category.id, t.category.name
            ORDER BY SUM(t.amount) DESC
            """)
    List<Object[]> getCategoryBreakdown(
            @Param("userId") Long userId,
            @Param("type") TransactionType type,
            @Param("year") Integer year,
            @Param("month") Integer month
    );

    // =========================
    // Monthly trend
    // =========================
    @Query("""
            SELECT
                MONTH(t.transactionDate),
                t.type,
                SUM(t.amount)
            FROM Transaction t
            WHERE t.user.id = :userId
            AND YEAR(t.transactionDate) = :year
            GROUP BY MONTH(t.transactionDate), t.type
            ORDER BY MONTH(t.transactionDate)
            """)
    List<Object[]> getMonthlyTrend(
            @Param("userId") Long userId,
            @Param("year") Integer year
    );

    // =========================
    // Date-range totals
    // =========================
    @Query("""
            SELECT COALESCE(SUM(t.amount), 0)
            FROM Transaction t
            WHERE t.user.id = :userId
            AND t.type = :type
            AND t.transactionDate BETWEEN :startDate AND :endDate
            """)
    BigDecimal sumAmountByDateRange(
            @Param("userId") Long userId,
            @Param("type") TransactionType type,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    @Query("""
        SELECT COALESCE(SUM(t.amount), 0)
        FROM Transaction t
        WHERE t.user.id = :userId
        AND t.category.id = :categoryId
        AND t.type = com.finance.dashboard.entity.TransactionType.EXPENSE
        AND YEAR(t.transactionDate) = :year
        AND MONTH(t.transactionDate) = :month
        """)
    BigDecimal sumExpenseByCategoryAndMonth(
            @Param("userId") Long userId,
            @Param("categoryId") Long categoryId,
            @Param("year") Integer year,
            @Param("month") Integer month
    );
}
