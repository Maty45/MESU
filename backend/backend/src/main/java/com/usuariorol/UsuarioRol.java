package com.usuariorol;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.usuario.Usuario;
import com.rol.Rol;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor

@Entity
@Table(name = "usuario_rol")
public class UsuarioRol {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario_rol")
    private Long idUsuarioRol;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    @JsonBackReference
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_rol", nullable = false)
    // Removed @JsonBackReference here
    private Rol rol;

    @Column(name = "fecha_alta_ur", nullable = false)
    private LocalDateTime fechaAltaUR = LocalDateTime.now();
}