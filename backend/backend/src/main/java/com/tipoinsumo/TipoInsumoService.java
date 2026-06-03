package com.tipoinsumo;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TipoInsumoService {

    private TipoInsumoRepository tipoInsumoRepository;

    public TipoInsumoService(TipoInsumoRepository tipoInsumoRepository) {
        this.tipoInsumoRepository = tipoInsumoRepository;
    }

    public List<TipoInsumo> obtenerTodos() {
        return tipoInsumoRepository.findAll();
    }

    public Optional<TipoInsumo> obtenerPorId(Long id) {
        return tipoInsumoRepository.findById(id);
    }

    public TipoInsumo guardar(TipoInsumo tipoInsumo) {
        return tipoInsumoRepository.save(tipoInsumo);
    }

    public void eliminar(Long id) {
        tipoInsumoRepository.deleteById(id);
    }
}