package com.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TipoInsumoRepository extends JpaRepository<com.models.TipoInsumo, Integer> {
}
