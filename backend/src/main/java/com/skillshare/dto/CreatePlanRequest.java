package com.skillshare.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreatePlanRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    private List<String> topics;

    private List<String> resources;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    @NotNull(message = "Target date is required")
    private LocalDate targetDate;
}
