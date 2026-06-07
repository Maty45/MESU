package com.publicacioninsumo.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class PublicacionInsumoUpdateDTO {
    //Campos básicos editables
    private String titulo;
    private String descripcion;

    //Condiciones editables
    private Integer monto;
    private String unidadTiempo;
    private Long idTipoOperacion;

    //Estado del insumo
    private Long idEstadoInsumo;

    // Nueva lista completa de URLs de Cloudinary si el usuario añade o quita fotos
    private List<String> urlsImagenes;
}
