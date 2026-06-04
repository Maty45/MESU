package com.permiso;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/permisos")
public class PermisoController {
    private final PermisoService permisoService;

    public PermisoController(PermisoService permisoService) {
        this.permisoService = permisoService;
    }

    @GetMapping
    public List<Permiso> getAllPermisos() {
        try {
            return permisoService.getAllPermisos();
        } catch (Exception e) {
            System.err.println("Error al obtener los permisos: " + e.getMessage());
            return null;
        }
    }

    @PostMapping("/savePermiso")
    public Permiso savePermiso(@RequestBody Permiso permiso) {
        try {
            return permisoService.savePermiso(permiso);
        } catch (Exception e) {
            System.err.println("Error al guardar el permiso: " + e.getMessage());
            return null;
        }
    }

    @DeleteMapping("/delete/{id}")
    public String deletePermiso(@PathVariable Long id) {
        try {
             permisoService.deletePermiso(id);
             return "Permiso eliminado correctamente";
        } catch (Exception e) {
            System.err.println("Error al eliminar el permiso: " + e.getMessage());
            return "Error al eliminar el permiso: " + e.getMessage();
        }
    }


}
