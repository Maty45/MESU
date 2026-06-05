package com.permiso;

import com.rol.RolRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PermisoService {

    private final PermisoRepository permisoRepository;

    public PermisoService(PermisoRepository permisoRepository) {
        this.permisoRepository = permisoRepository;
    }

    public Permiso savePermiso(Permiso permiso) {
        try {
            return permisoRepository.save(permiso);
        } catch (Exception e) {
            System.err.println("Error al guardar el permiso: " + e.getMessage());
            return null;
        }
    }

    public List<Permiso> getAllPermisos () {
        try {
            return permisoRepository.findAll();
        } catch (Exception e) {
            System.err.println("Error al obtener los permisos: " + e.getMessage());
            return null;
        }
    }

    public void deletePermiso(Long id) {
        try {
            permisoRepository.deleteById(id);
        } catch (Exception e) {
            System.err.println("Error al eliminar el permiso: " + e.getMessage());
        }
    }


}
