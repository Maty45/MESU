package com.rol;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RolService {

        private final RolRepository rolRepository;

        public RolService(RolRepository rolRepository) {
            this.rolRepository = rolRepository;
        }

        public List<Rol> getAllRoles() {
            try {
                return rolRepository.findAll();
            } catch (Exception e) {
                System.err.println("Error al obtener los roles: " + e.getMessage());
                return null;
            }
        }

        public Rol saveRol(Rol rol) {
            try {
             return rolRepository.save(rol);
            } catch (Exception e) {
                System.err.println("Error al guardar el rol: " + e.getMessage());
                return null;
            }
        }

        public Rol getRolById(Long id) {
            return rolRepository.findById(id).orElse(null);
        }

        public void deleteRol(Long id) {
            try {
                rolRepository.deleteById(id);
            } catch (Exception e) {
                System.err.println("Error al eliminar el rol: " + e.getMessage());
            }
        }

}
