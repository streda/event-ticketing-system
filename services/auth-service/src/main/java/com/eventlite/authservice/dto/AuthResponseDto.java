package com.eventlite.authservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/*
    Represents: The data my backend sends
    back to the frontend after a successful login.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor

public class AuthResponseDto {
    private String token;
//    private UserDto user; // An instance of UserDto
    private String message;
}
