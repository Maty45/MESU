package com.publicacioninsumo;

import com.exception.ResourceNotFoundException;
import com.publicacioninsumo.dto.PublicacionInsumoCreateDTO;
import com.publicacioninsumo.dto.PublicacionInsumoResponseDTO;
import com.publicacioninsumo.dto.PublicacionInsumoUpdateDTO;
import com.publicacioninsumo.dto.RegistrarDevolucionRequestDTO;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException; // Corrected import
import java.util.List;

@RestController
@RequestMapping("/api/publicaciones")
public class PublicacionInsumoController {

    private final PublicacionInsumoService publicacionService;

    public PublicacionInsumoController(PublicacionInsumoService publicacionService) {
        this.publicacionService = publicacionService;
    }

    // ==========================================
    // GET: Obtener el catálogo activo
    // ==========================================
    @GetMapping
    public ResponseEntity<List<PublicacionInsumoResponseDTO>> obtenerCatalogo() {
        List<PublicacionInsumoResponseDTO> catalogo = publicacionService.obtenerPublicacionesActivas();
        return ResponseEntity.ok(catalogo); // Retorna 200 OK
    }

    // este te trae TODAS las publicaciones, para las metricas del admin
    @GetMapping("/obtenerPublicaciones")
    public ResponseEntity<List<PublicacionInsumoResponseDTO>> obtenerPublicaciones() {
        List<PublicacionInsumoResponseDTO> publicaciones = publicacionService.obtenerPublicaciones();
        return ResponseEntity.ok(publicaciones); // Retorna 200 OK
    }

    // ==========================================
    // GET: Obtener las publicaciones del propietario autenticado
    // ==========================================
    @GetMapping("/mis-publicaciones")
    public ResponseEntity<List<PublicacionInsumoResponseDTO>> obtenerMisPublicaciones(Authentication authentication) {
        String emailUsuarioLogueado = authentication.getName();
        List<PublicacionInsumoResponseDTO> misPublicaciones = publicacionService.obtenerPublicacionesPropietario(emailUsuarioLogueado);
        return ResponseEntity.ok(misPublicaciones);
    }

    // ==========================================
    // GET: Obtener una publicación por ID
    // ==========================================
    @GetMapping("/{id}")
    public ResponseEntity<PublicacionInsumoResponseDTO> obtenerPorId(@PathVariable("id") Long id) {
        try {
            PublicacionInsumoResponseDTO publicacion = publicacionService.obtenerPorId(id);
            return ResponseEntity.ok(publicacion);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build(); // Retorna 404 Not Found
        }
    }

    // ==========================================
    // POST: Crear una nueva publicación
    // ==========================================
    @PostMapping
    public ResponseEntity<PublicacionInsumoResponseDTO> crearPublicacion(
            @Valid @RequestBody PublicacionInsumoCreateDTO createDTO,
            Authentication authentication) {

        // Extraemos el email o username del token (Ajustá según cómo configuraste tu JWT/Security)
        String emailUsuarioLogueado = authentication.getName();

        PublicacionInsumoResponseDTO nuevaPublicacion = publicacionService.crearPublicacion(createDTO, emailUsuarioLogueado);

        return new ResponseEntity<>(nuevaPublicacion, HttpStatus.CREATED); // Retorna 201 Created
    }

    // ==========================================
    // PUT: Modificar una publicación existente
    // ==========================================
    @PutMapping("/{id}")
    public ResponseEntity<PublicacionInsumoResponseDTO> modificarPublicacion(
            @PathVariable("id") Long id,
            @Valid @RequestBody PublicacionInsumoUpdateDTO updateDTO,
            Authentication authentication) {

        String emailUsuarioLogueado = authentication.getName();

        try {
            PublicacionInsumoResponseDTO modificada = publicacionService.modificarPublicacion(id, updateDTO, emailUsuarioLogueado);
            return ResponseEntity.ok(modificada); // Retorna 200 OK
        } catch (AccessDeniedException e) { // Catching java.nio.file.AccessDeniedException
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build(); // Retorna 403 Forbidden
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build(); // Retorna 404 Not Found
        }
    }

    // ==========================================
    // DELETE: Baja lógica de la publicación
    // ==========================================
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarPublicacion(@PathVariable("id") Long id, Authentication authentication) {
        String emailUsuarioLogueado = authentication.getName();

        try {
            publicacionService.eliminarPublicacion(id, emailUsuarioLogueado);
            return ResponseEntity.noContent().build(); // Retorna 204 No Content (Éxito, pero sin cuerpo en la respuesta)
        } catch (AccessDeniedException e) { // Catching java.nio.file.AccessDeniedException
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build(); // Retorna 403 Forbidden
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build(); // Retorna 404 Not Found
        }
    }

    // ==========================================
    // POST: Registrar devolución del insumo alquilado
    // ==========================================
    @PostMapping("/{id}/registrar-devolucion")
    public ResponseEntity<PublicacionInsumoResponseDTO> registrarDevolucion(
            @PathVariable("id") Long id,
            @RequestBody RegistrarDevolucionRequestDTO requestDTO,
            Authentication authentication) throws AccessDeniedException {

        String emailUsuarioLogueado = authentication.getName();
        PublicacionInsumoResponseDTO response = publicacionService.registrarDevolucion(id, requestDTO, emailUsuarioLogueado);
        return ResponseEntity.ok(response);
    }
}
    @DeleteMapping("/delete")
    public ResponseEntity<String> eliminarPublicacionAdmin(@RequestParam("id") Long id) {
        try {
            publicacionService.deleteAdmin(id);
            return ResponseEntity.ok("Publicacion eliminada"); // Retorna 204 No Content (Éxito, pero sin cuerpo en la respuesta)
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build(); // Retorna 404 Not Found
        }
    }

