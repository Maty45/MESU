package com.rol;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.usuariorol.UsuarioRol;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.ArrayList;
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

    @OneToMany(mappedBy = "rol", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<RolPermiso> rolPermisos = new ArrayList<>();

    @OneToMany(mappedBy = "rol",
            cascade = CascadeType.ALL,
            orphanRemoval = true)
    @JsonManagedReference
    private List<UsuarioRol> usuarioRoles;
}