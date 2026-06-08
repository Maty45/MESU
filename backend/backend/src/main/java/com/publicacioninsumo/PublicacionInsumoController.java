package com.publicacioninsumo;

import com.publicacioninsumo.dto.PublicacionInsumoCreateDTO;
import com.publicacioninsumo.dto.PublicacionInsumoResponseDTO;
import com.publicacioninsumo.dto.PublicacionInsumoUpdateDTO;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
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

    // ==========================================
    // GET: Obtener una publicación por ID
    // ==========================================
    @GetMapping("/{id}")
    public ResponseEntity<PublicacionInsumoResponseDTO> obtenerPorId(@PathVariable("id") Long id) {
        PublicacionInsumoResponseDTO publicacion = publicacionService.obtenerPorId(id);
        return ResponseEntity.ok(publicacion);
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
            Authentication authentication) throws AccessDeniedException {

        String emailUsuarioLogueado = authentication.getName();

        PublicacionInsumoResponseDTO modificada = publicacionService.modificarPublicacion(id, updateDTO, emailUsuarioLogueado);

        return ResponseEntity.ok(modificada); // Retorna 200 OK
    }

    // ==========================================
    // DELETE: Baja lógica de la publicación
    // ==========================================
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarPublicacion(@PathVariable("id") Long id, Authentication authentication) throws AccessDeniedException {
        String emailUsuarioLogueado = authentication.getName();

        publicacionService.eliminarPublicacion(id, emailUsuarioLogueado);

        return ResponseEntity.noContent().build(); // Retorna 204 No Content (Éxito, pero sin cuerpo en la respuesta)
    }
}
