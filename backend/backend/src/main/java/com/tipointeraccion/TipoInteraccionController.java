package com.tipointeraccion;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/tipointeraccion")
public class TipoInteraccionController {

    private final TipoInteraccionService tipoInteraccionService;

    public TipoInteraccionController(TipoInteraccionService tipoInteraccionService) {
        this.tipoInteraccionService = tipoInteraccionService;
    }

    @GetMapping
    public ResponseEntity<List<TipoInteraccion>> obtenerTodos() {
        return ResponseEntity.ok(tipoInteraccionService.obtenerTodos());
    }
}
