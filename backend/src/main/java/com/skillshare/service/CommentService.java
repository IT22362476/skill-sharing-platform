package com.skillshare.service;

import com.skillshare.dto.CommentDto;
import com.skillshare.dto.CreateCommentRequest;
import com.skillshare.dto.UpdateCommentRequest;
import com.skillshare.entity.Comment;
import com.skillshare.entity.Notification;
import com.skillshare.entity.Post;
import com.skillshare.repository.CommentRepository;
import com.skillshare.repository.NotificationRepository;
import com.skillshare.repository.PostRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final NotificationRepository notificationRepository;

    @Transactional
    public CommentDto addComment(Long postId, Long userId, CreateCommentRequest request) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new EntityNotFoundException("Post not found"));

        Comment comment = Comment.builder()
                .postId(postId)
                .userId(userId)
                .content(request.getContent())
                .build();
        comment = commentRepository.save(comment);

        // Create notification for post owner
        if (!post.getUserId().equals(userId)) {
            Notification notification = Notification.builder()
                    .userId(post.getUserId())
                    .type(Notification.NotificationType.COMMENT)
                    .postId(postId)
                    .triggeredByUserId(userId)
                    .build();
            notificationRepository.save(notification);
        }

        return CommentDto.fromEntity(comment, true);
    }

    @Transactional
    public CommentDto updateComment(Long commentId, Long userId, UpdateCommentRequest request) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new EntityNotFoundException("Comment not found"));

        if (!comment.getUserId().equals(userId)) {
            throw new IllegalArgumentException("Not authorized to edit this comment");
        }

        comment.setContent(request.getContent());
        comment = commentRepository.save(comment);
        return CommentDto.fromEntity(comment, true);
    }

    @Transactional
    public void deleteOwnComment(Long commentId, Long userId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new EntityNotFoundException("Comment not found"));

        if (!comment.getUserId().equals(userId)) {
            throw new IllegalArgumentException("Not authorized to delete this comment");
        }

        commentRepository.delete(comment);
    }

    @Transactional
    public void deleteCommentAsPostOwner(Long postId, Long commentId, Long userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new EntityNotFoundException("Post not found"));

        if (!post.getUserId().equals(userId)) {
            throw new IllegalArgumentException("Not authorized to delete comments on this post");
        }

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new EntityNotFoundException("Comment not found"));

        if (!comment.getPostId().equals(postId)) {
            throw new IllegalArgumentException("Comment does not belong to this post");
        }

        commentRepository.delete(comment);
    }

    public Page<CommentDto> getCommentsByPost(Long postId, Long currentUserId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "createdAt"));
        Page<Comment> commentsPage = commentRepository.findByPostIdOrderByCreatedAtAsc(postId, pageable);

        return commentsPage.map(comment ->
                CommentDto.fromEntity(comment,
                        currentUserId != null && comment.getUserId().equals(currentUserId)));
    }
}
