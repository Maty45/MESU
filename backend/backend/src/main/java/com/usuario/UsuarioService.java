package com.usuario;

import com.exception.UsuarioNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

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
    public List<Usuario> getAllUser() {
        try {
            return usuarioRepository.findAll();
        } catch (Exception e) {
            throw new RuntimeException("Error al obtener los usuarios: " + e.getMessage());
        }
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
