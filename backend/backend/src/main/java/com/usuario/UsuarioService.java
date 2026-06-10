package com.usuario;

import com.exception.UsuarioNotFoundException;
import com.rol.dto.RolDTO;
import com.usuario.dto.UsuarioDTO;
import com.usuario.dto.UsuarioUpdateDTO;
import com.usuariorol.UsuarioRol;
import com.usuariorol.dto.UsuarioRolDTO;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime; // Import LocalDateTime
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

    @Transactional
    public Usuario modify(UsuarioUpdateDTO dto) {

        Usuario usuario = usuarioRepository
                .findByEmailUsuario(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));


        usuario.setNombreUsuario(dto.getNombre());
        usuario.setApellidoUsuario(dto.getApellido());
        usuario.setTelefonoUsuario(dto.getTelefono());
        usuario.setDniUsuario(dto.getDni());

        return usuarioRepository.save(usuario);
    }

    @Transactional
    public String delete(Long dni) {
        try {
            Usuario usuario = usuarioRepository.findByDniUsuario(dni)
                    .orElseThrow(() -> new UsuarioNotFoundException("Usuario no encontrado con DNI: " + dni));

            usuario.setFechaHBajaUsuario(LocalDateTime.now());
            usuarioRepository.save(usuario);
            return "Usuario con DNI: " + dni + " dado de baja exitosamente.";
        } catch (UsuarioNotFoundException e) {
            throw e; // Re-throw specific exception
        } catch (Exception e) {
            throw new RuntimeException("Error al dar de baja el usuario: " + e.getMessage());
        }
    }

}