package com.reporte.dto;

import com.reporte.TipoReporte;
import java.time.LocalDate;

public record ReporteDTO(
        Long id,
        LocalDate fechaHoraReporte,
        TipoReporte tipoReporte,
        String detalleReporte,
        UsuarioReporteDTO usuarioReportante,
        UsuarioReporteDTO usuarioReportado,
        PublicacionReportadaDTO publicacionInsumoReportada
) {}