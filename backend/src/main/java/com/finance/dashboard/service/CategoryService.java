package com.finance.dashboard.service;

import com.finance.dashboard.dto.CategoryResponse;
import com.finance.dashboard.dto.CreateCategoryRequest;
import com.finance.dashboard.entity.Category;
import com.finance.dashboard.entity.User;
import com.finance.dashboard.repository.CategoryRepository;
import com.finance.dashboard.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    public CategoryService(
            CategoryRepository categoryRepository,
            UserRepository userRepository
    ) {
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
    }

    public CategoryResponse createCategory(
            Long userId,
            CreateCategoryRequest request
    ) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "User not found"
                ));

        String categoryName = request.name().trim();

        boolean alreadyExists =
                categoryRepository.existsByUserIdAndNameIgnoreCaseAndType(
                        userId,
                        categoryName,
                        request.type()
                );

        if (alreadyExists) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Category already exists"
            );
        }

        Category category = Category.builder()
                .name(categoryName)
                .type(request.type())
                .user(user)
                .build();

        Category savedCategory = categoryRepository.save(category);

        return toResponse(savedCategory);
    }

    public List<CategoryResponse> getCategories(Long userId) {

        if (!userRepository.existsById(userId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "User not found"
            );
        }

        return categoryRepository
                .findByUserIdOrderByNameAsc(userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public void deleteCategory(Long userId, Long categoryId) {

        Category category = categoryRepository
                .findByIdAndUserId(categoryId, userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Category not found"
                ));

        categoryRepository.delete(category);
    }

    private CategoryResponse toResponse(Category category) {

        return new CategoryResponse(
                category.getId(),
                category.getName(),
                category.getType(),
                category.getUser().getId(),
                category.getCreatedAt()
        );
    }
}