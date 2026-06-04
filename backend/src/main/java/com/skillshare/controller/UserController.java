package com.skillshare.controller;

import com.skillshare.dto.*;
import com.skillshare.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/{userId}")
    public ResponseEntity<UserDto> getUserProfile(@PathVariable Long userId,
                                                  @AuthenticationPrincipal Long currentUserId) {
        UserDto profile = userService.getUserProfile(userId, currentUserId);
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/profile")
    public ResponseEntity<UserDto> updateProfile(@AuthenticationPrincipal Long userId,
                                                 @Valid @RequestBody UpdateProfileRequest request) {
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        UserDto updated = userService.updateProfile(userId, request);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/search")
    public ResponseEntity<List<UserDto>> searchUsers(@RequestParam String q,
                                                     @AuthenticationPrincipal Long currentUserId) {
        if (q == null || q.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        List<UserDto> users = userService.searchUsers(q.trim(), currentUserId);
        return ResponseEntity.ok(users);
    }

    @PostMapping("/{userId}/follow")
    public ResponseEntity<Void> followUser(@PathVariable Long userId,
                                           @AuthenticationPrincipal Long followerId) {
        if (followerId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        userService.followUser(followerId, userId);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/{userId}/follow")
    public ResponseEntity<Void> unfollowUser(@PathVariable Long userId,
                                             @AuthenticationPrincipal Long followerId) {
        if (followerId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        userService.unfollowUser(followerId, userId);
        return ResponseEntity.noContent().build();
    }
}
