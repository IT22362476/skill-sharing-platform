package com.skillshare.dto;

import com.skillshare.entity.Post;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostDto {

    private Long id;
    private String content;
    private Long userId;
    private String username;
    private String userAvatarUrl;
    private Integer likeCount;
    private int commentCount;
    private boolean likedByCurrentUser;
    private List<MediaDto> mediaList;
    private String skillCategory;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static PostDto fromEntity(Post post, boolean likedByCurrentUser) {
        List<MediaDto> mediaDtos = post.getMediaList() != null
                ? post.getMediaList().stream().map(MediaDto::fromEntity).collect(Collectors.toList())
                : Collections.emptyList();

        return PostDto.builder()
                .id(post.getId())
                .content(post.getContent())
                .userId(post.getUserId())
                .username(post.getUser() != null ? post.getUser().getUsername() : null)
                .userAvatarUrl(post.getUser() != null ? post.getUser().getAvatarUrl() : null)
                .likeCount(post.getLikeCount())
                .commentCount(post.getComments() != null ? post.getComments().size() : 0)
                .likedByCurrentUser(likedByCurrentUser)
                .mediaList(mediaDtos)
                .skillCategory(post.getSkillCategory())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .build();
    }
}
