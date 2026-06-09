export interface PublicacionInsumoResponse {
  id: number;
  titulo: string;
  descripcion: string;
  fecha: string;
  monto: number;
  unidadTiempo: string;
  direccion: string;
  longitud: number;
  latitud: number;
  urlsImagenes: string[];
  nombreEstadoInsumo: string;
  nombreTipoInsumo: string;
  nombreEstadoPublicacion: string;
  nombreTipoOperacion: string;
  nombreUsuario: string;
  apellidoUsuario: string;
  telefonoUsuario: number; // Changed from string to number
}

export interface PublicacionInsumoCreate {
  titulo: string;
  descripcion: string;
  direccion: string;
  longitud: number;
  latitud: number;
  monto?: number | null;
  unidadTiempo?: string | null;
  idTipoInsumo: number;
  idEstadoInsumo: number;
  idTipoOperacion: number;
  urlsImagenes: string[];
}

export interface PublicacionInsumoUpdate extends PublicacionInsumoCreate {
  // Los mismos campos de Create
}