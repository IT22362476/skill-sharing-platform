package com.skillshare.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.skillshare.dto.*;
import com.skillshare.entity.Badge;
import com.skillshare.entity.LearningPlan;
import com.skillshare.entity.LearningProgress;
import com.skillshare.entity.User;
import com.skillshare.repository.BadgeRepository;
import com.skillshare.repository.LearningPlanRepository;
import com.skillshare.repository.LearningProgressRepository;
import com.skillshare.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LearningService {

    private final LearningProgressRepository progressRepository;
    private final LearningPlanRepository planRepository;
    private final UserRepository userRepository;
    private final BadgeRepository badgeRepository;
    private final ObjectMapper objectMapper;

    @Transactional
    public ProgressDto createProgress(Long userId, CreateProgressRequest request) {
        if (!userRepository.existsById(userId)) {
            throw new IllegalArgumentException("User not found");
        }

        LearningProgress.TemplateType templateType;
        try {
            templateType = LearningProgress.TemplateType.valueOf(request.getTemplateType());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid template type. Must be: COMPLETED_TUTORIAL, NEW_SKILL, or TIME_SPENT");
        }

        LearningProgress progress = LearningProgress.builder()
                .userId(userId)
                .skillCategory(request.getSkillCategory())
                .templateType(templateType)
                .content(request.getContent())
                .build();

        progress = progressRepository.save(progress);
        return ProgressDto.fromEntity(progress);
    }

    public Page<ProgressDto> getUserProgress(Long userId, int page, int size) {
        if (!userRepository.existsById(userId)) {
            throw new IllegalArgumentException("User not found");
        }

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return progressRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable)
                .map(ProgressDto::fromEntity);
    }

    @Transactional
    public void deleteProgress(Long progressId, Long userId) {
        LearningProgress progress = progressRepository.findById(progressId)
                .orElseThrow(() -> new EntityNotFoundException("Progress update not found"));

        if (!progress.getUserId().equals(userId)) {
            throw new IllegalArgumentException("Not authorized to delete this progress update");
        }

        progressRepository.delete(progress);
    }

    @Transactional
    public PlanDto createPlan(Long userId, CreatePlanRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (request.getTargetDate().isBefore(request.getStartDate())) {
            throw new IllegalArgumentException("Target date must be after start date");
        }

        String topicsJson = toJson(request.getTopics());
        String resourcesJson = toJson(request.getResources());

        LearningPlan plan = LearningPlan.builder()
                .userId(userId)
                .title(request.getTitle())
                .description(request.getDescription())
                .topics(topicsJson)
                .resources(resourcesJson)
                .startDate(request.getStartDate())
                .targetDate(request.getTargetDate())
                .status(LearningPlan.PlanStatus.NOT_STARTED)
                .build();

        plan = planRepository.save(plan);
        return PlanDto.fromEntity(plan);
    }

    public List<PlanDto> getUserPlans(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new IllegalArgumentException("User not found");
        }

        return planRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(PlanDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public PlanDto updatePlan(Long planId, Long userId, UpdatePlanRequest request) {
        LearningPlan plan = planRepository.findById(planId)
                .orElseThrow(() -> new EntityNotFoundException("Learning plan not found"));

        if (!plan.getUserId().equals(userId)) {
            throw new IllegalArgumentException("Not authorized to update this plan");
        }

        LearningPlan.PlanStatus newStatus;
        try {
            newStatus = LearningPlan.PlanStatus.valueOf(request.getStatus());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid status. Must be: NOT_STARTED, IN_PROGRESS, or COMPLETED");
        }

        if (request.getTitle() != null) plan.setTitle(request.getTitle());
        if (request.getDescription() != null) plan.setDescription(request.getDescription());
        if (request.getTopics() != null) plan.setTopics(toJson(request.getTopics()));
        if (request.getResources() != null) plan.setResources(toJson(request.getResources()));
        if (request.getStartDate() != null) plan.setStartDate(request.getStartDate());
        if (request.getTargetDate() != null) plan.setTargetDate(request.getTargetDate());
        if (request.getProgressNotes() != null) plan.setProgressNotes(request.getProgressNotes());
        plan.setStatus(newStatus);

        plan = planRepository.save(plan);

        // Award badge if plan is completed
        if (newStatus == LearningPlan.PlanStatus.COMPLETED) {
            awardBadgeIfEligible(userId, plan.getTitle());
        }

        return PlanDto.fromEntity(plan);
    }

    private void awardBadgeIfEligible(Long userId, String planTitle) {
        // Check if badge already exists for this plan
        List<Badge> existingBadges = badgeRepository.findByUserId(userId);
        boolean alreadyAwarded = existingBadges.stream()
                .anyMatch(b -> b.getName().contains(planTitle));

        if (!alreadyAwarded) {
            Badge badge = Badge.builder()
                    .userId(userId)
                    .name("Completed: " + planTitle)
                    .description("Awarded for completing the learning plan: " + planTitle)
                    .build();
            badgeRepository.save(badge);
        }
    }

    private String toJson(List<String> list) {
        if (list == null || list.isEmpty()) {
            return "[]";
        }
        try {
            return objectMapper.writeValueAsString(list);
        } catch (JsonProcessingException e) {
            return "[]";
        }
    }
}
