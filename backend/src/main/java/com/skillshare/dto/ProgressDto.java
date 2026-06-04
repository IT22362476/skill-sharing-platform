package com.skillshare.dto;

import com.skillshare.entity.LearningProgress;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProgressDto {

    private Long id;
    private Long userId;
    private String username;
    private String skillCategory;
    private String templateType;
    private String content;
    private LocalDateTime createdAt;

    public static ProgressDto fromEntity(LearningProgress progress) {
        return ProgressDto.builder()
                .id(progress.getId())
                .userId(progress.getUserId())
                .username(progress.getUser() != null ? progress.getUser().getUsername() : null)
                .skillCategory(progress.getSkillCategory())
                .templateType(progress.getTemplateType().name())
                .content(progress.getContent())
                .createdAt(progress.getCreatedAt())
                .build();
    }
}
