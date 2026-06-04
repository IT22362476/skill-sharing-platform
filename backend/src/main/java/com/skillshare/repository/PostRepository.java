package com.skillshare.repository;

import com.skillshare.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    Page<Post> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    @Query("SELECT p FROM Post p WHERE p.userId IN :userIds ORDER BY p.createdAt DESC")
    Page<Post> findFeed(@Param("userIds") List<Long> userIds, Pageable pageable);

    @Query("SELECT p FROM Post p WHERE p.isPublic = true OR p.userId IN :followedUserIds ORDER BY p.createdAt DESC")
    Page<Post> findMixedFeed(@Param("followedUserIds") List<Long> followedUserIds, Pageable pageable);

    @Query("SELECT p FROM Post p WHERE p.isPublic = true ORDER BY p.createdAt DESC")
    Page<Post> findPublicFeed(Pageable pageable);

    @Query("SELECT p FROM Post p WHERE p.isPublic = true AND p.userId != :excludeUserId ORDER BY p.createdAt DESC")
    Page<Post> findDiscoverFeed(@Param("excludeUserId") Long excludeUserId, Pageable pageable);

    @Query("SELECT p FROM Post p WHERE " +
           "(:skillCategory IS NULL OR p.skillCategory = :skillCategory) AND " +
           "(:keyword IS NULL OR LOWER(p.content) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
           "ORDER BY p.createdAt DESC")
    Page<Post> searchPosts(@Param("skillCategory") String skillCategory,
                           @Param("keyword") String keyword,
                           Pageable pageable);
}
