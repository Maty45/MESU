package com.reporte;

import com.usuario.Usuario;
import com.publicacioninsumo.PublicacionInsumo;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

//Anotaciones Lombok
@Getter
@Setter
@NoArgsConstructor

//Anotaciones JPA
@Entity
@Table(name = "reporte")
public class Reporte {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_reporte")
    private Long id;

    @Column(name = "fecha_hora_reporte", nullable = true)
    private LocalDate fechaHoraReporte = LocalDate.now();

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_reporte", nullable = false)
    private TipoReporte tipoReporte;

    @Column(name = "detalle_reporte", nullable = false, length = 512)
    private String detalleReporte;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario_reportante", nullable = false)
    private Usuario usuarioReportante;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario_reportado")
    private Usuario usuarioReportado;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_publicacion_insumo_reportada")
    private PublicacionInsumo publicacionInsumoReportada;
}
