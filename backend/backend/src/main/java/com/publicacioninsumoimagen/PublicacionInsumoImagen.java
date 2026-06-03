package com.publicacioninsumoimagen;


import com.publicacioninsumo.PublicacionInsumo;
import jakarta.persistence.*;
import lombok.*;

//Anotaciones Lombok
@Getter
@Setter
@NoArgsConstructor

//Anotaciones JPA
@Entity
@Table(name = "publicacion_insumo_imagen")
public class PublicacionInsumoImagen {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_publicacion_insumo_imagen")
    private Long idPublicacionInsumoImagen;

    @Column(name = "nro_publicacion_insumo_imagen", nullable = false)
    private Integer nroPublicacionInsumoImagen;

    @Column(name = "urlpath_publicacion_insumo_imagen", nullable = false, length = 512, unique = true)
    private String urlpathPublicacionInsumoImagen;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_publicacion_insumo", nullable = false)
    private PublicacionInsumo publicacionInsumo;
}
