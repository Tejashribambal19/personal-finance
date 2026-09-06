package com.finance.dashboard.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.finance.dashboard.dto.CreateTransactionRequest;
import com.finance.dashboard.dto.TransactionResponse;
import com.finance.dashboard.dto.UpdateTransactionRequest;
import com.finance.dashboard.entity.Category;
import com.finance.dashboard.entity.Transaction;
import com.finance.dashboard.entity.User;
import com.finance.dashboard.repository.CategoryRepository;
import com.finance.dashboard.repository.TransactionRepository;
import com.finance.dashboard.repository.UserRepository;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;

    public TransactionService(
            TransactionRepository transactionRepository,
            UserRepository userRepository,
            CategoryRepository categoryRepository
    ) {
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
    }

    @Transactional
    public TransactionResponse createTransaction(
            Long userId,
            CreateTransactionRequest request
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

        if (category.getType() != request.type()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Transaction type must match category type"
            );
        }

        Transaction transaction = Transaction.builder()
                .user(user)
                .category(category)
                .type(request.type())
                .amount(request.amount())
                .description(cleanDescription(request.description()))
                .transactionDate(request.transactionDate())
                .build();

        Transaction savedTransaction =
                transactionRepository.save(transaction);

        return toResponse(savedTransaction);
    }

    @Transactional(readOnly = true)
    public List<TransactionResponse> getTransactions(Long userId) {

        if (!userRepository.existsById(userId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "User not found"
            );
        }

        return transactionRepository
                .findByUserIdOrderByTransactionDateDescIdDesc(userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public TransactionResponse getTransaction(
            Long userId,
            Long transactionId
    ) {

        Transaction transaction = transactionRepository
                .findByIdAndUserId(transactionId, userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Transaction not found"
                ));

        return toResponse(transaction);
    }

    @Transactional
    public TransactionResponse updateTransaction(
            Long userId,
            Long transactionId,
            UpdateTransactionRequest request
    ) {

        Transaction transaction = transactionRepository
                .findByIdAndUserId(transactionId, userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Transaction not found"
                ));

        Category category = categoryRepository
                .findByIdAndUserId(request.categoryId(), userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Category not found"
                ));

        if (category.getType() != request.type()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Transaction type must match category type"
            );
        }

        transaction.setCategory(category);
        transaction.setType(request.type());
        transaction.setAmount(request.amount());
        transaction.setDescription(
                cleanDescription(request.description())
        );
        transaction.setTransactionDate(request.transactionDate());

        Transaction updatedTransaction =
                transactionRepository.save(transaction);

        return toResponse(updatedTransaction);
    }

    @Transactional
    public void deleteTransaction(
            Long userId,
            Long transactionId
    ) {

        Transaction transaction = transactionRepository
                .findByIdAndUserId(transactionId, userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Transaction not found"
                ));

        transactionRepository.delete(transaction);
    }

    private String cleanDescription(String description) {

        if (description == null || description.isBlank()) {
            return null;
        }

        return description.trim();
    }

    private TransactionResponse toResponse(
            Transaction transaction
    ) {

        return new TransactionResponse(
                transaction.getId(),
                transaction.getUser().getId(),
                transaction.getCategory().getId(),
                transaction.getCategory().getName(),
                transaction.getType(),
                transaction.getAmount(),
                transaction.getDescription(),
                transaction.getTransactionDate(),
                transaction.getCreatedAt(),
                transaction.getUpdatedAt()
        );
    }
}