package com.dto;

import com.reporte.TipoReporte;

public record ReportePublicacionRequest(
        Long idPublicacion,
        TipoReporte tipoReporte,
        String detalleReporte
) {
}
