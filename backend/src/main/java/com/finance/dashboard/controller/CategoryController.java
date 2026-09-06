package com.finance.dashboard.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.finance.dashboard.dto.CategoryResponse;
import com.finance.dashboard.dto.CreateCategoryRequest;
import com.finance.dashboard.security.CurrentUserService;
import com.finance.dashboard.service.CategoryService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;
    private final CurrentUserService currentUserService;

    public CategoryController(
            CategoryService categoryService,
            CurrentUserService currentUserService
    ) {
        this.categoryService = categoryService;
        this.currentUserService = currentUserService;
    }

    @PostMapping
    public ResponseEntity<CategoryResponse> createCategory(
            @Valid @RequestBody CreateCategoryRequest request
    ) {

        Long userId = currentUserService.getCurrentUserId();

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        categoryService.createCategory(
                                userId,
                                request
                        )
                );
    }

    @GetMapping
    public ResponseEntity<List<CategoryResponse>> getCategories() {

        Long userId = currentUserService.getCurrentUserId();

        return ResponseEntity.ok(
                categoryService.getCategories(userId)
        );
    }

    @DeleteMapping("/{categoryId}")
    public ResponseEntity<Void> deleteCategory(
            @PathVariable Long categoryId
    ) {

        Long userId = currentUserService.getCurrentUserId();

        categoryService.deleteCategory(
                userId,
                categoryId
        );

        return ResponseEntity.noContent().build();
    }
}