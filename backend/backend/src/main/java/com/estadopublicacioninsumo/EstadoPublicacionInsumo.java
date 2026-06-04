package com.estadopublicacioninsumo;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

//Anotaciones Lombok
@Getter
@Setter
@NoArgsConstructor

//Anotaciones JPA
@Entity
@Table(name = "estado_publicacion_insumo")
public class EstadoPublicacionInsumo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_estado_pi")
    private Long idEstadoPI;

    @Column(name = "nombre_estado_pi", nullable = false, unique = true)
    private String nombreEPI;

    @Column(name = "fecha_hora_baja_estado_pi")
    private LocalDateTime fechaHBajaEPI;


}
