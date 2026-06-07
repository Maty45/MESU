package com.auth;

import com.dto.LoginRequest;
import com.dto.LoginResponse;
import com.dto.RegisterRequest;
import com.jwt.JwtService;
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
    private final JwtService jwtService;

    public void register(RegisterRequest request) {

        if (usuarioRepository.existsByEmailUsuario(request.email())) {
            throw new RuntimeException("El email ya está registrado");
        }

        if (usuarioRepository.existsByDniUsuario(request.dni())) {
            throw new RuntimeException("El DNI ya está registrado");
        }

        Usuario usuario = new Usuario();

        usuario.setDniUsuario(request.dni());
        usuario.setNombreUsuario(request.nombre());
        usuario.setApellidoUsuario(request.apellido());
        usuario.setEmailUsuario(request.email());

        usuario.setContraseniaUsuario(
                passwordEncoder.encode(request.password())
        );

        usuario.setTelefonoUsuario(request.telefono());
        usuario.setFechaHRegistroUsuario(LocalDateTime.now());

        usuario = usuarioRepository.save(usuario);

        Rol cliente;
        Rol propietario;

        try {
        cliente = rolRepository
                .findByNombreRol("CLIENTE")
                .orElseThrow();
        propietario = rolRepository
                .findByNombreRol("PROPIETARIO")
                .orElseThrow();
        } catch (Exception e) {
            System.err.println("Error al asignar roles al usuario: " + e.getMessage());
            throw new RuntimeException("Error al asignar roles al usuario: " + e.getMessage());
        }


        UsuarioRol urCliente = new UsuarioRol();
        urCliente.setUsuario(usuario);
        urCliente.setRol(cliente);

        UsuarioRol urPropietario = new UsuarioRol();
        urPropietario.setUsuario(usuario);
        urPropietario.setRol(propietario);

        usuarioRolRepository.save(urCliente);
        usuarioRolRepository.save(urPropietario);
    }

    public LoginResponse login(LoginRequest request) {

        Usuario usuario = usuarioRepository
                .findByEmailUsuario(request.email())
                .orElseThrow(() ->
                        new RuntimeException("Usuario no encontrado"));

        boolean passwordCorrecta =
                passwordEncoder.matches(
                        request.password(),
                        usuario.getContraseniaUsuario()
                );

        if (!passwordCorrecta) {
            throw new RuntimeException("Contraseña incorrecta");
        }

        String token =
                jwtService.generateToken(
                        usuario.getEmailUsuario()
                );

        return new LoginResponse(token);
    }

}


