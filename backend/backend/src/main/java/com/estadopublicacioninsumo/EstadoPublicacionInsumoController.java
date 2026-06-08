package com.estadopublicacioninsumo;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/estadopublicacioninsumo")
public class EstadoPublicacionInsumoController {

    private final EstadoPublicacionInsumoService estadoPublicacionInsumoService;

    public EstadoPublicacionInsumoController(EstadoPublicacionInsumoService estadoPublicacionInsumoService) {
        this.estadoPublicacionInsumoService = estadoPublicacionInsumoService;
    }

    @GetMapping
    public ResponseEntity<List<EstadoPublicacionInsumo>> obtenerTodos() {
        return ResponseEntity.ok(estadoPublicacionInsumoService.obtenerTodos());
    }
}
