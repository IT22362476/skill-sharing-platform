package com.skillshare.dto;

import com.skillshare.entity.Post;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostDetailDto {

    private Long id;
    private String content;
    private Long userId;
    private String username;
    private String userAvatarUrl;
    private Integer likeCount;
    private boolean likedByCurrentUser;
    private List<MediaDto> mediaList;
    private List<CommentDto> comments;
    private String skillCategory;
    private boolean isOwner;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static PostDetailDto fromEntity(Post post, boolean likedByCurrentUser,
                                           List<MediaDto> mediaDtos, List<CommentDto> commentDtos,
                                           boolean isOwner) {
        return PostDetailDto.builder()
                .id(post.getId())
                .content(post.getContent())
                .userId(post.getUserId())
                .username(post.getUser() != null ? post.getUser().getUsername() : null)
                .userAvatarUrl(post.getUser() != null ? post.getUser().getAvatarUrl() : null)
                .likeCount(post.getLikeCount())
                .likedByCurrentUser(likedByCurrentUser)
                .mediaList(mediaDtos)
                .comments(commentDtos)
                .skillCategory(post.getSkillCategory())
                .isOwner(isOwner)
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .build();
    }
}
