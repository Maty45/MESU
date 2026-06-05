package com.rol;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rolPermisos")
public class RolPermisoController {

    private final RolPermisoService rolPermisoService;

    public RolPermisoController(RolPermisoService rolPermisoService) {
        this.rolPermisoService = rolPermisoService;
    }

    @GetMapping
    public ResponseEntity<java.util.List<Rol>> getAllRP() {
        try {
            java.util.List<Rol> roles = rolPermisoService.getAllRP();
            return ResponseEntity.ok(roles);
        } catch (Exception e) {
            System.err.println("Error al obtener los roles: " + e.getMessage());
            return ResponseEntity.status(500).build();
        }
    }

    @PostMapping("/saveRP")
    public ResponseEntity<Rol> crearRP(@RequestBody Rol rol) {
        try {
            Rol saved = rolPermisoService.crearRP(rol);
            return ResponseEntity.status(201).body(saved);
        } catch (Exception e) {
            System.err.println("Error al guardar el rol: " + e.getMessage());
            return ResponseEntity.status(500).build();
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteRP(Long id) {
        try {
            rolPermisoService.deleteRP(id);
            return ResponseEntity.ok("Rol eliminado correctamente");
        } catch (Exception e) {
            System.err.println("Error al eliminar el rol: " + e.getMessage());
            return ResponseEntity.status(500).body("Error al eliminar el rol: " + e.getMessage());
        }
    }



}
