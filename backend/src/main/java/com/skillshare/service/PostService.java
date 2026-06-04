package com.skillshare.service;

import com.skillshare.dto.*;
import com.skillshare.entity.*;
import com.skillshare.repository.*;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final MediaRepository mediaRepository;
    private final LikeRepository likeRepository;
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;
    private final UserService userService;

    @Value("${app.upload.dir:./uploads}")
    private String uploadDir;

    @Transactional
    public PostDto createPost(Long userId, String content, String skillCategory,
                              List<MultipartFile> files) throws IOException {
        if (!userRepository.existsById(userId)) {
            throw new IllegalArgumentException("User not found");
        }

        if (files != null && files.size() > 3) {
            throw new IllegalArgumentException("Maximum 3 files allowed");
        }

        Post post = Post.builder()
                .userId(userId)
                .content(content)
                .skillCategory(skillCategory)
                .likeCount(0)
                .isPublic(true)
                .build();
        post = postRepository.save(post);

        if (files != null && !files.isEmpty()) {
            List<Media> mediaList = new ArrayList<>();
            for (MultipartFile file : files) {
                validateFile(file);
                String fileUrl = saveFile(file, userId);
                Media.MediaType mediaType = determineMediaType(file.getContentType());
                Media media = Media.builder()
                        .postId(post.getId())
                        .url(fileUrl)
                        .type(mediaType)
                        .durationSeconds(mediaType == Media.MediaType.VIDEO ? 30 : null)
                        .build();
                mediaList.add(mediaRepository.save(media));
            }
            post.setMediaList(mediaList);
        }

        return PostDto.fromEntity(post, false);
    }

    public Page<PostDto> getFeed(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        if (userId != null) {
            List<Long> followedIds = userService.getFollowedUserIds(userId);
            // Always include the user's own posts
            followedIds.add(userId);
            Page<Post> postsPage = postRepository.findFeed(followedIds, pageable);
            return postsPage.map(post -> PostDto.fromEntity(post,
                    likeRepository.existsByPostIdAndUserId(post.getId(), userId)));
        }

        // Anonymous users see the public feed
        Page<Post> postsPage = postRepository.findPublicFeed(pageable);
        return postsPage.map(post -> PostDto.fromEntity(post, false));
    }

    /**
     * Public / discover feed — shows all public posts regardless of follows.
     * Used for the "Discover" tab where users can browse content before following anyone.
     */
    public Page<PostDto> getPublicFeed(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Post> postsPage = postRepository.findPublicFeed(pageable);
        Long finalUserId = userId;
        return postsPage.map(post -> PostDto.fromEntity(post,
                finalUserId != null && likeRepository.existsByPostIdAndUserId(post.getId(), finalUserId)));
    }

    public PostDetailDto getPostDetail(Long postId, Long currentUserId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new EntityNotFoundException("Post not found"));

        boolean likedByCurrentUser = currentUserId != null &&
                likeRepository.existsByPostIdAndUserId(postId, currentUserId);

        List<MediaDto> mediaDtos = post.getMediaList().stream()
                .map(MediaDto::fromEntity)
                .collect(Collectors.toList());

        List<CommentDto> commentDtos = post.getComments().stream()
                .map(comment -> CommentDto.fromEntity(comment,
                        currentUserId != null && comment.getUserId().equals(currentUserId)))
                .collect(Collectors.toList());

        boolean isOwner = currentUserId != null && post.getUserId().equals(currentUserId);

        return PostDetailDto.fromEntity(post, likedByCurrentUser, mediaDtos, commentDtos, isOwner);
    }

    @Transactional
    public void deletePost(Long postId, Long userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new EntityNotFoundException("Post not found"));

        if (!post.getUserId().equals(userId)) {
            throw new IllegalArgumentException("Not authorized to delete this post");
        }

        mediaRepository.deleteByPostId(postId);
        commentRepository.deleteByPostId(postId);
        likeRepository.deleteByPostId(postId);
        postRepository.delete(post);
    }

    @Transactional
    public void likePost(Long postId, Long userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new EntityNotFoundException("Post not found"));

        if (likeRepository.existsByPostIdAndUserId(postId, userId)) {
            throw new IllegalArgumentException("Already liked this post");
        }

        Like like = Like.builder()
                .postId(postId)
                .userId(userId)
                .build();
        likeRepository.save(like);

        post.setLikeCount(post.getLikeCount() + 1);
        postRepository.save(post);

        // Create notification for post owner
        if (!post.getUserId().equals(userId)) {
            Notification notification = Notification.builder()
                    .userId(post.getUserId())
                    .type(Notification.NotificationType.LIKE)
                    .postId(postId)
                    .triggeredByUserId(userId)
                    .build();
            notificationRepository.save(notification);
        }
    }

    @Transactional
    public void unlikePost(Long postId, Long userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new EntityNotFoundException("Post not found"));

        Like like = likeRepository.findByPostIdAndUserId(postId, userId)
                .orElseThrow(() -> new IllegalArgumentException("Not liked yet"));

        likeRepository.delete(like);

        post.setLikeCount(Math.max(0, post.getLikeCount() - 1));
        postRepository.save(post);
    }

    public Page<PostDto> searchPosts(String skillCategory, String keyword, Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Post> postsPage = postRepository.searchPosts(skillCategory, keyword, pageable);

        Long finalUserId = userId;
        return postsPage.map(post -> PostDto.fromEntity(post,
                finalUserId != null && likeRepository.existsByPostIdAndUserId(post.getId(), finalUserId)));
    }

    private void validateFile(MultipartFile file) {
        if (file.getSize() > 10 * 1024 * 1024) {
            throw new IllegalArgumentException("File size exceeds 10MB limit");
        }

        String contentType = file.getContentType();
        if (contentType == null ||
                (!contentType.startsWith("image/") && !contentType.startsWith("video/"))) {
            throw new IllegalArgumentException("Only JPEG, PNG images and MP4 videos are allowed");
        }
    }

    private String saveFile(MultipartFile file, Long userId) throws IOException {
        String uploadPath = uploadDir + "/" + userId;
        Path uploadDirPath = Paths.get(uploadPath);
        Files.createDirectories(uploadDirPath);

        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }

        String filename = UUID.randomUUID().toString() + extension;
        Path filePath = uploadDirPath.resolve(filename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return "/uploads/" + userId + "/" + filename;
    }

    private Media.MediaType determineMediaType(String contentType) {
        if (contentType != null && contentType.startsWith("video/")) {
            return Media.MediaType.VIDEO;
        }
        return Media.MediaType.IMAGE;
    }
}
