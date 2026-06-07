package com.rol;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RolPermisoService {
    private final RolRepository rolRepository;

    public RolPermisoService(RolRepository rolRepository) {
        this.rolRepository = rolRepository;
    }

    public List<Rol> getAllRP() {
       try {
           return rolRepository.findAll();
       } catch (Exception e) {
           System.err.println("Error al obtener los roles: " + e.getMessage());
           return null;
       }
    }

    public Rol crearRP(Rol rol) {
       try {
           return rolRepository.save(rol);
       } catch (Exception e) {
           System.err.println("Error al guardar el rol: " + e.getMessage());
           return null;
       }
    }

    public boolean deleteRP(Long id) {
        if (!rolRepository.existsById(id)) {
            return false;
        }
        rolRepository.deleteById(id);
        return true;
    }
}
