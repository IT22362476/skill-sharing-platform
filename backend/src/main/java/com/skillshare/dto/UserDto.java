package com.skillshare.dto;

import com.skillshare.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDto {

    private Long id;
    private String email;
    private String username;
    private String avatarUrl;
    private String bio;
    private LocalDateTime joinDate;
    private String provider;
    private long followerCount;
    private long followingCount;
    private boolean isFollowing;

    public static UserDto fromEntity(User user) {
        return UserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .username(user.getUsername())
                .avatarUrl(user.getAvatarUrl())
                .bio(user.getBio())
                .joinDate(user.getJoinDate())
                .provider(user.getProvider().name())
                .build();
    }
}
