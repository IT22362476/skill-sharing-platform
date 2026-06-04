package com.skillshare.dto;

import com.skillshare.entity.Notification;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationDto {

    private Long id;
    private String type;
    private Long postId;
    private Long triggeredByUserId;
    private String triggeredByUsername;
    private String triggeredByAvatarUrl;
    private boolean isRead;
    private LocalDateTime createdAt;

    public static NotificationDto fromEntity(Notification notification) {
        return NotificationDto.builder()
                .id(notification.getId())
                .type(notification.getType().name())
                .postId(notification.getPostId())
                .triggeredByUserId(notification.getTriggeredByUserId())
                .triggeredByUsername(notification.getTriggeredByUser() != null
                        ? notification.getTriggeredByUser().getUsername() : null)
                .triggeredByAvatarUrl(notification.getTriggeredByUser() != null
                        ? notification.getTriggeredByUser().getAvatarUrl() : null)
                .isRead(notification.getIsRead())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}
