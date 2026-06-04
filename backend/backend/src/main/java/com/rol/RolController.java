package com.rol;

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
            return Collections.emptyList();
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


}
