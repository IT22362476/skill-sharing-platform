package com.skillshare.dto;

import com.skillshare.entity.Media;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MediaDto {

    private Long id;
    private String url;
    private String type;
    private Integer durationSeconds;

    public static MediaDto fromEntity(Media media) {
        return MediaDto.builder()
                .id(media.getId())
                .url(media.getUrl())
                .type(media.getType().name())
                .durationSeconds(media.getDurationSeconds())
                .build();
    }
}
