package com.usuario;

import com.rol.Rol;
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
@Table(name = "usuario")
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Long idUsuario;

    @Column(name = "dni_usuario", nullable = false, unique = true)
    private String dniUsuario;

    @Column(name = "nombre_usuario", nullable = false)
    private String nombreUsuario;

    @Column(name = "apellido_usuario", nullable = false)
    private String apellidoUsuario;

    @Column(name = "email_usuario", nullable = false, unique = true)
    private String emailUsuario;

    @Column(name = "telefono_usuario", nullable = false)
    private String telefonoUsuario;

    @Column(name = "google_id", nullable = false, unique = true)
    private String googleId;

    @Column(name = "fecha_hora_registro_usuario", nullable = false)
    private LocalDateTime fechaHRegistroUsuario;

    @Column(name = "fecha_hora_baja_usuario")
    private LocalDateTime fechaHBajaUsuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_rol", nullable = false)
    private Rol rol;
}
