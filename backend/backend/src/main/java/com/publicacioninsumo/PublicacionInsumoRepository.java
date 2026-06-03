package com.publicacioninsumo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PublicacionInsumoRepository extends JpaRepository<PublicacionInsumo, Long> {
}
