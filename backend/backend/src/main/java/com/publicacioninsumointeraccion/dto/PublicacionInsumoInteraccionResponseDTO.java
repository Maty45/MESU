package com.publicacioninsumointeraccion.dto;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
public class PublicacionInsumoInteraccionResponseDTO {
    private Long idPII;
    private LocalDateTime fechaHPII;
    private String nombreTipoInteraccion;
    
    // Cliente
    private Long idUsuarioCliente;
    private String nombreUsuarioCliente;
    private String apellidoUsuarioCliente;
    private String emailUsuarioCliente;
    private Long telefonoUsuarioCliente;
    
    // Detalles del Alquiler (si aplica)
    private Long idAlquiler;
    private LocalDate fechaDesdeAI;
    private LocalDate fechaHastaAcordadaAI;
    private LocalDate fechaHastaRealAI;
    private Integer montoAcordadoAI;
}
