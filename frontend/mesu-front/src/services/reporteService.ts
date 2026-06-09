import { fetchApi } from '../api/apiClient';

export interface ReporteUsuarioRequest {
  idUsuarioReportado: number;
  tipoReporte:
    | 'FRAUDE'
    | 'SPAM'
    | 'CONTENIDO_INAPROPIADO'
    | 'OTRO';
  detalleReporte: string;
}

export const reportService = {
  reportarUsuario: async (
    data: ReporteUsuarioRequest
  ) => {
    return fetchApi('/reportes/usuario', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};