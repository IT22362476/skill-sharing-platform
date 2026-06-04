package com.skillshare.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdatePlanRequest {

    private String title;
    private String description;
    private List<String> topics;
    private List<String> resources;
    private LocalDate startDate;
    private LocalDate targetDate;

    @NotBlank(message = "Status is required")
    private String status;

    private String progressNotes;
}
