package com.skillshare.dto;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.skillshare.entity.LearningPlan;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlanDto {

    private Long id;
    private Long userId;
    private String username;
    private String title;
    private String description;
    private List<String> topics;
    private List<String> resources;
    private LocalDate startDate;
    private LocalDate targetDate;
    private String status;
    private String progressNotes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private static final ObjectMapper objectMapper = new ObjectMapper();

    public static PlanDto fromEntity(LearningPlan plan) {
        List<String> topicList = parseJsonList(plan.getTopics());
        List<String> resourceList = parseJsonList(plan.getResources());

        return PlanDto.builder()
                .id(plan.getId())
                .userId(plan.getUserId())
                .username(plan.getUser() != null ? plan.getUser().getUsername() : null)
                .title(plan.getTitle())
                .description(plan.getDescription())
                .topics(topicList)
                .resources(resourceList)
                .startDate(plan.getStartDate())
                .targetDate(plan.getTargetDate())
                .status(plan.getStatus().name())
                .progressNotes(plan.getProgressNotes())
                .createdAt(plan.getCreatedAt())
                .updatedAt(plan.getUpdatedAt())
                .build();
    }

    private static List<String> parseJsonList(String json) {
        if (json == null || json.isBlank()) {
            return Collections.emptyList();
        }
        try {
            return objectMapper.readValue(json, new TypeReference<List<String>>() {});
        } catch (JsonProcessingException e) {
            return Collections.emptyList();
        }
    }
}
