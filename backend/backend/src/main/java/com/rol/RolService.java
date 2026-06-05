package com.rol;
import com.permiso.Permiso;
import com.permiso.PermisoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RolService {

        private final RolRepository rolRepository;
        private final PermisoRepository permisoRepository;

        public RolService(RolRepository rolRepository, PermisoRepository permisoRepository) {
            this.rolRepository = rolRepository;
            this.permisoRepository = permisoRepository;
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

    public RolPermiso asignarPermiso(Long idRol, Long idPermiso) {
        Rol rol = rolRepository.findById(idRol).orElseThrow(() -> new RuntimeException("Rol no encontrado"));
        Permiso permiso = permisoRepository.findById(idPermiso).orElseThrow(() -> new RuntimeException("Permiso no encontrado"));

        boolean yaExiste = rol.getRolPermisos() != null &&
                rol.getRolPermisos().stream()
                        .anyMatch(rp -> rp.getPermiso() != null && idPermiso.equals(rp.getPermiso().getIdPermiso()));

        if (yaExiste) {
            throw new RuntimeException("El permiso ya está asignado al rol");
        }

        RolPermiso nuevo = new RolPermiso();
        nuevo.setRol(rol);
        nuevo.setPermiso(permiso);

        if (rol.getRolPermisos() == null) {
            rol.setRolPermisos(new java.util.ArrayList<>());
        }
        rol.getRolPermisos().add(nuevo);

        Rol rolGuardado = rolRepository.save(rol); // cascade guarda RolPermiso

        return rolGuardado.getRolPermisos().stream()
                .filter(rp -> rp.getPermiso() != null && idPermiso.equals(rp.getPermiso().getIdPermiso()))
                .findFirst()
                .orElse(null);
    }




}
