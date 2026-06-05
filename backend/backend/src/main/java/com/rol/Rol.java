package com.rol;

import com.usuariorol.UsuarioRol;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor

@Entity
@Table(name = "rol")
public class Rol {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_rol")
    private Long idRol;

    @Column(name = "nombre_Rol", nullable = false, unique = true)
    private String nombreRol;

    @Column(name = "fecha_alta_rol", nullable = true)
    private LocalDate fechaAltaRol = LocalDate.now();

    @Column(name = "fecha_baja_rol")
    private LocalDate fechaBajaRol;

    @OneToMany(mappedBy = "rol",
            cascade = CascadeType.ALL,
            orphanRemoval = true)
    private List<RolPermiso> rolPermisos;

    @OneToMany(mappedBy = "rol",
            cascade = CascadeType.ALL,
            orphanRemoval = true)
    private List<UsuarioRol> usuarioRoles;
}