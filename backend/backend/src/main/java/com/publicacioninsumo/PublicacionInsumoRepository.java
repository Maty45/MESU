package com.publicacioninsumo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PublicacionInsumoRepository extends JpaRepository<PublicacionInsumo, Long> {

    // Buscar publicaciones ACTIVAS para el catálogo, optimizando la carga de imágenes y relaciones
    @Query("SELECT DISTINCT p FROM PublicacionInsumo p " +
            "JOIN FETCH p.condicionOperacion " +
            "JOIN FETCH p.estadoInsumo " +
            "JOIN FETCH p.tipoInsumo " +
            "JOIN FETCH p.estadoPublicacionInsumo " +
            "JOIN FETCH p.usuarioPropietario " +
            "LEFT JOIN FETCH p.publicacionInsumoImagenes " +
            "WHERE p.estadoPublicacionInsumo.nombreEPI = :nombreEstado AND p.estadoPublicacionInsumo.nombreEPI != 'ELIMINADA'")
    List<PublicacionInsumo> findByEstadoPublicacionCatalogo(@Param("nombreEstado") String nombreEstado);

    // Buscar una publicación en particular para la vista en detalle de la misma
    @Query("SELECT p FROM PublicacionInsumo p " +
            "JOIN FETCH p.condicionOperacion " +
            "JOIN FETCH p.estadoInsumo " +
            "JOIN FETCH p.tipoInsumo " +
            "JOIN FETCH p.usuarioPropietario " +
            "JOIN FETCH p.publicacionInsumoUbicacion " +
            "LEFT JOIN FETCH p.publicacionInsumoImagenes " +
            "WHERE p.idPI = :id")
    Optional<PublicacionInsumo> findByDetalleId(@Param("id") long id);

    // Buscar todas las publicaciones de un propietario por su email, excluyendo las ELIMINADAS
    @Query("SELECT DISTINCT p FROM PublicacionInsumo p " +
            "JOIN FETCH p.condicionOperacion " +
            "JOIN FETCH p.estadoInsumo " +
            "JOIN FETCH p.tipoInsumo " +
            "JOIN FETCH p.estadoPublicacionInsumo " +
            "JOIN FETCH p.usuarioPropietario " +
            "JOIN FETCH p.publicacionInsumoUbicacion " +
            "LEFT JOIN FETCH p.publicacionInsumoImagenes " +
            "WHERE p.usuarioPropietario.emailUsuario = :email " +
            "AND p.estadoPublicacionInsumo.nombreEPI <> 'ELIMINADA'")
    List<PublicacionInsumo> findByUsuarioPropietarioEmailUsuario(@Param("email") String email);

    @Query("SELECT p.tipoInsumo.nombreTI, COUNT(p) FROM PublicacionInsumo p WHERE p.estadoPublicacionInsumo.nombreEPI = 'ACTIVA' GROUP BY p.tipoInsumo.nombreTI")
    List<Object[]> countActiveProductsByCategory();

    @Query("SELECT COUNT(p) FROM PublicacionInsumo p WHERE p.estadoPublicacionInsumo.nombreEPI = 'ACTIVA'")
    Long countAllActiveProducts();
}