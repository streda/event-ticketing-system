package com.eventlite.authservice.dto;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;


/*
    Represents: The data my backend expects to receive
    from the frontend when a user tries to log in.
 */
@Data
public class LoginRequestDto {

    @NotBlank(message = "Email cannot be blank")
    @Email(message = "Email should be valid")
    private String email;

    @NotBlank(message = "Password cannot be blank")
    private String password;
}

