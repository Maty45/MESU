package com.tipooperacion;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TipoOperacionService {

    private final TipoOperacionRepository tipoOperacionRepository;

    public TipoOperacionService(TipoOperacionRepository tipoOperacionRepository) {
        this.tipoOperacionRepository = tipoOperacionRepository;
    }

    public List<TipoOperacion> obtenerTodos() {
        return tipoOperacionRepository.findAll();
    }
}
