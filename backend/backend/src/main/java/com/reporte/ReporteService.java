package com.reporte;


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

    public List<Reporte> obtenerTodosLosReportes() {
        return reporteRepository.findAllByOrderByFechaHoraReporteDesc();
    }

}