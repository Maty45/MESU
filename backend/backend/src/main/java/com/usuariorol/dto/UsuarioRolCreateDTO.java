package com.usuariorol.dto;

import jakarta.validation.constraints.NotNull;

public record UsuarioRolCreateDTO(
        @NotNull
        Long idUsuario,

        @NotNull
        Long idRol
) {
}
