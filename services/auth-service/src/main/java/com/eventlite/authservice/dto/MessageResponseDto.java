package com.eventlite.authservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/*
    Represents: A generic structure for simple
    success or informational messages from the API.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor

public class MessageResponseDto {
    private String message;
}
