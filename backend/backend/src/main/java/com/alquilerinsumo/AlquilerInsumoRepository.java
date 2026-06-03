package com.alquilerinsumo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AlquilerInsumoRepository extends JpaRepository<AlquilerInsumo, Long> {
}
