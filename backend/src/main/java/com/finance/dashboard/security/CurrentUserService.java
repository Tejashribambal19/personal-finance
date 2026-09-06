package com.finance.dashboard.security;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.finance.dashboard.entity.User;
import com.finance.dashboard.repository.UserRepository;

@Service
public class CurrentUserService {

    private final UserRepository userRepository;

    public CurrentUserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "User is not authenticated"
            );
        }

        String email = authentication.getName();

        return userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.UNAUTHORIZED,
                                "Authenticated user not found"
                        )
                );
    }

    public Long getCurrentUserId() {
        return getCurrentUser().getId();
    }
}