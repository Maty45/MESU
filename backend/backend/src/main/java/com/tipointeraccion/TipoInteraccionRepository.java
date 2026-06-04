package com.tipointeraccion;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TipoInteraccionRepository extends JpaRepository<TipoInteraccion,Integer> {
}
