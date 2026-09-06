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
import org.springframework.web.bind.annotation.RestController;

import com.finance.dashboard.dto.CreateTransactionRequest;
import com.finance.dashboard.dto.TransactionResponse;
import com.finance.dashboard.dto.UpdateTransactionRequest;
import com.finance.dashboard.security.CurrentUserService;
import com.finance.dashboard.service.TransactionService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;
    private final CurrentUserService currentUserService;

    public TransactionController(
            TransactionService transactionService,
            CurrentUserService currentUserService
    ) {
        this.transactionService = transactionService;
        this.currentUserService = currentUserService;
    }

    @PostMapping
    public ResponseEntity<TransactionResponse> createTransaction(
            @Valid @RequestBody CreateTransactionRequest request
    ) {

        Long userId = currentUserService.getCurrentUserId();

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        transactionService.createTransaction(
                                userId,
                                request
                        )
                );
    }

    @GetMapping
    public ResponseEntity<List<TransactionResponse>> getTransactions() {

        Long userId = currentUserService.getCurrentUserId();

        return ResponseEntity.ok(
                transactionService.getTransactions(userId)
        );
    }

    @GetMapping("/{transactionId}")
    public ResponseEntity<TransactionResponse> getTransaction(
            @PathVariable Long transactionId
    ) {

        Long userId = currentUserService.getCurrentUserId();

        return ResponseEntity.ok(
                transactionService.getTransaction(
                        userId,
                        transactionId
                )
        );
    }

    @PutMapping("/{transactionId}")
    public ResponseEntity<TransactionResponse> updateTransaction(
            @PathVariable Long transactionId,
            @Valid @RequestBody UpdateTransactionRequest request
    ) {

        Long userId = currentUserService.getCurrentUserId();

        return ResponseEntity.ok(
                transactionService.updateTransaction(
                        userId,
                        transactionId,
                        request
                )
        );
    }

    @DeleteMapping("/{transactionId}")
    public ResponseEntity<Void> deleteTransaction(
            @PathVariable Long transactionId
    ) {

        Long userId = currentUserService.getCurrentUserId();

        transactionService.deleteTransaction(
                userId,
                transactionId
        );

        return ResponseEntity.noContent().build();
    }
}