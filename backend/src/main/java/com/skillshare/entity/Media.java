package com.skillshare.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "media", indexes = {
    @Index(name = "idx_media_post_id", columnList = "post_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Media {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "post_id", nullable = false)
    private Long postId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", insertable = false, updatable = false)
    private Post post;

    @Column(nullable = false)
    private String url;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MediaType type;

    @Column(name = "duration_seconds")
    private Integer durationSeconds;

    public enum MediaType {
        IMAGE, VIDEO
    }
}
