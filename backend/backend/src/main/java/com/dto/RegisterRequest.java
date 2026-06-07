package com.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record RegisterRequest( @NotNull
                               Long dni,

                               @NotBlank
                               String nombre,

                               @NotBlank
                               String apellido,

                               @Email
                               @NotBlank
                               String email,

                               @Size(min = 9)
                               String password,

                               @NotNull
                               Long telefono) {
}
