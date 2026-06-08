package com.publicacioninsumointeraccion;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PublicacionInsumoInteraccionRepository extends JpaRepository<PublicacionInsumoInteraccion, Long> {
    
    @Query("SELECT pii FROM PublicacionInsumoInteraccion pii " +
           "JOIN FETCH pii.tipoInteraccion " +
           "JOIN FETCH pii.usuarioCliente " +
           "LEFT JOIN FETCH pii.alquilerInsumo " +
           "WHERE pii.publicacionInsumo.idPI = :idPublicacion " +
           "ORDER BY pii.fechaHPII DESC")
    List<PublicacionInsumoInteraccion> findByPublicacionInsumoId(@Param("idPublicacion") Long idPublicacion);
}
