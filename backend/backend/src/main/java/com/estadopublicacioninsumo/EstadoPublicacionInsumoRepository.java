package com.estadopublicacioninsumo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EstadoPublicacionInsumoRepository extends JpaRepository<EstadoPublicacionInsumo, Long> {

    Optional<EstadoPublicacionInsumo> findByNombreEPI(String nombreEPI);
}
