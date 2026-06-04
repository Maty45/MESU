package com.tipoinsumo;
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
@Table(name = "tipo_insumo")
public class TipoInsumo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_tipo_insumo")
    private Long idTipoInsumo;

    @Column(name = "nombre_tipo_insumo", nullable = false, unique = true)
    private String nombreTipoInsumo;

    @Column(name = "fecha_hora_baja_tipo_insumo")
    private LocalDateTime fechaHBajaTipoInsumo;
}
