package com.tipointeraccion;

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
@Table(name = "tipo_interaccion")
public class TipoInteraccion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_tipo_interaccion")
    private Long idTipoInteraccion;

    @Column(name = "nombre_tipo_interaccion", nullable = false, unique = true)
    private String nombreTipoInteraccion;

    @Column(name = "fecha_hora_baja_tipo_interaccion")
    private LocalDateTime fechaHBajaTipoInteraccion;

}

