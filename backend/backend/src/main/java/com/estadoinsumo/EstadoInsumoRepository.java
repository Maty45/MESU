package com.estadoinsumo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EstadoInsumoRepository extends JpaRepository<EstadoInsumo, Long> {
}
