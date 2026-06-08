package com.estadopublicacioninsumo;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class EstadoPublicacionInsumoService {

    private final EstadoPublicacionInsumoRepository estadoPublicacionInsumoRepository;

    public EstadoPublicacionInsumoService(EstadoPublicacionInsumoRepository estadoPublicacionInsumoRepository) {
        this.estadoPublicacionInsumoRepository = estadoPublicacionInsumoRepository;
    }

    public List<EstadoPublicacionInsumo> obtenerTodos() {
        return estadoPublicacionInsumoRepository.findAll();
    }
}
