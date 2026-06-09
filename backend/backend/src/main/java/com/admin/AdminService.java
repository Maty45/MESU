package com.admin;

import com.admin.dto.MetricasDTO;
import com.admin.dto.OperacionesMesDTO;
import com.admin.dto.ProdCategoriaDTO;
import com.publicacioninsumo.PublicacionInsumoRepository;
import com.publicacioninsumointeraccion.PublicacionInsumoInteraccionRepository;
import com.reporte.ReporteRepository;
import com.usuario.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.time.Year;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {
    private final PublicacionInsumoInteraccionRepository interaccionRepository;
    private final UsuarioRepository usuarioRepository;
    private final PublicacionInsumoRepository publicacionInsumoRepository;
    private final ReporteRepository reporteRepository;

    public AdminService(PublicacionInsumoInteraccionRepository interaccionRepository, UsuarioRepository usuarioRepository, PublicacionInsumoRepository publicacionInsumoRepository, ReporteRepository reporteRepository) {
        this.interaccionRepository = interaccionRepository;
        this.usuarioRepository = usuarioRepository;
        this.publicacionInsumoRepository = publicacionInsumoRepository;
        this.reporteRepository = reporteRepository;
    }

    public MetricasDTO getMetricas() {
        try{
            long cantuser = usuarioRepository.findAllActive().stream().count();
            long cantOpMensuales = interaccionRepository.countOpMensuales() != null ? interaccionRepository.countOpMensuales() : 0L;
            long prodActivos = publicacionInsumoRepository.findByEstadoPublicacionCatalogo("ACTIVA").stream().count();
            long cantReportes = reporteRepository.count();
            return new MetricasDTO(cantuser, cantOpMensuales, prodActivos, cantReportes);
        } catch (Exception e) {
            throw new RuntimeException("Error al obtener métricas: " + e.getMessage(), e);
        }
    }

    public OperacionesMesDTO getOperacionesMes() {
        try {
            int currentYear = Year.now().getValue();
            List<Long> monthlyCounts = new ArrayList<>();
            for (int month = 1; month <= 12; month++) {
                Long count = interaccionRepository.countOperationsByMonthAndYear(month, currentYear);
                monthlyCounts.add(count != null ? count : 0L);
            }
            return new OperacionesMesDTO(
                    monthlyCounts.get(0),  // Enero
                    monthlyCounts.get(1),  // Febrero
                    monthlyCounts.get(2),  // Marzo
                    monthlyCounts.get(3),  // Abril
                    monthlyCounts.get(4),  // Mayo
                    monthlyCounts.get(5),  // Junio
                    monthlyCounts.get(6),  // Julio
                    monthlyCounts.get(7),  // Agosto
                    monthlyCounts.get(8),  // Septiembre
                    monthlyCounts.get(9),  // Octubre
                    monthlyCounts.get(10), // Noviembre
                    monthlyCounts.get(11)  // Diciembre
            );
        } catch (Exception e) {
            throw new RuntimeException("Error al obtener operaciones del mes: " + e.getMessage(), e);
        }
    }

    public List<ProdCategoriaDTO> getPorcentajeProductosActivosPorCategoria() {
        try {
            List<Object[]> activeProductsByCategory = publicacionInsumoRepository.countActiveProductsByCategory();
            Long totalActiveProducts = publicacionInsumoRepository.countAllActiveProducts();
            
            // Evitar NPE por unboxing si totalActiveProducts es null
            if (totalActiveProducts == null || totalActiveProducts == 0) {
                return new ArrayList<>();
            }
            return activeProductsByCategory.stream().map(result -> {
                String nombreCategoria = (String) result[0];
                Long cantidadProductosActivos = (Long) result[1];
                Double porcentajeActivos = (double) cantidadProductosActivos / totalActiveProducts * 100.0;
                return new ProdCategoriaDTO(nombreCategoria, cantidadProductosActivos, porcentajeActivos);
            }).collect(Collectors.toList());

        } catch (Exception e) {
            throw new RuntimeException("Error al obtener el porcentaje de productos activos por categoría: " + e.getMessage(), e);
        }
    }
}