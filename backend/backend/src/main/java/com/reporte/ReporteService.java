package com.reporte;

import com.reporte.dto.ReporteDTO;
import com.reporte.dto.UsuarioReporteDTO;
import com.reporte.dto.PublicacionReportadaDTO;
import com.dto.ReportePublicacionRequest;
import com.dto.ReporteUsuarioRequest;
import com.publicacioninsumo.PublicacionInsumo;
import com.publicacioninsumo.PublicacionInsumoRepository;
import com.usuario.Usuario;
import com.usuario.UsuarioRepository;
import com.usuariorol.UsuarioRolRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReporteService {

    private final ReporteRepository reporteRepository;
    private final UsuarioRepository usuarioRepository;
    private final PublicacionInsumoRepository publicacionInsumoRepository;
    private final UsuarioRolRepository usuarioRolRepository;

    public void crearReportePublicacion(
            String emailUsuario,
            ReportePublicacionRequest request
    ) {

        Usuario reportante = usuarioRepository
                .findByEmailUsuario(emailUsuario)
                .orElseThrow();

        PublicacionInsumo publicacion = publicacionInsumoRepository
                .findById(request.idPublicacion())
                .orElseThrow();

        Reporte reporte = new Reporte();

        reporte.setFechaHoraReporte(LocalDate.now());
        reporte.setTipoReporte(request.tipoReporte());
        reporte.setDetalleReporte(request.detalleReporte());

        reporte.setUsuarioReportante(reportante);
        reporte.setUsuarioReportado(
                publicacion.getUsuarioPropietario()
        );
        reporte.setPublicacionInsumoReportada(publicacion);

        reporteRepository.save(reporte);
    }

    public void crearReporteUsuario(
            String emailUsuario,
            ReporteUsuarioRequest request
    ) {

        Usuario reportante = usuarioRepository
                .findByEmailUsuario(emailUsuario)
                .orElseThrow();

        boolean esPropietario =
                usuarioRolRepository.existsByUsuarioAndRol_NombreRol(
                        reportante,
                        "PROPIETARIO"
                );

        if (!esPropietario) {
            throw new RuntimeException(
                    "Solo los propietarios pueden reportar usuarios"
            );
        }

        Usuario reportado = usuarioRepository
                .findById(request.idUsuarioReportado())
                .orElseThrow();

        Reporte reporte = new Reporte();

        reporte.setFechaHoraReporte(LocalDate.now());
        reporte.setTipoReporte(request.tipoReporte());
        reporte.setDetalleReporte(request.detalleReporte());

        reporte.setUsuarioReportante(reportante);
        reporte.setUsuarioReportado(reportado);

        reporteRepository.save(reporte);
    }

    public List<ReporteDTO> obtenerTodosLosReportes() {
        return reporteRepository.obtenerReportesConRelaciones().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private ReporteDTO convertToDto(Reporte reporte) {

        // 1. Mapeamos el reportante (siempre existe)
        UsuarioReporteDTO reportante = new UsuarioReporteDTO(
                reporte.getUsuarioReportante().getIdUsuario(),
                reporte.getUsuarioReportante().getNombreUsuario(),
                reporte.getUsuarioReportante().getApellidoUsuario(),
                reporte.getUsuarioReportante().getEmailUsuario()
        );

        // 2. Mapeamos el reportado (solo si existe)
        UsuarioReporteDTO reportado = null;
        if (reporte.getUsuarioReportado() != null && reporte.getUsuarioReportado().getIdUsuario() != null) {
            reportado = new UsuarioReporteDTO(
                    reporte.getUsuarioReportado().getIdUsuario(),
                    reporte.getUsuarioReportado().getNombreUsuario(),
                    reporte.getUsuarioReportado().getApellidoUsuario(),
                    reporte.getUsuarioReportado().getEmailUsuario()
            );
        }

        // 3. Mapeamos la publicación (solo si existe)
        PublicacionReportadaDTO publicacion = null;
        if (reporte.getPublicacionInsumoReportada() != null && reporte.getPublicacionInsumoReportada().getIdPI() != null) {
            publicacion = new PublicacionReportadaDTO(
                    reporte.getPublicacionInsumoReportada().getIdPI(),
                    reporte.getPublicacionInsumoReportada().getTituloPI()
            );
        }

        // Retornamos el DTO con la estructura anidada exacta que quiere React
        return new ReporteDTO(
                reporte.getId(),
                reporte.getFechaHoraReporte(),
                reporte.getTipoReporte(),
                reporte.getDetalleReporte(),
                reportante,
                reportado,
                publicacion
        );
    }

}