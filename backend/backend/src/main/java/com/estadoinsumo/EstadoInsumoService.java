package com.estadoinsumo;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class EstadoInsumoService {

    private final EstadoInsumoRepository estadoInsumoRepository;

    public EstadoInsumoService(EstadoInsumoRepository estadoInsumoRepository) {
        this.estadoInsumoRepository = estadoInsumoRepository;
    }

    public List<EstadoInsumo> obtenerTodos() {
        return estadoInsumoRepository.findAll();
    }
}
