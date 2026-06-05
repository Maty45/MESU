package com.auth;

import com.dto.RegisterRequest;
import com.rol.Rol;
import com.rol.RolRepository;
import com.usuario.Usuario;
import com.usuario.UsuarioRepository;
import com.usuariorol.UsuarioRol;
import com.usuariorol.UsuarioRolRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final RolRepository rolRepository;
    private final UsuarioRolRepository usuarioRolRepository;

    public void register(RegisterRequest request) {

        if (usuarioRepository.existsByEmailUsuario(
                request.email())) {

            throw new RuntimeException(
                    "El email ya está registrado");
        }

        Usuario usuario = new Usuario();

        usuario.setDniUsuario(request.dni());
        usuario.setNombreUsuario(request.nombre());
        usuario.setApellidoUsuario(request.apellido());
        usuario.setEmailUsuario(request.email());

        usuario.setContraseniaUsuario(
                passwordEncoder.encode(
                        request.password()
                )
        );

        usuario.setTelefonoUsuario(
                request.telefono()
        );

        usuario.setFechaHRegistroUsuario(
                LocalDateTime.now()
        );

        usuario = usuarioRepository.save(usuario);

        Rol cliente = rolRepository
                .findByNombreRol("CLIENTE")
                .orElseThrow();

        Rol propietario = rolRepository
                .findByNombreRol("PROPIETARIO")
                .orElseThrow();

        UsuarioRol urCliente = new UsuarioRol();
        urCliente.setUsuario(usuario);
        urCliente.setRol(cliente);

        UsuarioRol urPropietario = new UsuarioRol();
        urPropietario.setUsuario(usuario);
        urPropietario.setRol(propietario);

        usuarioRolRepository.save(urCliente);
        usuarioRolRepository.save(urPropietario);
    }

    public void login(String email, String password) {

        Usuario usuario = usuarioRepository
                .findByEmailUsuario(email)
                .orElseThrow(() ->
                        new RuntimeException("Usuario no encontrado"));

        boolean passwordCorrecta =
                passwordEncoder.matches(
                        password,
                        usuario.getContraseniaUsuario()
                );

        if (!passwordCorrecta) {
            throw new RuntimeException("Contraseña incorrecta");
        }
    }

}


