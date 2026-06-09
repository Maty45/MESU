package com.publicacioninsumointeraccion;

import com.alquilerinsumo.AlquilerInsumo;
import com.alquilerinsumo.AlquilerInsumoRepository;
import com.estadopublicacioninsumo.EstadoPublicacionInsumo;
import com.estadopublicacioninsumo.EstadoPublicacionInsumoRepository;
import com.exception.ResourceNotFoundException;
import com.publicacioninsumo.PublicacionInsumo;
import com.publicacioninsumo.PublicacionInsumoRepository;
import com.publicacioninsumointeraccion.dto.ConcretarInteraccionRequestDTO;
import com.publicacioninsumointeraccion.dto.PublicacionInsumoInteraccionResponseDTO;
import com.tipointeraccion.TipoInteraccion;
import com.tipointeraccion.TipoInteraccionRepository;
import com.usuario.Usuario;
import com.usuario.UsuarioRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.AccessDeniedException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PublicacionInsumoInterraccionService {

    private final PublicacionInsumoInteraccionRepository interaccionRepository;
    private final PublicacionInsumoRepository publicacionInsumoRepository;
    private final AlquilerInsumoRepository alquilerInsumoRepository;
    private final TipoInteraccionRepository tipoInteraccionRepository;
    private final EstadoPublicacionInsumoRepository estadoPublicacionRepository;
    private final UsuarioRepository usuarioRepository;

    public PublicacionInsumoInterraccionService(
            PublicacionInsumoInteraccionRepository interaccionRepository,
            PublicacionInsumoRepository publicacionInsumoRepository,
            AlquilerInsumoRepository alquilerInsumoRepository,
            TipoInteraccionRepository tipoInteraccionRepository,
            EstadoPublicacionInsumoRepository estadoPublicacionRepository,
            UsuarioRepository usuarioRepository) {
        this.interaccionRepository = interaccionRepository;
        this.publicacionInsumoRepository = publicacionInsumoRepository;
        this.alquilerInsumoRepository = alquilerInsumoRepository;
        this.tipoInteraccionRepository = tipoInteraccionRepository;
        this.estadoPublicacionRepository = estadoPublicacionRepository;
        this.usuarioRepository = usuarioRepository;
    }

    // Obtener todas las interacciones de una publicación seleccionada (validando propiedad)
    @Transactional(readOnly = true)
    public List<PublicacionInsumoInteraccionResponseDTO> obtenerInteraccionesDePublicacion(Long idPublicacion, String emailUsuarioLogueado) throws AccessDeniedException {
        PublicacionInsumo publicacion = publicacionInsumoRepository.findById(idPublicacion)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontró la publicación con ID: " + idPublicacion));

        if (!publicacion.getUsuarioPropietario().getEmailUsuario().equals(emailUsuarioLogueado)) {
            throw new AccessDeniedException("No tienes permiso para ver las interacciones de esta publicación");
        }

        List<PublicacionInsumoInteraccion> interacciones = interaccionRepository.findByPublicacionInsumoId(idPublicacion);
        return interacciones.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Concretar un contacto (tipo CONTACTO) creando una NUEVA interacción (VENTA, DONACION o ALQUILER) con el mismo cliente
    @CacheEvict(value = "catalogoActivo", allEntries = true)
    @Transactional
    public PublicacionInsumoInteraccionResponseDTO concretarContacto(Long idInteraccion, ConcretarInteraccionRequestDTO requestDTO, String emailUsuarioLogueado) throws AccessDeniedException {
        PublicacionInsumoInteraccion contactoOriginal = interaccionRepository.findById(idInteraccion)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontró la interacción con ID: " + idInteraccion));

        PublicacionInsumo publicacion = contactoOriginal.getPublicacionInsumo();
        if (!publicacion.getUsuarioPropietario().getEmailUsuario().equals(emailUsuarioLogueado)) {
            throw new AccessDeniedException("No tienes permiso para modificar esta interacción");
        }

        // Validar que sea de tipo CONTACTO
        if (!contactoOriginal.getTipoInteraccion().getNombreTipoInteraccion().equalsIgnoreCase("CONTACTO")) {
            throw new IllegalArgumentException("Regla de Negocio: Solo se pueden concretar interacciones que estén en estado CONTACTO.");
        }

        // Validar consistencia con el tipo de operación de la publicación
        String operacionPublicacion = publicacion.getCondicionOperacion().getTipoOperacion().getNombreTipoOperacion().toUpperCase();
        String concrecionSolicitada = requestDTO.getTipoInteraccionConcretada().toUpperCase();

        if (!operacionPublicacion.equals(concrecionSolicitada)) {
            throw new IllegalArgumentException("Regla de Negocio: El tipo de concreción (" + concrecionSolicitada + 
                    ") debe coincidir con el tipo de operación de la publicación (" + operacionPublicacion + ").");
        }

        // Buscar el nuevo tipo de interacción
        TipoInteraccion nuevoTipo = tipoInteraccionRepository.findByNombreTipoInteraccion(concrecionSolicitada)
                .orElseThrow(() -> new ResourceNotFoundException("Tipo de interacción '" + concrecionSolicitada + "' no encontrado en el sistema."));

        // Crear NUEVA interacción de concreción con el mismo cliente del contacto
        PublicacionInsumoInteraccion nuevaInteraccion = new PublicacionInsumoInteraccion();
        nuevaInteraccion.setFechaHPII(LocalDateTime.now());
        nuevaInteraccion.setPublicacionInsumo(publicacion);
        nuevaInteraccion.setUsuarioCliente(contactoOriginal.getUsuarioCliente());
        nuevaInteraccion.setTipoInteraccion(nuevoTipo);

        // Procesar según el tipo
        if (concrecionSolicitada.equals("ALQUILER")) {
            // Validaciones de alquiler
            if (requestDTO.getFechaDesde() == null || requestDTO.getFechaHastaAcordada() == null || requestDTO.getMontoAcordado() == null) {
                throw new IllegalArgumentException("Regla de Negocio: Para registrar un ALQUILER deben completarse las fechas acordadas y el monto.");
            }
            if (requestDTO.getMontoAcordado() <= 0) {
                throw new IllegalArgumentException("Regla de Negocio: El monto acordado del alquiler debe ser mayor a cero.");
            }
            if (requestDTO.getFechaHastaAcordada().isBefore(requestDTO.getFechaDesde())) {
                throw new IllegalArgumentException("Regla de Negocio: La fecha hasta acordada no puede ser anterior a la fecha desde.");
            }

            // Crear instancia de alquiler
            AlquilerInsumo alquiler = new AlquilerInsumo();
            alquiler.setFechaDesdeAI(requestDTO.getFechaDesde());
            alquiler.setFechaHastaAcordadaAI(requestDTO.getFechaHastaAcordada());
            alquiler.setMontoAcordadoAI(requestDTO.getMontoAcordado());
            alquiler.setPublicacionInsumo(publicacion);
            
            AlquilerInsumo guardado = alquilerInsumoRepository.save(alquiler);
            nuevaInteraccion.setAlquilerInsumo(guardado);

            // Cambiar publicación a ALQUILADA
            EstadoPublicacionInsumo estadoAlquilada = estadoPublicacionRepository.findByNombreEPI("ALQUILADA")
                    .orElseThrow(() -> new IllegalStateException("Estado 'ALQUILADA' no inicializado en el sistema."));
            publicacion.setEstadoPublicacionInsumo(estadoAlquilada);

        } else if (concrecionSolicitada.equals("VENTA") || concrecionSolicitada.equals("DONACION")) {
            // Cambiar publicación a FINALIZADA
            EstadoPublicacionInsumo estadoFinalizada = estadoPublicacionRepository.findByNombreEPI("FINALIZADA")
                    .orElseThrow(() -> new IllegalStateException("Estado 'FINALIZADA' no inicializado en el sistema."));
            publicacion.setEstadoPublicacionInsumo(estadoFinalizada);
        }

        // Actualizar la fecha de última actualización de la publicación
        publicacion.setFechaUltimaActualizacionPI(LocalDateTime.now());
        publicacionInsumoRepository.save(publicacion);

        PublicacionInsumoInteraccion guardada = interaccionRepository.save(nuevaInteraccion);
        return convertToDTO(guardada);
    }

    // Registrar una interacción de tipo CONTACTO
    @Transactional
    public PublicacionInsumoInteraccionResponseDTO registrarContacto(Long idPublicacion, String emailUsuarioLogueado) {
        PublicacionInsumo publicacion = publicacionInsumoRepository.findById(idPublicacion)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontró la publicación con ID: " + idPublicacion));

        Usuario cliente = usuarioRepository.findByEmailUsuario(emailUsuarioLogueado)
                .orElseThrow(() -> new IllegalArgumentException("No se encontró al usuario cliente con email: " + emailUsuarioLogueado));

        TipoInteraccion tipoContacto = tipoInteraccionRepository.findByNombreTipoInteraccion("CONTACTO")
                .orElseThrow(() -> new ResourceNotFoundException("Tipo de interacción 'CONTACTO' no encontrado en el sistema."));

        PublicacionInsumoInteraccion interaccion = new PublicacionInsumoInteraccion();
        interaccion.setFechaHPII(LocalDateTime.now());
        interaccion.setPublicacionInsumo(publicacion);
        interaccion.setUsuarioCliente(cliente);
        interaccion.setTipoInteraccion(tipoContacto);

        PublicacionInsumoInteraccion guardada = interaccionRepository.save(interaccion);
        return convertToDTO(guardada);
    }

    @Transactional(readOnly = true)
    public List<PublicacionInsumoInteraccionResponseDTO> obtenerMisOperacionesConcretadas(String emailUsuarioLogueado) {
        List<PublicacionInsumoInteraccion> interacciones = interaccionRepository.findConcretedOperationsByOwnerEmail(emailUsuarioLogueado);
        return interacciones.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PublicacionInsumoInteraccionResponseDTO> obtenerMisAlquileresActivos(String emailUsuarioLogueado) {
        List<PublicacionInsumoInteraccion> interacciones = interaccionRepository.findActiveRentalsByOwnerEmail(emailUsuarioLogueado);
        return interacciones.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private PublicacionInsumoInteraccionResponseDTO convertToDTO(PublicacionInsumoInteraccion interaccion) {
        PublicacionInsumoInteraccionResponseDTO dto = new PublicacionInsumoInteraccionResponseDTO();
        dto.setIdPII(interaccion.getIdPII());
        dto.setFechaHPII(interaccion.getFechaHPII());
        
        if (interaccion.getTipoInteraccion() != null) {
            dto.setNombreTipoInteraccion(interaccion.getTipoInteraccion().getNombreTipoInteraccion());
        }
        
        if (interaccion.getUsuarioCliente() != null) {
            dto.setIdUsuarioCliente(interaccion.getUsuarioCliente().getIdUsuario());
            dto.setNombreUsuarioCliente(interaccion.getUsuarioCliente().getNombreUsuario());
            dto.setApellidoUsuarioCliente(interaccion.getUsuarioCliente().getApellidoUsuario());
            dto.setEmailUsuarioCliente(interaccion.getUsuarioCliente().getEmailUsuario());
            dto.setTelefonoUsuarioCliente(interaccion.getUsuarioCliente().getTelefonoUsuario());
        }
        
        if (interaccion.getAlquilerInsumo() != null) {
            dto.setIdAlquiler(interaccion.getAlquilerInsumo().getIdAlquiler());
            dto.setFechaDesdeAI(interaccion.getAlquilerInsumo().getFechaDesdeAI());
            dto.setFechaHastaAcordadaAI(interaccion.getAlquilerInsumo().getFechaHastaAcordadaAI());
            dto.setFechaHastaRealAI(interaccion.getAlquilerInsumo().getFechaHastaRealAI());
            dto.setMontoAcordadoAI(interaccion.getAlquilerInsumo().getMontoAcordadoAI());
        }

        if (interaccion.getPublicacionInsumo() != null) {
            dto.setIdPublicacion(interaccion.getPublicacionInsumo().getIdPI());
            dto.setTituloPublicacion(interaccion.getPublicacionInsumo().getTituloPI());
            
            String tipo = interaccion.getTipoInteraccion() != null ? interaccion.getTipoInteraccion().getNombreTipoInteraccion().toUpperCase() : "";
            if (tipo.equals("ALQUILER") && interaccion.getAlquilerInsumo() != null) {
                dto.setMontoOperacion(interaccion.getAlquilerInsumo().getMontoAcordadoAI());
            } else if (tipo.equals("VENTA") && interaccion.getPublicacionInsumo().getCondicionOperacion() != null) {
                dto.setMontoOperacion(interaccion.getPublicacionInsumo().getCondicionOperacion().getMontoCondicionOperacion());
            } else {
                dto.setMontoOperacion(0);
            }
        }
        
        return dto;
    }
}
