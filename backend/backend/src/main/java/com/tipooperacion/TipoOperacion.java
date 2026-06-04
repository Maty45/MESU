package com.tipooperacion;

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
@Table(name = "tipo_operacion")
public class TipoOperacion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_tipo_operacion")
    private Long idTipoOperacion;

    @Column(name = "nombre_tipo_operacion", nullable = false, unique = true)
    private String nombreTipoOperacion;

    @Column(name = "fecha_hora_baja_tipo_operacion")
    private LocalDateTime fechaHBajaTipoOperacion;
}
