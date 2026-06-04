package com.ubicacion;

import com.publicacioninsumo.PublicacionInsumo;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

//Anotaciones Lombok
@Getter
@Setter
@NoArgsConstructor

//Anotaciones JPA
@Entity
@Table(name = "publicacion_insumo_ubicacion")
public class PublicacionInsumoUbicacion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_ubicacion")
    private Long idUbicacion;

    @Column(name = "latitud_ubicacion", nullable = false)
    private Double latitudUbicacion;

    @Column(name = "longitud_ubicacion", nullable = false)
    private Double longitudUbicacion;

    @Column(name = "direccion_ubicacion", nullable = false)
    private  String direccionUbicacion;

    @OneToOne(mappedBy = "publicacionInsumoUbicacion")
    private PublicacionInsumo publicacionInsumo;
}
