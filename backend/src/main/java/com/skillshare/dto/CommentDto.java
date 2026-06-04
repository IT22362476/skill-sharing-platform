package com.skillshare.dto;

import com.skillshare.entity.Comment;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentDto {

    private Long id;
    private Long postId;
    private Long userId;
    private String username;
    private String userAvatarUrl;
    private String content;
    private boolean isOwner;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static CommentDto fromEntity(Comment comment, boolean isOwner) {
        return CommentDto.builder()
                .id(comment.getId())
                .postId(comment.getPostId())
                .userId(comment.getUserId())
                .username(comment.getUser() != null ? comment.getUser().getUsername() : null)
                .userAvatarUrl(comment.getUser() != null ? comment.getUser().getAvatarUrl() : null)
                .content(comment.getContent())
                .isOwner(isOwner)
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .build();
    }
}
