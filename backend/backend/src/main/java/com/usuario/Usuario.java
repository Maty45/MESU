package com.usuario;

import java.util.List;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import com.usuariorol.UsuarioRol;

import java.time.LocalDateTime;

//Anotaciones Lombok
@Getter
@Setter
@NoArgsConstructor

//Anotaciones JPA
@Entity
@Table(name = "usuario")
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Long idUsuario;

    @Column(name = "dni_usuario", nullable = false, unique = true)
    private Long dniUsuario;

    @Column(name = "nombre_usuario", nullable = false)
    private String nombreUsuario;

    @Column(name = "apellido_usuario", nullable = false)
    private String apellidoUsuario;

    @Column(name = "email_usuario", nullable = false, unique = true)
    private String emailUsuario;

    @Column(name = "contrasenia_usuario", nullable = false)
    private String contraseniaUsuario;

    @Column(name = "telefono_usuario", nullable = false)
    private Long telefonoUsuario;

    @Column(name = "fecha_hora_registro_usuario", nullable = false)
    private LocalDateTime fechaHRegistroUsuario;

    @Column(name = "fecha_hora_baja_usuario")
    private LocalDateTime fechaHBajaUsuario;

    @OneToMany(mappedBy = "usuario",
            cascade = CascadeType.ALL,
            orphanRemoval = true)
    private List<UsuarioRol> usuarioRoles;
}
