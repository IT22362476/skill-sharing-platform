package com.skillshare.controller;

import com.skillshare.dto.*;
import com.skillshare.service.LearningService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class LearningController {

    private final LearningService learningService;

    // --- Learning Progress ---

    @PostMapping("/progress")
    public ResponseEntity<ProgressDto> createProgress(@AuthenticationPrincipal Long userId,
                                                      @Valid @RequestBody CreateProgressRequest request) {
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        ProgressDto progress = learningService.createProgress(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(progress);
    }

    @GetMapping("/progress/user/{userId}")
    public ResponseEntity<Page<ProgressDto>> getUserProgress(@PathVariable Long userId,
                                                             @RequestParam(defaultValue = "0") int page,
                                                             @RequestParam(defaultValue = "10") int size) {
        Page<ProgressDto> progress = learningService.getUserProgress(userId, page, size);
        return ResponseEntity.ok(progress);
    }

    @DeleteMapping("/progress/{id}")
    public ResponseEntity<Void> deleteProgress(@PathVariable Long id,
                                               @AuthenticationPrincipal Long userId) {
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        learningService.deleteProgress(id, userId);
        return ResponseEntity.noContent().build();
    }

    // --- Learning Plans ---

    @PostMapping("/plans")
    public ResponseEntity<PlanDto> createPlan(@AuthenticationPrincipal Long userId,
                                              @Valid @RequestBody CreatePlanRequest request) {
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        PlanDto plan = learningService.createPlan(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(plan);
    }

    @GetMapping("/plans/user/{userId}")
    public ResponseEntity<List<PlanDto>> getUserPlans(@PathVariable Long userId) {
        List<PlanDto> plans = learningService.getUserPlans(userId);
        return ResponseEntity.ok(plans);
    }

    @PutMapping("/plans/{id}")
    public ResponseEntity<PlanDto> updatePlan(@PathVariable Long id,
                                              @AuthenticationPrincipal Long userId,
                                              @Valid @RequestBody UpdatePlanRequest request) {
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        PlanDto updated = learningService.updatePlan(id, userId, request);
        return ResponseEntity.ok(updated);
    }
}
