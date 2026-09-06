package com.finance.dashboard.service;

import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.finance.dashboard.dto.AuthResponse;
import com.finance.dashboard.dto.LoginRequest;
import com.finance.dashboard.dto.RegisterRequest;
import com.finance.dashboard.dto.UserResponse;
import com.finance.dashboard.entity.User;
import com.finance.dashboard.repository.UserRepository;
import com.finance.dashboard.security.JwtService;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    // =========================================
    // REGISTER
    // =========================================

    public UserResponse register(RegisterRequest request) {

        String email = request.email()
                .trim()
                .toLowerCase();

        if (userRepository.existsByEmail(email)) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Email is already registered"
            );
        }

        User user = User.builder()
                .name(request.name().trim())
                .email(email)
                .password(
                        passwordEncoder.encode(
                                request.password()
                        )
                )
                .build();

        User savedUser = userRepository.save(user);

        return new UserResponse(
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getCreatedAt()
        );
    }


    // =========================================
    // LOGIN
    // =========================================

    public AuthResponse login(LoginRequest request) {

        String email = request.email()
                .trim()
                .toLowerCase();

        /*
         * Spring Security verifies:
         *
         * email
         * password
         *
         * against our BCrypt password stored
         * inside PostgreSQL.
         */
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        email,
                        request.password()
                )
        );

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "User not found"
                        )
                );

        UserDetails userDetails =
                org.springframework.security.core.userdetails.User
                        .withUsername(user.getEmail())
                        .password(user.getPassword())
                        .authorities("USER")
                        .build();

        String token =
                jwtService.generateToken(userDetails);

        return new AuthResponse(
                token,
                "Bearer",
                user.getId(),
                user.getName(),
                user.getEmail()
        );
    }
}