package com.usuariorol.dto;

import com.usuario.dto.UsuarioDTO;
import com.rol.dto.RolDTO;

import java.time.LocalDateTime;

public record UsuarioRolDTO(
        RolDTO rol
) {
}
