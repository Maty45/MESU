package com.rol;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Collections;

@RestController
@RequestMapping("/api/roles")
public class RolController {

    private final RolService service;

    public RolController(RolService service) {
        this.service = service;
    }

    @GetMapping
    public List<Rol> getAllRoles() {
        try {
            return service.getAllRoles();
        } catch (Exception e) {
            System.err.println("Error al obtener los roles: " + e.getMessage());
            return e.getMessage().contains("No value present") ? Collections.emptyList() : null;
        }
    }

    @PostMapping("/saveRol")
    public Rol saveRol(@RequestBody Rol rol) {
        try {
            return service.saveRol(rol);
        } catch (Exception e) {
            System.err.println("Error al guardar el rol: " + e.getMessage());
            return null;
        }
    }

    @DeleteMapping("/delete/{id}")
    public String deleteRol(@PathVariable Long id) {
        try {
            service.deleteRol(id);
            return "Rol eliminado correctamente";
        } catch (Exception e) {
            System.err.println("Error al eliminar el rol: " + e.getMessage());
            return "Error al eliminar el rol: " + e.getMessage();
        }
    }

    @PostMapping("/asignarPermiso")
    public ResponseEntity<String> asignarPermiso(@RequestParam Long idRol, @RequestParam Long idPermiso) {
        try {
            RolPermiso rp = service.asignarPermiso(idRol, idPermiso);
            if (rp == null) {
                return ResponseEntity.status(409).build(); // 409 Conflict
            }
            return ResponseEntity.ok("Permiso asignado correctamente");
        } catch (RuntimeException e) {
            System.err.println("Error al asignar el permiso: " + e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            System.err.println("Error al asignar el permiso: " + e.getMessage());
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }


}
