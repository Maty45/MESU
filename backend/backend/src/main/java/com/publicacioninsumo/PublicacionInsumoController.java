package com.publicacioninsumo;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/publicaciones")
public class PublicacionInsumoController {
    private final PublicacionInsumoService service;

    public PublicacionInsumoController(PublicacionInsumoService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<PublicacionInsumo> getAllPublicaciones() {
        try {
            return service.getAllPublicaciones();
        } catch (Exception e) {
            System.err.println("Error al obtener las publicaciones: " + e.getMessage());
            return Collections.emptyList();
        }
    }

    @GetMapping("/{id}")
    public PublicacionInsumo getPublicacionById(@PathVariable Long id) {
        try {
            return service.getPublicacionById(id);
        } catch (Exception e) {
            System.err.println("Error al obtener la publicación: " + e.getMessage());
            return null;
        }
    }

    @PostMapping("/save")
    public PublicacionInsumo savePublicacion(@RequestBody PublicacionInsumo publicacionInsumo) {
        try {
            return service.savePublicacion(publicacionInsumo);
        } catch (Exception e) {
            System.err.println("Error al guardar la publicación: " + e.getMessage());
            return null;
        }
    }

    @DeleteMapping("/delete/{id}")
    public String deletePublicacion(@PathVariable Long id) {
        try {
            service.deletePublicacion(id);
            return "Publicación eliminada correctamente";
        } catch (Exception e) {
            System.err.println("Error al eliminar la publicación: " + e.getMessage());
            return "Error al eliminar la publicación: " + e.getMessage();
        }
    }

}
