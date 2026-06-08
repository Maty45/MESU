package com.dto;

import com.reporte.TipoReporte;

public record ReporteUsuarioRequest(
        Long idUsuarioReportado,
        TipoReporte tipoReporte,
        String detalleReporte
) {
}
