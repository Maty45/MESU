import { fetchApi } from '../api/apiClient';

export interface ParametricOption {
  id: number;
  nombre: string;
}

export const diccionarioService = {
  getTiposInsumo: async (): Promise<ParametricOption[]> => {
    const response = await fetchApi('/api/tipoinsumo');
    const data = await response.json();
    return data.map((item: any) => ({
      id: item.codTipoInsumo || item.idTipoInsumo || item.id,
      nombre: item.nombreTipoInsumo || item.nombre,
    }));
  },

  getEstadosInsumo: async (): Promise<ParametricOption[]> => {
    const response = await fetchApi('/api/estadoinsumo');
    const data = await response.json();
    return data.map((item: any) => ({
      id: item.idEstadoInsumo || item.id,
      nombre: item.nombreEstadoInsumo || item.nombre,
    }));
  },

  getTiposOperacion: async (): Promise<ParametricOption[]> => {
    const response = await fetchApi('/api/tipooperacion');
    const data = await response.json();
    return data.map((item: any) => ({
      id: item.idTipoOperacion || item.id,
      nombre: item.nombreTipoOperacion || item.nombre,
    }));
  },

  // Preventivos:
  getTiposInteraccion: async (): Promise<ParametricOption[]> => {
    const response = await fetchApi('/api/tipointeraccion');
    const data = await response.json();
    return data.map((item: any) => ({
      id: item.idTipoInteraccion || item.id,
      nombre: item.nombreTipoInteraccion || item.nombre,
    }));
  },

  getEstadosPublicacionInsumo: async (): Promise<ParametricOption[]> => {
    const response = await fetchApi('/api/estadopublicacioninsumo');
    const data = await response.json();
    return data.map((item: any) => ({
      id: item.idEstadoPI || item.id,
      nombre: item.nombreEPI || item.nombre,
    }));
  }
};
