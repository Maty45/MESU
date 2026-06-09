package com.alquilerinsumo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface AlquilerInsumoRepository extends JpaRepository<AlquilerInsumo, Long> {
    
    @Query("SELECT a FROM AlquilerInsumo a " +
           "WHERE a.publicacionInsumo.idPI = :idPublicacion " +
           "AND a.fechaHastaRealAI IS NULL")
    Optional<AlquilerInsumo> findActiveRentalByPublicacionId(@Param("idPublicacion") Long idPublicacion);
}
