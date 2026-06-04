package com.skillshare.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateProgressRequest {

    @NotNull(message = "Template type is required")
    private String templateType;

    private String skillCategory;

    @NotBlank(message = "Content is required")
    private String content;
}
