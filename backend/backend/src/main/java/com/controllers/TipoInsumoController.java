
package com.controllers;

import com.models.TipoInsumo;
import com.services.TipoInsumoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tipoinsumo")
public class TipoInsumoController {

    @Autowired
    private TipoInsumoService tipoInsumoService;

    @GetMapping
    public ResponseEntity<List<TipoInsumo>> obtenerTodos() {
        return ResponseEntity.ok(tipoInsumoService.obtenerTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TipoInsumo> obtenerPorId(@PathVariable Integer id) {
        Optional<TipoInsumo> tipoInsumo = tipoInsumoService.obtenerPorId(id);
        return tipoInsumo.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<TipoInsumo> crear(@RequestBody TipoInsumo tipoInsumo) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(tipoInsumoService.guardar(tipoInsumo));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TipoInsumo> actualizar(@PathVariable Integer id, @RequestBody TipoInsumo tipoInsumo) {
        if (tipoInsumoService.obtenerPorId(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        tipoInsumo.setCodTipoInsumo(id);
        return ResponseEntity.ok(tipoInsumoService.guardar(tipoInsumo));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        if (tipoInsumoService.obtenerPorId(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        tipoInsumoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}