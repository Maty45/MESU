package com.usuariorol;

import com.usuario.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsuarioRolRepository extends JpaRepository<UsuarioRol, Long> {

    boolean existsByUsuarioAndRol_NombreRol(
            Usuario usuario,
            String nombreRol
    );
}