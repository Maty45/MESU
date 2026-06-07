package com.usuario;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByEmailUsuario(String emailUsuario);
    Optional<Usuario> findByDniUsuario(Long dniUsuario);
    String deleteByDniUsuario(Long dniUsuario);
    boolean existsByEmailUsuario(String emailUsuario);
    boolean existsByDniUsuario(Long dniUsuario);
}
