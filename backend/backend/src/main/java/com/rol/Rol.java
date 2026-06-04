package com.rol;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

//Anotaciones Lombok
@Getter
@Setter
@NoArgsConstructor

//Anotaciones JPA
@Entity
@Table(name = "rol")
public class Rol {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_rol")
    private Long idRol;

    @Column(name = "cod_rol", nullable = false, unique = true)
    private int codRol;

    @Column(name = "nombre_Rol", nullable = false, unique = true)
    private String nombreRol;

    @Column(name = "fecha_alta_rol", nullable = false)
    private LocalDate fechaAltaRol;

    @Column(name = "fecha_baja_rol")
    private LocalDate fechaBajaRol;

    @OneToMany(mappedBy = "rol", cascade = {CascadeType.ALL}, orphanRemoval = true)
    private List<RolPermiso> rolPermisos;
}
