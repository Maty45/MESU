package com.usuario;

import com.usuario.dto.UsuarioDTO; // Import UsuarioDTO
import com.usuario.dto.UsuarioUpdateDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List; // Import List

@RestController
@RequestMapping("/api/usuario")
public class UsuarioController {
    private final UsuarioService service;

    public UsuarioController(UsuarioService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<UsuarioDTO>> getAllUser() { // Changed return type to List<UsuarioDTO>
        try {
            return ResponseEntity.ok(service.getAllUser());
        } catch (Exception e) {
            System.err.println("Error al obtener los usuarios: " + e.getMessage());
            return ResponseEntity.status(500).body(null); // Return null or an empty list in case of error
        }
    }

    @PostMapping("/save")
    public ResponseEntity<Usuario> save(@RequestBody Usuario usuario) {
        try {
            return ResponseEntity.ok(service.save(usuario));
        } catch (Exception e) {
            System.err.println("Error al guardar el usuario: " + e.getMessage());
            throw new RuntimeException("Error al guardar el usuario: " + e.getMessage());
        }
    }

    @GetMapping("/findByDNI")
    public ResponseEntity<Usuario> findByDNI(@RequestParam("dni") Long dni) {
        return ResponseEntity.ok(service.findByDNI(dni));
    }

    @PutMapping("/modify")
    public ResponseEntity<Usuario> modify(
            @RequestBody UsuarioUpdateDTO dto
    ) {
        return ResponseEntity.ok(service.modify(dto));
    }

    @DeleteMapping("/delete")
     public ResponseEntity<String> delete(@RequestParam("dni") Long dni) {
        try {
            return ResponseEntity.ok(service.delete(dni));
        } catch (Exception e) {
            System.err.println("Error al eliminar el usuario: " + e.getMessage());
            throw new RuntimeException("Error al eliminar el usuario: " + e.getMessage());
        }
    }
}