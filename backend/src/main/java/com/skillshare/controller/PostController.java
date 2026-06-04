package com.skillshare.controller;

import com.skillshare.dto.*;
import com.skillshare.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PostDto> createPost(
            @AuthenticationPrincipal Long userId,
            @RequestParam("content") String content,
            @RequestParam(value = "skillCategory", required = false) String skillCategory,
            @RequestParam(value = "files", required = false) List<MultipartFile> files) throws IOException {
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        PostDto post = postService.createPost(userId, content, skillCategory, files);
        return ResponseEntity.status(HttpStatus.CREATED).body(post);
    }

    @GetMapping
    public ResponseEntity<Page<PostDto>> getFeed(
            @AuthenticationPrincipal Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<PostDto> feed = postService.getFeed(userId, page, size);
        return ResponseEntity.ok(feed);
    }

    @GetMapping("/discover")
    public ResponseEntity<Page<PostDto>> getDiscoverFeed(
            @AuthenticationPrincipal Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<PostDto> feed = postService.getPublicFeed(userId, page, size);
        return ResponseEntity.ok(feed);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<PostDto>> searchPosts(
            @AuthenticationPrincipal Long userId,
            @RequestParam(required = false) String skillCategory,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<PostDto> results = postService.searchPosts(skillCategory, keyword, userId, page, size);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostDetailDto> getPost(@PathVariable Long id,
                                                 @AuthenticationPrincipal Long userId) {
        PostDetailDto post = postService.getPostDetail(id, userId);
        return ResponseEntity.ok(post);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id,
                                           @AuthenticationPrincipal Long userId) {
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        postService.deletePost(id, userId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<Void> likePost(@PathVariable Long id,
                                         @AuthenticationPrincipal Long userId) {
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        postService.likePost(id, userId);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/{id}/like")
    public ResponseEntity<Void> unlikePost(@PathVariable Long id,
                                           @AuthenticationPrincipal Long userId) {
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        postService.unlikePost(id, userId);
        return ResponseEntity.noContent().build();
    }
}
