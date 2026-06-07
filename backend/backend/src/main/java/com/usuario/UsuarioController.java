package com.usuario;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usuario")
public class UsuarioController {
    private final UsuarioService service;

    public UsuarioController(UsuarioService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity getAllUser() {
        try {
            return ResponseEntity.ok(service.getAllUser());
        } catch (Exception e) {
            System.err.println("Error al obtener los usuarios: " + e.getMessage());
            return ResponseEntity.status(500).body("Error al obtener los usuarios: " + e.getMessage());
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
     public ResponseEntity<Usuario> modify(@RequestBody Usuario usuario) {
        try {
            return ResponseEntity.ok(service.modify(usuario));
        } catch (Exception e) {
            System.err.println("Error al modificar el usuario: " + e.getMessage());
            throw new RuntimeException("Error al modificar el usuario: " + e.getMessage());
        }
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
