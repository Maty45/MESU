package com.publicacioninsumo;

import com.condicionoperacion.CondicionOperacion;
import com.condicionoperacion.UnidadTiempo;
import com.estadoinsumo.EstadoInsumoRepository;
import com.estadopublicacioninsumo.EstadoPublicacionInsumoRepository;
import com.estadopublicacioninsumo.EstadoPublicacionInsumo;
import com.exception.ResourceNotFoundException;
import com.publicacioninsumo.dto.PublicacionInsumoCreateDTO;
import com.publicacioninsumo.dto.PublicacionInsumoResponseDTO;
import com.publicacioninsumo.dto.PublicacionInsumoUpdateDTO;
import com.publicacioninsumo.dto.RegistrarDevolucionRequestDTO;
import com.publicacioninsumoimagen.PublicacionInsumoImagen;
import com.tipoinsumo.TipoInsumoRepository;
import com.tipooperacion.TipoOperacionRepository;
import com.ubicacion.PublicacionInsumoUbicacion;
import com.usuario.UsuarioRepository;
import com.usuario.Usuario;
import com.alquilerinsumo.AlquilerInsumo;
import com.alquilerinsumo.AlquilerInsumoRepository;
import com.tipointeraccion.TipoInteraccion;
import com.tipointeraccion.TipoInteraccionRepository;
import com.publicacioninsumointeraccion.PublicacionInsumoInteraccion;
import com.publicacioninsumointeraccion.PublicacionInsumoInteraccionRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.AccessDeniedException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PublicacionInsumoService {
    private final PublicacionInsumoRepository publicacionInsumoRepository;
    private final TipoInsumoRepository tipoInsumoRepository;
    private final EstadoInsumoRepository estadoInsumoRepository;
    private final TipoOperacionRepository tipoOperacionRepository;
    private final EstadoPublicacionInsumoRepository estadoPublicacionRepository;
    private final UsuarioRepository usuarioRepository;
    private final AlquilerInsumoRepository alquilerInsumoRepository;
    private final TipoInteraccionRepository tipoInteraccionRepository;
    private final PublicacionInsumoInteraccionRepository interaccionRepository;

    public PublicacionInsumoService(PublicacionInsumoRepository publicacionInsumoRepository,
                                    TipoInsumoRepository tipoInsumoRepository,
                                    EstadoInsumoRepository estadoInsumoRepository,
                                    TipoOperacionRepository tipoOperacionRepository,
                                    EstadoPublicacionInsumoRepository estadoPublicacionRepository,
                                    UsuarioRepository usuarioRepository,
                                    AlquilerInsumoRepository alquilerInsumoRepository,
                                    TipoInteraccionRepository tipoInteraccionRepository,
                                    PublicacionInsumoInteraccionRepository interaccionRepository) {
        this.publicacionInsumoRepository = publicacionInsumoRepository;
        this.tipoInsumoRepository = tipoInsumoRepository;
        this.estadoInsumoRepository = estadoInsumoRepository;
        this.tipoOperacionRepository = tipoOperacionRepository;
        this.estadoPublicacionRepository = estadoPublicacionRepository;
        this.usuarioRepository = usuarioRepository;
        this.alquilerInsumoRepository = alquilerInsumoRepository;
        this.tipoInteraccionRepository = tipoInteraccionRepository;
        this.interaccionRepository = interaccionRepository;
    }

    //Obtener todas las publicaciones activas
    @Cacheable(value = "catalogoActivo")
    @Transactional(readOnly = true)
    public List<PublicacionInsumoResponseDTO> obtenerPublicacionesActivas(){
        List<PublicacionInsumo> publicacionesActivas = publicacionInsumoRepository.findByEstadoPublicacionCatalogo("ACTIVA");
        return publicacionesActivas.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    //Obtener una publicación por ID
    @Transactional(readOnly = true)
    public PublicacionInsumoResponseDTO obtenerPorId(Long id) {
        PublicacionInsumo publicacion = publicacionInsumoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontró la publicación con ID: " + id));
        return convertToDTO(publicacion);
    }
    //Guardar una publicación
    @CacheEvict(value = "catalogoActivo", allEntries = true)
    @Transactional
    public PublicacionInsumoResponseDTO crearPublicacion(PublicacionInsumoCreateDTO createDTO, String email) {

        // ==================================================================
        // 1. VALIDACIÓN DE IDENTIDAD Y EXISTENCIA DE LAS CLASES RELACIONADAS
        // ==================================================================

        // Buscamos el tipo de operación primero, ya que define las reglas de los montos
        var tipoOperacion = tipoOperacionRepository.findById(createDTO.getIdTipoOperacion())
                .orElseThrow(() -> new IllegalArgumentException("Error: El tipo de operación con ID " + createDTO.getIdTipoOperacion() + " no existe."));

        // Buscamos el tipo de insumo
        var tipoInsumo = tipoInsumoRepository.findById(createDTO.getIdTipoInsumo())
                .orElseThrow(() -> new IllegalArgumentException("Error: El tipo de insumo con ID " + createDTO.getIdTipoInsumo() + " no existe."));

        // Buscamos el estado físico del insumo
        var estadoInsumo = estadoInsumoRepository.findById(createDTO.getIdEstadoInsumo())
                .orElseThrow(() -> new IllegalArgumentException("Error: El estado del insumo con ID " + createDTO.getIdEstadoInsumo() + " no existe."));

        // Buscamos el estado base de la publicación (ACTIVA)
        var estadoPublicacion = estadoPublicacionRepository.findByNombreEPI("ACTIVA")
                .orElseThrow(() -> new IllegalStateException("Error Crítico: El estado de publicación 'ACTIVA' no está inicializado en el sistema."));

        // Buscamos al usuario propietario mediante el email del token seguro
        var usuarioPropietario = usuarioRepository.findByEmailUsuario(email)
                .orElseThrow(() -> new IllegalArgumentException("Error: El usuario autenticado (" + email + ") no fue encontrado en la base de datos."));


        // ==========================================
        // 2. VALIDACIÓN DE REGLAS DE NEGOCIO CRUZADAS
        // ==========================================
        String nombreOperacion = tipoOperacion.getNombreTipoOperacion().toUpperCase();
        validarReglasDeMontoYTiempo(nombreOperacion, createDTO.getMonto(), createDTO.getUnidadTiempo());


        // ==========================================
        // 3. CONSTRUCCIÓN DE LA ENTIDAD CORE
        // ==========================================
        PublicacionInsumo publicacion = new PublicacionInsumo();
        publicacion.setTituloPI(createDTO.getTitulo().trim());
        publicacion.setDescripcionPI(createDTO.getDescripcion().trim());
        publicacion.setFechaCreacionPI(LocalDate.now());
        publicacion.setFechaUltimaActualizacionPI(LocalDateTime.now());


        // Seteamos las relaciones maestras validadas
        publicacion.setTipoInsumo(tipoInsumo);
        publicacion.setEstadoInsumo(estadoInsumo);
        publicacion.setEstadoPublicacionInsumo(estadoPublicacion);
        publicacion.setUsuarioPropietario(usuarioPropietario);


        // ==========================================
        // 4. CONSTRUCCIÓN DE LA CONDICIÓN DE OPERACIÓN
        // ==========================================
        CondicionOperacion condicionOperacion = new CondicionOperacion();
        condicionOperacion.setTipoOperacion(tipoOperacion);
        switch (nombreOperacion){
            case "DONACION":
                condicionOperacion.setMontoCondicionOperacion(null);
                condicionOperacion.setUnidadTiempoCO(null);
                break;
            case "VENTA":
                condicionOperacion.setMontoCondicionOperacion(createDTO.getMonto());
                condicionOperacion.setUnidadTiempoCO(null);
                break;
            case "ALQUILER":
                condicionOperacion.setMontoCondicionOperacion(createDTO.getMonto());
                condicionOperacion.setUnidadTiempoCO(UnidadTiempo.valueOf(createDTO.getUnidadTiempo()));
                break;
        }
        publicacion.setCondicionOperacion(condicionOperacion);


        // ==========================================
        // 5. ASOCIACIÓN DE IMÁGENES (CLOUDINARY)
        // ==========================================
        if (createDTO.getUrlsImagenes() != null && !createDTO.getUrlsImagenes().isEmpty()) {
            java.util.concurrent.atomic.AtomicInteger index = new java.util.concurrent.atomic.AtomicInteger(1);
            List<PublicacionInsumoImagen> imagenesJPA = createDTO.getUrlsImagenes().stream()
                    .filter(url -> url != null && !url.trim().isEmpty()) // Limpiamos strings vacíos accidentales
                    .map(url -> {
                        PublicacionInsumoImagen img = new PublicacionInsumoImagen();
                        img.setUrlpathPublicacionInsumoImagen(url.trim());
                        img.setNroPublicacionInsumoImagen(index.getAndIncrement());
                        img.setPublicacionInsumo(publicacion); // Crucial para que JPA maneje la FK en cascada
                        return img;
                    }).collect(Collectors.toList());

            publicacion.setPublicacionInsumoImagenes(imagenesJPA);
        }


        //===========================================
        // 6. ASOCIACION CON LA UBICACIÓN
        //===========================================
        var ubicacion = new PublicacionInsumoUbicacion();
        ubicacion.setDireccionUbicacion(createDTO.getDireccion());
        ubicacion.setPublicacionInsumo(publicacion);
        ubicacion.setLatitudUbicacion(createDTO.getLatitud());
        ubicacion.setLongitudUbicacion(createDTO.getLongitud());
        publicacion.setPublicacionInsumoUbicacion(ubicacion);


        // ==========================================
        // 7. PERSISTENCIA Y RESPUESTA
        // ==========================================
        try {
            PublicacionInsumo guardada = publicacionInsumoRepository.save(publicacion);
            return convertToDTO(guardada);
        } catch (Exception e) {
            // Atrapamos fallos inesperados de la DB (ej: violación de constraints no controladas)
            throw new RuntimeException("Error al persistir la publicación en la base de datos: " + e.getMessage(), e);
        }
    }


    //Modificar una publicación
    @CacheEvict(value = "catalogoActivo", allEntries = true)
    @Transactional
    public PublicacionInsumoResponseDTO modificarPublicacion(Long id, PublicacionInsumoUpdateDTO updateDTO, String emailUsuarioLogueado) throws AccessDeniedException {
        PublicacionInsumo publicacion = publicacionInsumoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontró la publicación con ID: " + id));

        if (!publicacion.getUsuarioPropietario().getEmailUsuario().equals(emailUsuarioLogueado)) {
            throw new AccessDeniedException("No tienes permiso para modificar esta publicación");
        }

        //Setear los datos básicos modificados
        publicacion.setTituloPI(updateDTO.getTitulo());
        publicacion.setDescripcionPI(updateDTO.getDescripcion());
        publicacion.setFechaUltimaActualizacionPI(LocalDateTime.now());

        //Cambiar el estado del insumo
        publicacion.setEstadoInsumo(estadoInsumoRepository.findById(updateDTO.getIdEstadoInsumo())
                .orElseThrow(() -> new ResourceNotFoundException("Estado del Insumo no encontrado")));

        //Obtener la condición de operación de la publicación
        CondicionOperacion condicion = publicacion.getCondicionOperacion();

        //Buscamos el nuevo tipo de operación
        var tipoOperacion = tipoOperacionRepository.findById(updateDTO.getIdTipoOperacion())
                .orElseThrow(() -> new IllegalArgumentException("Error: El tipo de operación con ID " + updateDTO.getIdTipoOperacion() + " no existe."));
        var nombreTipoOperacion = tipoOperacion.getNombreTipoOperacion().toUpperCase();

        condicion.setTipoOperacion(tipoOperacion);

        //Validamos la consistencia de las modificaciones y luego modificamos la instancia de CondicicionOperacion existente
        validarReglasDeMontoYTiempo(nombreTipoOperacion, updateDTO.getMonto(), updateDTO.getUnidadTiempo());
        switch (nombreTipoOperacion) {
            case "DONACION":
                condicion.setMontoCondicionOperacion(null);
                condicion.setUnidadTiempoCO(null);
                break;

            case "VENTA":
                condicion.setMontoCondicionOperacion(updateDTO.getMonto());
                condicion.setUnidadTiempoCO(null);
                break;

            case "ALQUILER":
                condicion.setMontoCondicionOperacion(updateDTO.getMonto());
                // Conversión segura al Enum correspondiente
                condicion.setUnidadTiempoCO(UnidadTiempo.valueOf(updateDTO.getUnidadTiempo().toUpperCase()));
                break;

            default:
                throw new IllegalArgumentException("Tipo de operación no válido: " + tipoOperacion);
        }

        // Modificación de Imágenes (Pisamos las viejas con las nuevas de Cloudinary)
        if (updateDTO.getUrlsImagenes() != null) {
            publicacion.getPublicacionInsumoImagenes().clear(); // Borramos los registros viejos
            publicacionInsumoRepository.saveAndFlush(publicacion); // Forzamos a Hibernate a ejecutar el DELETE primero para evitar violaciones de constraint únicos de URL

            java.util.concurrent.atomic.AtomicInteger index = new java.util.concurrent.atomic.AtomicInteger(1);
            List<PublicacionInsumoImagen> nuevasImagenes = updateDTO.getUrlsImagenes().stream()
                    .filter(url -> url != null && !url.trim().isEmpty())
                    .map(url -> {
                        PublicacionInsumoImagen img = new PublicacionInsumoImagen();
                        img.setUrlpathPublicacionInsumoImagen(url.trim());
                        img.setNroPublicacionInsumoImagen(index.getAndIncrement());
                        img.setPublicacionInsumo(publicacion); // FK en cascada
                        return img;
                    }).collect(Collectors.toList());
            publicacion.getPublicacionInsumoImagenes().addAll(nuevasImagenes);
        }

        //Guardar los cambios
        PublicacionInsumo publicacionActualizada = publicacionInsumoRepository.save(publicacion);

        //Retornar el DTO de respuesta mapeado de forma limpia
        return convertToDTO(publicacionActualizada);
    }


    // Baja Lógica de una publicación
    @CacheEvict(value = "catalogoActivo", allEntries = true) // Limpiamos la caché para que desaparezca del frontend
    @Transactional
    public void eliminarPublicacion(Long id, String emailUsuarioLogueado) throws AccessDeniedException {
        PublicacionInsumo publicacion = publicacionInsumoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontró la publicación con ID: " + id));

        if (!publicacion.getUsuarioPropietario().getEmailUsuario().equals(emailUsuarioLogueado)) {
            throw new AccessDeniedException("No tienes permiso para modificar esta publicación");
        }
        // Buscamos el estado de "baja" o "inactiva"
        var estadoBaja = estadoPublicacionRepository.findByNombreEPI("ELIMINADA")
                .orElseThrow(() -> new IllegalStateException("Estado 'ELIMINADA' no encontrado."));

        publicacion.setEstadoPublicacionInsumo(estadoBaja);
        publicacion.setFechaUltimaActualizacionPI(LocalDateTime.now());
        publicacionInsumoRepository.save(publicacion);
    }

    // Obtener todas las publicaciones de un propietario
    @Transactional(readOnly = true)
    public List<PublicacionInsumoResponseDTO> obtenerPublicacionesPropietario(String email) {
        List<PublicacionInsumo> publicaciones = publicacionInsumoRepository.findByUsuarioPropietarioEmailUsuario(email);
        return publicaciones.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Registrar devolución de un insumo alquilado
    @CacheEvict(value = "catalogoActivo", allEntries = true)
    @Transactional
    public PublicacionInsumoResponseDTO registrarDevolucion(Long id, RegistrarDevolucionRequestDTO requestDTO, String emailUsuarioLogueado) throws AccessDeniedException {
        PublicacionInsumo publicacion = publicacionInsumoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontró la publicación con ID: " + id));

        if (!publicacion.getUsuarioPropietario().getEmailUsuario().equals(emailUsuarioLogueado)) {
            throw new AccessDeniedException("No tienes permiso para modificar esta publicación");
        }

        // Validar que el estado actual sea ALQUILADA
        if (!publicacion.getEstadoPublicacionInsumo().getNombreEPI().equalsIgnoreCase("ALQUILADA")) {
            throw new IllegalArgumentException("Regla de Negocio: Solo se puede registrar la devolución de una publicación que esté ALQUILADA.");
        }

        // Buscar el alquiler activo
        AlquilerInsumo alquiler = alquilerInsumoRepository.findActiveRentalByPublicacionId(id)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontró ningún alquiler activo para la publicación con ID: " + id));

        // Registrar la fecha de devolución real
        LocalDate fechaDevolucion = requestDTO.getFechaDevolucion() != null ? requestDTO.getFechaDevolucion() : LocalDate.now();
        if (fechaDevolucion.isBefore(alquiler.getFechaDesdeAI())) {
            throw new IllegalArgumentException("Regla de Negocio: La fecha de devolución no puede ser anterior a la fecha de inicio del alquiler.");
        }
        alquiler.setFechaHastaRealAI(fechaDevolucion);
        alquilerInsumoRepository.save(alquiler);

        // Cambiar estado a ACTIVA
        EstadoPublicacionInsumo estadoActiva = estadoPublicacionRepository.findByNombreEPI("ACTIVA")
                .orElseThrow(() -> new IllegalStateException("Estado 'ACTIVA' no inicializado en el sistema."));
        publicacion.setEstadoPublicacionInsumo(estadoActiva);
        publicacion.setFechaUltimaActualizacionPI(LocalDateTime.now());

        // Buscar el tipo de interacción DEVOLUCION
        TipoInteraccion tipoDevolucion = tipoInteraccionRepository.findByNombreTipoInteraccion("DEVOLUCION")
                .orElseThrow(() -> new ResourceNotFoundException("Tipo de interacción 'DEVOLUCION' no encontrado en el sistema."));

        // Registrar la interacción de tipo DEVOLUCION para mantener el historial
        PublicacionInsumoInteraccion interaccionDevolucion = new PublicacionInsumoInteraccion();
        interaccionDevolucion.setFechaHPII(LocalDateTime.now());
        interaccionDevolucion.setPublicacionInsumo(publicacion);
        interaccionDevolucion.setTipoInteraccion(tipoDevolucion);
        
        // El cliente de la devolución es el mismo que alquiló
        List<PublicacionInsumoInteraccion> interaccionesAlquiler = interaccionRepository.findByPublicacionInsumoId(id);
        Usuario cliente = interaccionesAlquiler.stream()
                .filter(pii -> pii.getAlquilerInsumo() != null && pii.getAlquilerInsumo().getIdAlquiler().equals(alquiler.getIdAlquiler()))
                .map(PublicacionInsumoInteraccion::getUsuarioCliente)
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("Error de consistencia: No se encontró la interacción de alquiler asociada."));

        interaccionDevolucion.setUsuarioCliente(cliente);
        interaccionDevolucion.setAlquilerInsumo(alquiler);
        interaccionRepository.save(interaccionDevolucion);

        PublicacionInsumo guardada = publicacionInsumoRepository.save(publicacion);
        return convertToDTO(guardada);
    }

    //Valida que, según el tipo de operación, la instancia de CondicionOperacion se cree correctamente
    private void validarReglasDeMontoYTiempo(String tipoOperacion, Integer monto, String unidadTiempo) {
        switch (tipoOperacion) {
            case "ALQUILER":
                if (monto == null || monto <= 0) {
                    throw new IllegalArgumentException("Regla de Negocio: Las publicaciones de ALQUILER exigen un monto mayor a cero.");
                }
                if (unidadTiempo == null || unidadTiempo.trim().isEmpty()) {
                    throw new IllegalArgumentException("Regla de Negocio: Las publicaciones de ALQUILER exigen definir una unidad de tiempo válida (DIA, SEMANA, MES).");
                }
                break;

            case "VENTA":
                if (monto == null || monto <= 0) {
                    throw new IllegalArgumentException("Regla de Negocio: Las publicaciones de VENTA exigen un monto mayor a cero.");
                }
                if (unidadTiempo != null) {
                    throw new IllegalArgumentException("Regla de Negocio: Las publicaciones de VENTA no pueden registrar una unidad de tiempo periódica.");
                }
                break;

            case "DONACION":
                if (monto != null && monto != 0) {
                    throw new IllegalArgumentException("Regla de Negocio: Una publicación de DONACIÓN no puede asociar un monto económico.");
                }
                if (unidadTiempo != null) {
                    throw new IllegalArgumentException("Regla de Negocio: Una publicación de DONACIÓN no puede asociar plazos de tiempo.");
                }
                break;

            default:
                throw new IllegalArgumentException("Regla de Negocio: El tipo de operación '" + tipoOperacion + "' no está soportado por las reglas de MESU.");
        }
    }


    //Convertir una publicación a DTO
    private PublicacionInsumoResponseDTO convertToDTO(PublicacionInsumo publicacion){
        PublicacionInsumoResponseDTO dto = new PublicacionInsumoResponseDTO();
        //Datos de la publicación
        dto.setId(publicacion.getIdPI());
        dto.setDescripcion(publicacion.getDescripcionPI());
        dto.setFecha(publicacion.getFechaCreacionPI());
        dto.setTitulo(publicacion.getTituloPI());

        //Condiciones según el tipo de operación
        if(publicacion.getCondicionOperacion() != null && publicacion.getCondicionOperacion().getTipoOperacion() != null){
            var nombreTipoOperacion = publicacion.getCondicionOperacion().getTipoOperacion().getNombreTipoOperacion();
            dto.setNombreTipoOperacion(nombreTipoOperacion);

            if("DONACION".equals(nombreTipoOperacion)){
                dto.setMonto(null);
                dto.setUnidadTiempo(null);
            } else if ("VENTA".equals(nombreTipoOperacion)){
                dto.setMonto(publicacion.getCondicionOperacion().getMontoCondicionOperacion());
                dto.setUnidadTiempo(null);
            } else {
                dto.setMonto(publicacion.getCondicionOperacion().getMontoCondicionOperacion());
                dto.setUnidadTiempo(publicacion.getCondicionOperacion().getUnidadTiempoCO().toString());
            }
        }

        //Mapeo de los nombres de las relaciones
        if(publicacion.getEstadoPublicacionInsumo() != null){
            dto.setNombreEstadoPublicacion(publicacion.getEstadoPublicacionInsumo().getNombreEPI());
        }

        if(publicacion.getEstadoInsumo() != null){
            dto.setNombreEstadoInsumo(publicacion.getEstadoInsumo().getNombreEstadoInsumo());
        }

        if(publicacion.getTipoInsumo() != null){
            dto.setNombreTipoInsumo(publicacion.getTipoInsumo().getNombreTipoInsumo());
        }

        if(publicacion.getUsuarioPropietario() != null){
            dto.setNombreUsuario(publicacion.getUsuarioPropietario().getNombreUsuario());
            dto.setApellidoUsuario(publicacion.getUsuarioPropietario().getApellidoUsuario());
        }

        // Transformación de la lista de entidades de imagen a una lista simple de URLs de Cloudinary
        if (publicacion.getPublicacionInsumoImagenes() != null) {
            dto.setUrlsImagenes(publicacion.getPublicacionInsumoImagenes().stream()
                    .map(img -> img.getUrlpathPublicacionInsumoImagen())
                    .collect(Collectors.toList()));
        }

        // Mapeo de la ubicación
        if (publicacion.getPublicacionInsumoUbicacion() != null) {
            dto.setDireccion(publicacion.getPublicacionInsumoUbicacion().getDireccionUbicacion());
            dto.setLongitud(publicacion.getPublicacionInsumoUbicacion().getLongitudUbicacion());
            dto.setLatitud(publicacion.getPublicacionInsumoUbicacion().getLatitudUbicacion());
        }

        return dto;
    }
}
