package com.tipoinsumo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TipoInsumoRepository extends JpaRepository<TipoInsumo, Long> {
}
