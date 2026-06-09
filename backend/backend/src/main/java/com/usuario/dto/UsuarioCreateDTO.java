package com.usuario.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UsuarioCreateDTO(
        @NotNull
        Long dniUsuario,

        @NotBlank
        String nombreUsuario,

        @NotBlank
        String apellidoUsuario,

        @Email
        @NotBlank
        String emailUsuario,

        @NotBlank
        @Size(min = 8)
        String contraseniaUsuario,

        @NotBlank
        Long telefonoUsuario
) {
}
