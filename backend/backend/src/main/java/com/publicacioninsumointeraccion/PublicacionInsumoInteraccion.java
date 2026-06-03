package com.publicacioninsumointeraccion;

import com.publicacioninsumo.PublicacionInsumo;
import com.tipointeraccion.TipoInteraccion;
import com.usuario.Usuario;
import com.alquilerinsumo.AlquilerInsumo;
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
@Table(name = "publicacion_insumo_interaccion")
public class PublicacionInsumoInteraccion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pii")
    private Long idPII;

    @Column(name = "fecha_hora_publicacion_insumo_interaccion", nullable = false)
    private LocalDateTime fechaHPII;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario_cliente", nullable = false)
    private Usuario usuarioCliente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_publicacion_insumo", nullable = false)
    private PublicacionInsumo publicacionInsumo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_tipo_interaccion", nullable = false)
    private TipoInteraccion tipoInteraccion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_alquiler_insumo")
    private AlquilerInsumo alquilerInsumo;
}
