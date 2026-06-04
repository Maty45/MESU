package com.condicionoperacion;

import com.tipooperacion.TipoOperacion;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

//Anotaciones Lombok
@Getter
@Setter
@NoArgsConstructor

//Anotaciones JPA
@Entity
@Table(name = "condicion_operacion")
public class CondicionOperacion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_condicion_operacion")
    private Long idCondicionOperacion;

    @Column(name = "monto_condicion_operacion")
    private int montoCondicionOperacion;

    @Enumerated(EnumType.STRING)
    @Column(name = "unidad_tiempo_condicion_operacion")
    private UnidadTiempo unidadTiempoCO;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_tipo_operacion", nullable = false)
    private TipoOperacion tipoOperacion;

}
