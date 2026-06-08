package com.rol.dto;

import java.time.LocalDate;

public record RolDTO(
        Long idRol,
        String nombreRol,
        LocalDate fechaAltaRol,
        LocalDate fechaBajaRol
) {
}
