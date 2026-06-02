package com.models;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter
@Entity
@Table(name = "tipoinsumo")
public class TipoInsumo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer codTipoInsumo;
    @Column(length = 200)
    private String nombreTipoInsumo;
    @Column
    private LocalDateTime fechaHBajaTipoInsumo;

    public TipoInsumo() {
    }

    public TipoInsumo(int codTipoInsumo, String nombreTipoInsumo, LocalDateTime fechaHBajaTipoInsumo) {
        this.codTipoInsumo = codTipoInsumo;
        this.nombreTipoInsumo = nombreTipoInsumo;
        this.fechaHBajaTipoInsumo = fechaHBajaTipoInsumo;
    }
//    esto solo se ve en developer
}
