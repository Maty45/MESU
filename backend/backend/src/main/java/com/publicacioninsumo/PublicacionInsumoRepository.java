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
            "WHERE p.estadoPublicacionInsumo.nombreEPI = :nombreEstado")
    List<PublicacionInsumo> findByEstadoPublicacionCatalogo(@Param("nombreEstado") String nombreEstado);

    // Buscar una publicación en particular para la vista en detalle de la misma
    @Query("SELECT p FROM PublicacionInsumo p " +
            "JOIN FETCH p.condicionOperacion " +
            "JOIN FETCH p.estadoInsumo " +
            "JOIN FETCH p.tipoInsumo " +
            "JOIN FETCH p.usuarioPropietario " +
            "JOIN FETCH p.publicacionInsumoUbicacion " +
            "LEFT JOIN FETCH p.publicacionInsumoImagenes " +
            "WHERE p.nroPI = :id")
    Optional<PublicacionInsumo> findByDetalleId(@Param("id") long id);

    // Buscar publicaciones por tipo de insumo
    @Query("SELECT DISTINCT p FROM PublicacionInsumo p " +
            "LEFT JOIN FETCH p.imagenes " +
            "WHERE p.tipoInsumo.nombreTipoInsumo = :nombreTipoInsumo")
    List<PublicacionInsumo> findByTipoInsumo(@Param("nombreTipoInsumo") String nombreTipoInsumo);

    // Buscar publicaciones por estado físico del insumo
    @Query("SELECT p FROM PublicacionInsumo p WHERE p.estadoInsumo.nombreEstadoInsumo = :nombreEstadoInsumo")
    List<PublicacionInsumo> findByEstadoInsumo(@Param("nombreEstadoInsumo") String nombreEstadoInsumo);

    // Buscar publicaciones de un usuario particular (Mis Publicaciones)
    @Query("SELECT DISTINCT p FROM PublicacionInsumo p " +
            "LEFT JOIN FETCH p.imagenes " +
            "WHERE p.usuarioPropietario.idUsuario = :idUsuario")
    List<PublicacionInsumo> findByUsuarioPropietario(@Param("idUsuario") Long idUsuario);
}
