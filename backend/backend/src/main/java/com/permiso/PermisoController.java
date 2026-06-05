package com.permiso;

import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("api/permisos")
public class PermisoController {
    private final PermisoService permisoService;

    public PermisoController(PermisoService permisoService) {
        this.permisoService = permisoService;
    }

    @GetMapping
    public ResponseEntity<java.util.List<Permiso>> getAllPermisos() {
        try {
            java.util.List<Permiso> permisos = permisoService.getAllPermisos();
            return ResponseEntity.ok(permisos);
        } catch (Exception e) {
            System.err.println("Error al obtener los permisos: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/savePermiso")
    public ResponseEntity<Permiso> savePermiso(@RequestBody Permiso permiso) {
        try {
            Permiso saved = permisoService.savePermiso(permiso);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (Exception e) {
            System.err.println("Error al guardar el permiso: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deletePermiso(@PathVariable Long id) {
        try {
             permisoService.deletePermiso(id);
             return ResponseEntity.ok("Permiso eliminado correctamente");
        } catch (Exception e) {
            System.err.println("Error al eliminar el permiso: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al eliminar el permiso: " + e.getMessage());
        }
    }


}
