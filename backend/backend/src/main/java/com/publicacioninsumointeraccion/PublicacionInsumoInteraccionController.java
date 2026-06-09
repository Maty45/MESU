package com.publicacioninsumointeraccion;

import com.publicacioninsumointeraccion.dto.ConcretarInteraccionRequestDTO;
import com.publicacioninsumointeraccion.dto.PublicacionInsumoInteraccionResponseDTO;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.util.List;

@RestController
@RequestMapping("/api/interacciones")
public class PublicacionInsumoInteraccionController {

    private final PublicacionInsumoInterraccionService interaccionService;

    public PublicacionInsumoInteraccionController(PublicacionInsumoInterraccionService interaccionService) {
        this.interaccionService = interaccionService;
    }

    // GET: Obtener todas las interacciones de una publicación (solo para el propietario)
    @GetMapping("/publicacion/{idPublicacion}")
    public ResponseEntity<List<PublicacionInsumoInteraccionResponseDTO>> obtenerInteracciones(
            @PathVariable("idPublicacion") Long idPublicacion,
            Authentication authentication) throws AccessDeniedException {
        
        String emailUsuarioLogueado = authentication.getName();
        List<PublicacionInsumoInteraccionResponseDTO> interacciones = interaccionService.obtenerInteraccionesDePublicacion(idPublicacion, emailUsuarioLogueado);
        return ResponseEntity.ok(interacciones);
    }

    // POST: Registrar una nueva interacción de tipo CONTACTO
    @PostMapping("/publicacion/{idPublicacion}/contacto")
    public ResponseEntity<PublicacionInsumoInteraccionResponseDTO> registrarContacto(
            @PathVariable("idPublicacion") Long idPublicacion,
            Authentication authentication) {
        
        String emailUsuarioLogueado = authentication.getName();
        PublicacionInsumoInteraccionResponseDTO response = interaccionService.registrarContacto(idPublicacion, emailUsuarioLogueado);
        return ResponseEntity.ok(response);
    }

    // GET: Obtener todas las operaciones concretadas del propietario logueado
    @GetMapping("/mis-operaciones")
    public ResponseEntity<List<PublicacionInsumoInteraccionResponseDTO>> obtenerMisOperaciones(
            Authentication authentication) {
        String emailUsuarioLogueado = authentication.getName();
        List<PublicacionInsumoInteraccionResponseDTO> operaciones = interaccionService.obtenerMisOperacionesConcretadas(emailUsuarioLogueado);
        return ResponseEntity.ok(operaciones);
    }

    // GET: Obtener todos los alquileres activos del propietario logueado (warnings/alertas)
    @GetMapping("/mis-alquileres-activos")
    public ResponseEntity<List<PublicacionInsumoInteraccionResponseDTO>> obtenerMisAlquileresActivos(
            Authentication authentication) {
        String emailUsuarioLogueado = authentication.getName();
        List<PublicacionInsumoInteraccionResponseDTO> alquileres = interaccionService.obtenerMisAlquileresActivos(emailUsuarioLogueado);
        return ResponseEntity.ok(alquileres);
    }

    // POST: Concretar una interacción de tipo CONTACTO a VENTA, DONACIÓN o ALQUILER
    @PostMapping("/{idInteraccion}/concretar")
    public ResponseEntity<PublicacionInsumoInteraccionResponseDTO> concretarContacto(
            @PathVariable("idInteraccion") Long idInteraccion,
            @Valid @RequestBody ConcretarInteraccionRequestDTO requestDTO,
            Authentication authentication) throws AccessDeniedException {
        
        String emailUsuarioLogueado = authentication.getName();
        PublicacionInsumoInteraccionResponseDTO response = interaccionService.concretarContacto(idInteraccion, requestDTO, emailUsuarioLogueado);
        return ResponseEntity.ok(response);
    }
}
