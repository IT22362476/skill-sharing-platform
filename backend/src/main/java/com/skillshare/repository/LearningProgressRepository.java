package com.skillshare.repository;

import com.skillshare.entity.LearningProgress;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LearningProgressRepository extends JpaRepository<LearningProgress, Long> {

    Page<LearningProgress> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    List<LearningProgress> findByUserIdOrderByCreatedAtDesc(Long userId);
}
