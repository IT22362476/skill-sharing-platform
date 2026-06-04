package com.skillshare.repository;

import com.skillshare.entity.Media;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MediaRepository extends JpaRepository<Media, Long> {

    List<Media> findByPostId(Long postId);

    void deleteByPostId(Long postId);
}
