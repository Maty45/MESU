package com.usuario;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    @Query("SELECT u FROM Usuario u JOIN FETCH u.usuarioRoles")
    List<Usuario> findAllWithRoles();
    Optional<Usuario> findByEmailUsuario(String emailUsuario);
    Optional<Usuario> findByDniUsuario(Long dniUsuario);
    String deleteByDniUsuario(Long dniUsuario);
    boolean existsByEmailUsuario(String emailUsuario);
    boolean existsByDniUsuario(Long dniUsuario);
    @Query("SELECT u FROM Usuario u WHERE u.fechaHBajaUsuario IS NULL")
    List<Usuario> findAllActive();
}