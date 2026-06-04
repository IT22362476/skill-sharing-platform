package com.skillshare.controller;

import com.skillshare.dto.*;
import com.skillshare.service.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @PostMapping("/posts/{postId}/comments")
    public ResponseEntity<CommentDto> addComment(@PathVariable Long postId,
                                                 @AuthenticationPrincipal Long userId,
                                                 @Valid @RequestBody CreateCommentRequest request) {
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        CommentDto comment = commentService.addComment(postId, userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(comment);
    }

    @GetMapping("/posts/{postId}/comments")
    public ResponseEntity<Page<CommentDto>> getComments(@PathVariable Long postId,
                                                        @AuthenticationPrincipal Long userId,
                                                        @RequestParam(defaultValue = "0") int page,
                                                        @RequestParam(defaultValue = "10") int size) {
        Page<CommentDto> comments = commentService.getCommentsByPost(postId, userId, page, size);
        return ResponseEntity.ok(comments);
    }

    @PutMapping("/comments/{id}")
    public ResponseEntity<CommentDto> updateComment(@PathVariable Long id,
                                                    @AuthenticationPrincipal Long userId,
                                                    @Valid @RequestBody UpdateCommentRequest request) {
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        CommentDto updated = commentService.updateComment(id, userId, request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/comments/{id}")
    public ResponseEntity<Void> deleteOwnComment(@PathVariable Long id,
                                                 @AuthenticationPrincipal Long userId) {
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        commentService.deleteOwnComment(id, userId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/posts/{postId}/comments/{commentId}")
    public ResponseEntity<Void> deleteCommentAsPostOwner(@PathVariable Long postId,
                                                          @PathVariable Long commentId,
                                                          @AuthenticationPrincipal Long userId) {
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        commentService.deleteCommentAsPostOwner(postId, commentId, userId);
        return ResponseEntity.noContent().build();
    }
}
