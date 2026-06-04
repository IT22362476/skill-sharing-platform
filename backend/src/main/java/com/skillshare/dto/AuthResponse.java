package com.skillshare.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {

    private String token;
    private String tokenType = "Bearer";
    private UserDto user;

    public AuthResponse(String token, UserDto user) {
        this.token = token;
        this.tokenType = "Bearer";
        this.user = user;
    }
}
