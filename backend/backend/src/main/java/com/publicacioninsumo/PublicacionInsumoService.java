package com.publicacioninsumo;

import com.estadoinsumo.EstadoInsumoRepository;
import com.estadopublicacioninsumo.EstadoPublicacionInsumoRepository;
import com.publicacioninsumo.dto.PublicacionInsumoCreateDTO;
import com.publicacioninsumo.dto.PublicacionInsumoResponseDTO;
import com.tipoinsumo.TipoInsumoRepository;
import com.tipooperacion.TipoOperacionRepository;
import com.usuario.UsuarioRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    public PublicacionInsumoService(PublicacionInsumoRepository publicacionInsumoRepository,
                                    TipoInsumoRepository tipoInsumoRepository,
                                    EstadoInsumoRepository estadoInsumoRepository,
                                    TipoOperacionRepository tipoOperacionRepository,
                                    EstadoPublicacionInsumoRepository estadoPublicacionRepository,
                                    UsuarioRepository usuarioRepository) {
        this.publicacionInsumoRepository = publicacionInsumoRepository;
        this.tipoInsumoRepository = tipoInsumoRepository;
        this.estadoInsumoRepository = estadoInsumoRepository;
        this.tipoOperacionRepository = tipoOperacionRepository;
        this.estadoPublicacionRepository = estadoPublicacionRepository;
        this.usuarioRepository = usuarioRepository;
    }


    @Cacheable(value = "catalogoActivo")
    @Transactional(readOnly = true)
    public List<PublicacionInsumoResponseDTO> obtenerPublicacionesActivas(){
        List<PublicacionInsumo> publicacionesActivas = publicacionInsumoRepository.findByEstadoPublicacionCatalogo("ACTIVA");
        return publicacionesActivas.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

//    @CacheEvict(value = "catalogoActivo", allEntries = true)
//    @Transactional
//    public PublicacionInsumoResponseDTO crearPublicacion(PublicacionInsumoCreateDTO createDTO, String email) {
//        // Al ejecutarse este método, Spring destruye la caché automáticamente
//        // para que el próximo que pida el catálogo vea la nueva publicación.
//    }

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

        return dto;
    }
}
