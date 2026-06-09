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

    @Query("SELECT pii FROM PublicacionInsumoInteraccion pii " +
           "JOIN FETCH pii.tipoInteraccion ti " +
           "JOIN FETCH pii.usuarioCliente uc " +
           "JOIN FETCH pii.publicacionInsumo pi " +
           "LEFT JOIN FETCH pii.alquilerInsumo ai " +
           "WHERE pi.usuarioPropietario.emailUsuario = :email " +
           "AND ti.nombreTipoInteraccion IN ('VENTA', 'DONACION', 'ALQUILER') " +
           "ORDER BY pii.fechaHPII DESC")
    List<PublicacionInsumoInteraccion> findConcretedOperationsByOwnerEmail(@Param("email") String email);

    @Query("SELECT pii FROM PublicacionInsumoInteraccion pii " +
           "JOIN FETCH pii.tipoInteraccion ti " +
           "JOIN FETCH pii.usuarioCliente uc " +
           "JOIN FETCH pii.publicacionInsumo pi " +
           "JOIN FETCH pii.alquilerInsumo ai " +
           "WHERE pi.usuarioPropietario.emailUsuario = :email " +
           "AND ti.nombreTipoInteraccion = 'ALQUILER' " +
           "AND ai.fechaHastaRealAI IS NULL " +
           "ORDER BY ai.fechaHastaAcordadaAI ASC")
    List<PublicacionInsumoInteraccion> findActiveRentalsByOwnerEmail(@Param("email") String email);
}
