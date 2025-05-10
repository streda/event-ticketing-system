package com.eventlite.authservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/*
    Represents: A "safe" or "public" view of a user's data that
    I am comfortable sending back in API responses.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor

public class UserDto {
    private Integer id;
    private String name;
    private String email;
    private LocalDateTime createdAt;
}
