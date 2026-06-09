package com.publicacioninsumo;

import com.alquilerinsumo.AlquilerInsumo;
import com.estadoinsumo.EstadoInsumo;
import com.estadopublicacioninsumo.EstadoPublicacionInsumo;
import com.publicacioninsumoimagen.PublicacionInsumoImagen;
import com.tipoinsumo.TipoInsumo;
import com.ubicacion.PublicacionInsumoUbicacion;
import com.usuario.Usuario;
import com.condicionoperacion.CondicionOperacion;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

//Anotaciones Lombok
@Getter
@Setter
@NoArgsConstructor

//Anotaciones JPA
@Entity
@Table(name = "publicacion_insumo")
public class PublicacionInsumo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pi")
    private Long idPI;

    @Column(name = "titulo_pi", nullable = false)
    private String tituloPI;

    @Lob
    @Column(name = "descripcion_pi", nullable = false, columnDefinition = "TEXT")
    private String descripcionPI;

    @Column(name = "fecha_hora_creacion_pi", nullable = true)
    private LocalDate fechaCreacionPI = LocalDate.now();

    @Column(name = "fecha_hora_ultima_actualizacion_pi")
    private LocalDateTime fechaUltimaActualizacionPI;

    //Relaciones OneToOne
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "id_condicion_operacion", nullable = false)
    private CondicionOperacion condicionOperacion;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "id_ubicacion_insumo", nullable = false)
    private PublicacionInsumoUbicacion publicacionInsumoUbicacion;

    //Relaciones ManyToOne
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_estado_insumo", nullable = false)
    private EstadoInsumo estadoInsumo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_tipo_insumo", nullable = false)
    private TipoInsumo tipoInsumo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_estado_publicacion_insumo", nullable = false)
    private EstadoPublicacionInsumo estadoPublicacionInsumo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario_propietario", nullable = false)
    private Usuario usuarioPropietario;

    //Relaciones OneToMany
    @OneToMany(mappedBy = "publicacionInsumo", cascade = {CascadeType.ALL}, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<AlquilerInsumo> alquileresInsumo;

    @OneToMany(mappedBy = "publicacionInsumo", cascade = {CascadeType.ALL}, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<PublicacionInsumoImagen> publicacionInsumoImagenes;



}
