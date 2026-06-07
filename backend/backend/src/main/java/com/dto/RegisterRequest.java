package com.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest( @NotBlank
                               String dni,

                               @NotBlank
                               String nombre,

                               @NotBlank
                               String apellido,

                               @Email
                               @NotBlank
                               String email,

                               @Size(min = 8)
                               String password,

                               @NotBlank
                               String telefono) {
}
