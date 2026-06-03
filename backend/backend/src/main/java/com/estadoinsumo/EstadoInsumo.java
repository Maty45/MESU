package com.estadoinsumo;

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
@Table(name = "estado_insumo")
public class EstadoInsumo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_estado_insumo")
    private  Long idEstadoInsumo;

    @Column(name = "cod_estado_insumo", nullable = false, unique = true)
    private int codEstadoInsumo;

    @Column(name = "nombre_estado_insumo", nullable = false, unique = true)
    private String nombreEstadoInsumo;

    @Column(name = "fecha_hora_baja_estado_insumo")
    private LocalDateTime fechaHBajaEstadoInsumo;

}
