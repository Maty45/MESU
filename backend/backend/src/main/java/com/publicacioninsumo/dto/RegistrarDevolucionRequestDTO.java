package com.publicacioninsumo.dto;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
public class RegistrarDevolucionRequestDTO {
    private LocalDate fechaDevolucion; // Opcional, si es nulo se usa la fecha actual
}
