package com.tipointeraccion;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TipoInteraccionService {

    private final TipoInteraccionRepository tipoInteraccionRepository;

    public TipoInteraccionService(TipoInteraccionRepository tipoInteraccionRepository) {
        this.tipoInteraccionRepository = tipoInteraccionRepository;
    }

    public List<TipoInteraccion> obtenerTodos() {
        return tipoInteraccionRepository.findAll();
    }
}
