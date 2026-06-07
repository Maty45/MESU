package com.publicacioninsumo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class PublicacionInsumoCreateDTO {
    @NotBlank(message = "El título de publicación no puede estar vacío en el alta")
    private String titulo;

    @NotBlank(message = "La descripción de la publicación no puede estar vacía en el alta")
    private String descripcion;

    @NotBlank(message = "La dirección de la publicación no puede estar vacía en el alta")
    private String direccion;

    private Integer monto;
    private String unidadTiempo;

    @NotNull(message = "El tipo de insumo es obligatorio, no puede estar vacío en el alta")
    private Long idTipoInsumo;

    @NotNull(message = "El estado del insumo es obligatorio, no puede estar vacío en el alta")
    private Long idEstadoInsumo;

    @NotNull(message = "El tipo de operación es obligatorio, no puede estar vacío en el alta")
    private Long idTipoOperacion;

    @Size(min = 1, message = "Debe haber al menos una imagen en el alta")
    private List<String> urlsImagenes;
}
