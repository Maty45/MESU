package com.usuario;

import com.exception.UsuarioNotFoundException;
import com.rol.dto.RolDTO;
import com.usuario.dto.UsuarioDTO;
import com.usuariorol.UsuarioRol;
import com.usuariorol.dto.UsuarioRolDTO;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UsuarioService {
    private final UsuarioRepository usuarioRepository;

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public Usuario save(Usuario usuario) {
        try{
            return usuarioRepository.save(usuario);
        } catch (Exception e) {
            throw new RuntimeException("Error al guardar el usuario: " + e.getMessage());
        }
    }
    public List<UsuarioDTO> getAllUser() { // Changed return type to List<UsuarioDTO>
        try {
            List<Usuario> usuarios = usuarioRepository.findAllWithRoles();
            return usuarios.stream().map(this::convertToDto).collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Error al obtener los usuarios: " + e.getMessage());
        }
    }

    // Helper method to convert Usuario entity to UsuarioDTO
    private UsuarioDTO convertToDto(Usuario usuario) {
        List<UsuarioRolDTO> usuarioRolesDTO = usuario.getUsuarioRoles().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());

        return new UsuarioDTO(
                usuario.getIdUsuario(),
                usuario.getDniUsuario(),
                usuario.getNombreUsuario(),
                usuario.getApellidoUsuario(),
                usuario.getEmailUsuario(),
                usuario.getTelefonoUsuario(),
                usuario.getFechaHRegistroUsuario(),
                usuario.getFechaHBajaUsuario(),
                usuarioRolesDTO
        );
    }

    // Helper method to convert UsuarioRol entity to UsuarioRolDTO
    private UsuarioRolDTO convertToDto(UsuarioRol usuarioRol) {
        RolDTO rolDTO = new RolDTO(
                usuarioRol.getRol().getIdRol(),
                usuarioRol.getRol().getNombreRol(),
                usuarioRol.getRol().getFechaAltaRol(),
                usuarioRol.getRol().getFechaBajaRol()
        );
        return new UsuarioRolDTO(rolDTO);
    }


    public Usuario findByDNI(Long dni) {
        return usuarioRepository.findByDniUsuario(dni)
                .orElseThrow(() -> new UsuarioNotFoundException("Usuario no encontrado con DNI: " + dni));
    }

    public Usuario modify(Usuario usuario) {
        try {
            return usuarioRepository.save(usuario);
        } catch (Exception e) {
            throw new RuntimeException("Error al modificar el usuario: " + e.getMessage());
        }
    }

    @Transactional
    public  String delete(Long dni) {
        try{
            usuarioRepository.deleteByDniUsuario(dni);
            return "Usuario eliminado con DNI: " + dni;
        } catch (Exception e) {
            throw new RuntimeException("Error al eliminar el usuario: " + e.getMessage());
        }
    }

}