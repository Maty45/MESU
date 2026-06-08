package com.rol;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.permiso.Permiso;
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
@Table(name = "rol_permiso",
        uniqueConstraints = @UniqueConstraint(columnNames = {"id_rol", "id_permiso"})
)
public class RolPermiso {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_rol_permiso")
    private Long idRolPermiso;

    @Column(name = "fecha_asignacion_rp")
    private LocalDate fechaAsignacionRP = LocalDate.now();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_rol", nullable = false)
    @JsonBackReference
    private Rol rol;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_permiso", nullable = false)
    private Permiso permiso;

}
