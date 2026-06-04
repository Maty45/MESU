package com.alquilerinsumo;

import com.publicacioninsumo.PublicacionInsumo;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDate;

//Anotaciones Lombok
@Getter
@Setter
@NoArgsConstructor

//Anotaciones JPA
@Entity
@Table(name = "alquiler_insumo")
public class AlquilerInsumo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_alquiler_insumo")
    private Long idAlquiler;

    @Column(name = "fecha_desde_ai", nullable = false)
    private LocalDate fechaDesdeAI;

    @Column(name = "fecha_hasta_acordada_ai", nullable = false)
    private LocalDate fechaHastaAcordadaAI;

    @Column(name = "fecha_hasta_real_ai")
    private LocalDate fechaHastaRealAI;

    @Column(name = "monto_acordado_ai", nullable = false)
    private int montoAcordadoAI;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_publicacion_insumo", nullable = false)
    private PublicacionInsumo publicacionInsumo;
}
