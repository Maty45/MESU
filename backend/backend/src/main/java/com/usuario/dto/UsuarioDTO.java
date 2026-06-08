package com.usuario.dto;

import com.usuariorol.dto.UsuarioRolDTO;

import java.time.LocalDateTime;
import java.util.List;

public record UsuarioDTO(
        Long idUsuario,
        Long dniUsuario,
        String nombreUsuario,
        String apellidoUsuario,
        String emailUsuario,
        Long telefonoUsuario,
        LocalDateTime fechaHRegistroUsuario,
        LocalDateTime fechaHBajaUsuario,
        List<UsuarioRolDTO> usuarioRoles
) {
}
