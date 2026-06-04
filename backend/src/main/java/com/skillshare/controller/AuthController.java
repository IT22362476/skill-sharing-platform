package com.skillshare.controller;

import com.skillshare.dto.*;
import com.skillshare.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user")
    public ResponseEntity<UserDto> getCurrentUser(@AuthenticationPrincipal Long userId) {
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        UserDto user = authService.getCurrentUser(userId);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/oauth2/{provider}")
    public ResponseEntity<?> initiateOAuth(@PathVariable String provider) {
        // Valid providers: google, github
        if (!provider.equalsIgnoreCase("google") && !provider.equalsIgnoreCase("github")) {
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse(400, "Unsupported provider. Use 'google' or 'github'."));
        }
        String url = authService.getOAuth2Url(provider);
        return ResponseEntity.ok(new OAuth2UrlResponse(url));
    }

    static class OAuth2UrlResponse {
        private final String url;

        OAuth2UrlResponse(String url) {
            this.url = url;
        }

        public String getUrl() {
            return url;
        }
    }
}
