package com.skillshare.service;

import com.skillshare.dto.UpdateProfileRequest;
import com.skillshare.dto.UserDto;
import com.skillshare.entity.Follow;
import com.skillshare.entity.User;
import com.skillshare.repository.FollowRepository;
import com.skillshare.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final FollowRepository followRepository;

    public UserDto getUserProfile(Long userId, Long currentUserId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        UserDto dto = UserDto.fromEntity(user);
        dto.setFollowerCount(followRepository.countByFollowingId(userId));
        dto.setFollowingCount(followRepository.countByFollowerId(userId));

        if (currentUserId != null) {
            dto.setFollowing(followRepository.existsByFollowerIdAndFollowingId(currentUserId, userId));
        }

        return dto;
    }

    @Transactional
    public UserDto updateProfile(Long userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (request.getUsername() != null && !request.getUsername().equals(user.getUsername())) {
            if (userRepository.existsByUsername(request.getUsername())) {
                throw new IllegalArgumentException("Username already taken");
            }
            user.setUsername(request.getUsername());
        }

        if (request.getBio() != null) {
            user.setBio(request.getBio());
        }

        if (request.getAvatarUrl() != null) {
            user.setAvatarUrl(request.getAvatarUrl());
        }

        user = userRepository.save(user);
        return UserDto.fromEntity(user);
    }

    public List<UserDto> searchUsers(String query, Long currentUserId) {
        List<User> users = userRepository.searchByUsername(query);
        return users.stream()
                .map(user -> {
                    UserDto dto = UserDto.fromEntity(user);
                    dto.setFollowerCount(followRepository.countByFollowingId(user.getId()));
                    dto.setFollowingCount(followRepository.countByFollowerId(user.getId()));
                    if (currentUserId != null) {
                        dto.setFollowing(
                                followRepository.existsByFollowerIdAndFollowingId(currentUserId, user.getId()));
                    }
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public void followUser(Long followerId, Long followingId) {
        if (followerId.equals(followingId)) {
            throw new IllegalArgumentException("Cannot follow yourself");
        }

        if (!userRepository.existsById(followingId)) {
            throw new IllegalArgumentException("User not found");
        }

        if (followRepository.existsByFollowerIdAndFollowingId(followerId, followingId)) {
            throw new IllegalArgumentException("Already following this user");
        }

        Follow follow = Follow.builder()
                .followerId(followerId)
                .followingId(followingId)
                .build();
        followRepository.save(follow);
    }

    @Transactional
    public void unfollowUser(Long followerId, Long followingId) {
        Follow follow = followRepository
                .findByFollowerIdAndFollowingId(followerId, followingId)
                .orElseThrow(() -> new IllegalArgumentException("Not following this user"));

        followRepository.delete(follow);
    }

    public List<Long> getFollowedUserIds(Long userId) {
        return followRepository.findByFollowerId(userId)
                .stream()
                .map(Follow::getFollowingId)
                .collect(Collectors.toList());
    }
}
