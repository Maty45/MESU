package com.tipointeraccion;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface TipoInteraccionRepository extends JpaRepository<TipoInteraccion,Integer> {
    Optional<TipoInteraccion> findByNombreTipoInteraccion(String nombreTipoInteraccion);
}
