package com.publicacioninsumointeraccion.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
public class ConcretarInteraccionRequestDTO {
    @NotNull(message = "El tipo de interacción concretada es obligatorio")
    private String tipoInteraccionConcretada; // "VENTA", "DONACION", "ALQUILER"
    
    // Campos opcionales requeridos solo si es ALQUILER
    private LocalDate fechaDesde;
    private LocalDate fechaHastaAcordada;
    private Integer montoAcordado;
}
