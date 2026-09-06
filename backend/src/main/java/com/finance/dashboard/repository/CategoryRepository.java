package com.finance.dashboard.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.finance.dashboard.entity.Category;
import com.finance.dashboard.entity.TransactionType;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    List<Category> findByUserIdOrderByNameAsc(Long userId);

    Optional<Category> findByIdAndUserId(Long categoryId, Long userId);

    boolean existsByUserIdAndNameIgnoreCaseAndType(
            Long userId,
            String name,
            TransactionType type
    );
}