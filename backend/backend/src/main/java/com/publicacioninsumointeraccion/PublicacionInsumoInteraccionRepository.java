package com.publicacioninsumointeraccion;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PublicacionInsumoInteraccionRepository extends JpaRepository<PublicacionInsumoInteraccion, Long> {
}
