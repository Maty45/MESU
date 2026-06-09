package com.reporte.dto;

public record UsuarioReporteDTO(
        Long idUsuario,
        String nombreUsuario,
        String apellidoUsuario,
        String emailUsuario
) {}