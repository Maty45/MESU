import { fetchApi } from '../api/apiClient';
import type { PublicacionInsumoResponse, PublicacionInsumoCreate, PublicacionInsumoUpdate } from '../types/publicacionInsumo';

export const publicacionInsumoService = {
  getAll: async (): Promise<PublicacionInsumoResponse[]> => {
    const response = await fetchApi('/api/publicaciones');
    return response.json();
  },

  getMisPublicaciones: async (): Promise<PublicacionInsumoResponse[]> => {
    const response = await fetchApi('/api/publicaciones/mis-publicaciones');
    return response.json();
  },

  getById: async (id: number): Promise<PublicacionInsumoResponse> => {
    const response = await fetchApi(`/api/publicaciones/${id}`);
    return response.json();
  },

  create: async (data: PublicacionInsumoCreate): Promise<PublicacionInsumoResponse> => {
    const response = await fetchApi('/api/publicaciones', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.json();
  },

  update: async (id: number, data: PublicacionInsumoUpdate): Promise<PublicacionInsumoResponse> => {
    const response = await fetchApi(`/api/publicaciones/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.json();
  },

  delete: async (id: number): Promise<void> => {
    await fetchApi(`/api/publicaciones/${id}`, {
      method: 'DELETE',
    });
  },

  uploadImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    
    // fetchApi setea Content-Type a JSON por defecto a menos que sea FormData
    const response = await fetchApi('/api/imagenes/upload', {
      method: 'POST',
      body: formData,
    });
    
    const data = await response.json();
    return data.url;
  },

  getInteracciones: async (idPublicacion: number): Promise<any[]> => {
    const response = await fetchApi(`/api/interacciones/publicacion/${idPublicacion}`);
    return response.json();
  },

  concretarInteraccion: async (idInteraccion: number, data: { tipoInteraccionConcretada: string; fechaDesde?: string | null; fechaHastaAcordada?: string | null; montoAcordado?: number | null }): Promise<any> => {
    const response = await fetchApi(`/api/interacciones/${idInteraccion}/concretar`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.json();
  },

  registrarDevolucion: async (idPublicacion: number, data?: { fechaDevolucion?: string | null }): Promise<any> => {
    const response = await fetchApi(`/api/publicaciones/${idPublicacion}/registrar-devolucion`, {
      method: 'POST',
      body: JSON.stringify(data || {}),
    });
    return response.json();
  },

  registrarContacto: async (idPublicacion: number): Promise<any> => {
    const response = await fetchApi(`/api/interacciones/publicacion/${idPublicacion}/contacto`, {
      method: 'POST',
    });
    return response.json();
  }
};
