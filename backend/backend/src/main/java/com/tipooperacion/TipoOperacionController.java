package com.tipooperacion;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/tipooperacion")
public class TipoOperacionController {

    private final TipoOperacionService tipoOperacionService;

    public TipoOperacionController(TipoOperacionService tipoOperacionService) {
        this.tipoOperacionService = tipoOperacionService;
    }

    @GetMapping
    public ResponseEntity<List<TipoOperacion>> obtenerTodos() {
        return ResponseEntity.ok(tipoOperacionService.obtenerTodos());
    }
}
