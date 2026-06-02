package com.services;

import com.models.TipoInsumo;
import com.repositories.TipoInsumoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TipoInsumoService {

    @Autowired
    private TipoInsumoRepository tipoInsumoRepository;

    public List<TipoInsumo> obtenerTodos() {
        return tipoInsumoRepository.findAll();
    }

    public Optional<TipoInsumo> obtenerPorId(Integer id) {
        return tipoInsumoRepository.findById(id);
    }

    public TipoInsumo guardar(TipoInsumo tipoInsumo) {
        return tipoInsumoRepository.save(tipoInsumo);
    }

    public void eliminar(Integer id) {
        tipoInsumoRepository.deleteById(id);
    }
}