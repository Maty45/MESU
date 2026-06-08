package com.usuario.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

public record UsuarioUpdateDTO(
        String nombreUsuario,
        String apellidoUsuario,

        @Email
        String emailUsuario,

        @Size(min = 8)
        String contraseniaUsuario,

        Long telefonoUsuario
) {
}
