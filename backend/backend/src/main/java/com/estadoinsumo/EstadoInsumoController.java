package com.estadoinsumo;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/estadoinsumo")
public class EstadoInsumoController {

    private final EstadoInsumoService estadoInsumoService;

    public EstadoInsumoController(EstadoInsumoService estadoInsumoService) {
        this.estadoInsumoService = estadoInsumoService;
    }

    @GetMapping
    public ResponseEntity<List<EstadoInsumo>> obtenerTodos() {
        return ResponseEntity.ok(estadoInsumoService.obtenerTodos());
    }
}
