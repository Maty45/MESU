package com.reporte;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ReporteRepository extends JpaRepository<Reporte, Long> {
    @Query("SELECT r FROM Reporte r " +
            "LEFT JOIN FETCH r.usuarioReportante " +
            "LEFT JOIN FETCH r.usuarioReportado " +
            "LEFT JOIN FETCH r.publicacionInsumoReportada " +
            "ORDER BY r.fechaHoraReporte DESC")
    List<Reporte> obtenerReportesConRelaciones();
}
