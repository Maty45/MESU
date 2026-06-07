package com.publicacioninsumo.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class PublicacionInsumoResponseDTO {
    private Long id;
    private String titulo;
    private String descripcion;
    private LocalDate fecha;

    //Monto y unidad de tiempo
    private Integer monto;
    private String unidadTiempo;

    //Dirección
    private String direccion;
    private Double longitud;
    private Double latitud;

    //Imágenes
    private List<String> urlsImagenes;

    //Estado del insumo
    private String nombreEstadoInsumo;

    //Tipo del insumo
    private String nombreTipoInsumo;

    //Estado de la publicación
    private String nombreEstadoPublicacion;

    //Tipo de operación
    private String nombreTipoOperacion;

    //Usuario que publicó
    private String nombreUsuario;
    private String apellidoUsuario;
}
