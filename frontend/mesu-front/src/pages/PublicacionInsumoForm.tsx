import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { publicacionInsumoService } from '../services/publicacionInsumoService';
import { diccionarioService, type ParametricOption } from '../services/diccionarioService';
import type { PublicacionInsumoCreate } from '../types/publicacionInsumo';
import { Button } from '../components/ui/button';
import { MapPin, UploadCloud, Loader2, ArrowLeft, X } from 'lucide-react';

export function PublicacionInsumoForm() {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const navigate = useNavigate();

  const [formData, setFormData] = useState<PublicacionInsumoCreate>({
    titulo: '',
    descripcion: '',
    direccion: '',
    latitud: 0,
    longitud: 0,
    monto: 0,
    unidadTiempo: 'DIA',
    idTipoInsumo: 1, // Valores por defecto para FK
    idEstadoInsumo: 1,
    idTipoOperacion: 1,
    urlsImagenes: [],
  });

  const [loading, setLoading] = useState(false);
  const [loadingDicts, setLoadingDicts] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);

  const [tiposInsumo, setTiposInsumo] = useState<ParametricOption[]>([]);
  const [estadosInsumo, setEstadosInsumo] = useState<ParametricOption[]>([]);
  const [tiposOperacion, setTiposOperacion] = useState<ParametricOption[]>([]);

  useEffect(() => {
    const init = async () => {
      try {
        setLoadingDicts(true);
        const [tipos, estados, operaciones] = await Promise.all([
          diccionarioService.getTiposInsumo(),
          diccionarioService.getEstadosInsumo(),
          diccionarioService.getTiposOperacion()
        ]);
        setTiposInsumo(tipos);
        setEstadosInsumo(estados);
        setTiposOperacion(operaciones);

        if (isEditing && id) {
          await loadPublicacion(parseInt(id), tipos, estados, operaciones);
        } else {
          setFormData(prev => ({
            ...prev,
            idTipoInsumo: tipos.length > 0 ? tipos[0].id : prev.idTipoInsumo,
            idEstadoInsumo: estados.length > 0 ? estados[0].id : prev.idEstadoInsumo,
            idTipoOperacion: operaciones.length > 0 ? operaciones[0].id : prev.idTipoOperacion,
          }));
        }
      } catch (err: any) {
        console.error('Error cargando diccionarios:', err);
      } finally {
        setLoadingDicts(false);
      }
    };

    init();
  }, [id, isEditing]);

  const loadPublicacion = async (
    pubId: number,
    tipos: ParametricOption[],
    estados: ParametricOption[],
    operaciones: ParametricOption[]
  ) => {
    try {
      setLoading(true);
      const pub = await publicacionInsumoService.getById(pubId);
      
      const matchedTipoInsumo = tipos.find(t => t.nombre.toUpperCase() === pub.nombreTipoInsumo.toUpperCase());
      const matchedEstadoInsumo = estados.find(e => e.nombre.toUpperCase() === pub.nombreEstadoInsumo.toUpperCase());
      const matchedTipoOperacion = operaciones.find(o => o.nombre.toUpperCase() === pub.nombreTipoOperacion.toUpperCase());

      setFormData({
        titulo: pub.titulo,
        descripcion: pub.descripcion,
        direccion: pub.direccion,
        latitud: pub.latitud,
        longitud: pub.longitud,
        monto: pub.monto,
        unidadTiempo: pub.unidadTiempo || 'DIA',
        idTipoInsumo: matchedTipoInsumo ? matchedTipoInsumo.id : 1,
        idEstadoInsumo: matchedEstadoInsumo ? matchedEstadoInsumo.id : 1,
        idTipoOperacion: matchedTipoOperacion ? matchedTipoOperacion.id : 1,
        urlsImagenes: pub.urlsImagenes || [],
      });
    } catch (err: any) {
      setError('Error al cargar la publicación: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let val: any = value;
    if (type === 'number') {
      val = value === '' ? 0 : parseFloat(value);
    } else if (name.startsWith('id')) {
      val = parseInt(value, 10);
    }
    setFormData((prev) => ({
      ...prev,
      [name]: val,
    }));
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('La geolocalización no es soportada por tu navegador');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          latitud: position.coords.latitude,
          longitud: position.coords.longitude,
        }));
        setLocating(false);
      },
      (err) => {
        alert('No se pudo obtener la ubicación: ' + err.message);
        setLocating(false);
      }
    );
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    try {
      setUploadingImage(true);
      const url = await publicacionInsumoService.uploadImage(file);
      setFormData((prev) => ({
        ...prev,
        urlsImagenes: [...prev.urlsImagenes, url],
      }));
    } catch (err: any) {
      alert('Error al subir imagen: ' + err.message);
    } finally {
      setUploadingImage(false);
      e.target.value = ''; // reset input
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => {
      const newImages = [...prev.urlsImagenes];
      newImages.splice(index, 1);
      return { ...prev, urlsImagenes: newImages };
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const operacionSeleccionada = tiposOperacion.find(t => t.id === formData.idTipoOperacion)?.nombre.toLowerCase() || '';
      const isVenta = operacionSeleccionada.includes('venta');
      const isAlquiler = operacionSeleccionada.includes('alquiler');

      const payload: PublicacionInsumoCreate = {
        ...formData,
        monto: isAlquiler || isVenta ? formData.monto : null,
        unidadTiempo: isAlquiler ? formData.unidadTiempo : null,
      };
      
      if (isEditing && id) {
        await publicacionInsumoService.update(parseInt(id), payload);
      } else {
        await publicacionInsumoService.create(payload);
      }
      
      navigate('/owner-dashboard');
    } catch (err: any) {
      setError(err.message || 'Error al guardar la publicación');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) {
    return <div className="text-center p-8">Cargando datos...</div>;
  }

  const operacionSeleccionada = tiposOperacion.find(t => t.id === formData.idTipoOperacion)?.nombre.toLowerCase() || '';
  const isVenta = operacionSeleccionada.includes('venta');
  const isAlquiler = operacionSeleccionada.includes('alquiler');
  const showMonto = isVenta || isAlquiler;
  const showUnidadTiempo = isAlquiler;

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-4">
      <button 
        type="button" 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver al panel
      </button>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-slate-200 space-y-8">
        <div className="border-b border-slate-100 pb-6 mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            {isEditing ? 'Editar publicación' : 'Publicar producto'}
          </h2>
          <p className="text-slate-500">Completa la información del producto ortopédico</p>
        </div>
        
        <div className="space-y-8">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Título</label>
            <input
              type="text"
              name="titulo"
              required
              value={formData.titulo}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Ej: Tractor John Deere"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Descripción</label>
            <textarea
              name="descripcion"
              required
              rows={4}
              value={formData.descripcion}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
              placeholder="Detalla las características del insumo..."
            />
          </div>

          {/* Selects: Tipo de Insumo, Estado del Insumo, Tipo de Operación */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Tipo de Insumo</label>
              <select
                name="idTipoInsumo"
                value={formData.idTipoInsumo}
                onChange={handleChange}
                disabled={loadingDicts}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white disabled:bg-slate-100"
              >
                {tiposInsumo.map(t => (
                  <option key={t.id} value={t.id}>{t.nombre}</option>
                ))}
                {tiposInsumo.length === 0 && <option value={formData.idTipoInsumo}>Cargando...</option>}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Estado del Insumo</label>
              <select
                name="idEstadoInsumo"
                value={formData.idEstadoInsumo}
                onChange={handleChange}
                disabled={loadingDicts}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white disabled:bg-slate-100"
              >
                {estadosInsumo.map(e => (
                  <option key={e.id} value={e.id}>{e.nombre}</option>
                ))}
                {estadosInsumo.length === 0 && <option value={formData.idEstadoInsumo}>Cargando...</option>}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Tipo de Operación</label>
              <select
                name="idTipoOperacion"
                value={formData.idTipoOperacion}
                onChange={handleChange}
                disabled={loadingDicts}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white disabled:bg-slate-100"
              >
                {tiposOperacion.map(o => (
                  <option key={o.id} value={o.id}>{o.nombre}</option>
                ))}
                {tiposOperacion.length === 0 && <option value={formData.idTipoOperacion}>Cargando...</option>}
              </select>
            </div>
          </div>

          {/* Precio y Unidad de tiempo */}
          {showMonto && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Monto ($)</label>
                <input
                  type="number"
                  name="monto"
                  value={formData.monto ?? ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              {showUnidadTiempo && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Unidad de Tiempo</label>
                  <select
                    name="unidadTiempo"
                    value={formData.unidadTiempo || 'DIA'}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                  >
                    <option value="DIA">Por Día</option>
                    <option value="SEMANA">Por Semana</option>
                    <option value="MES">Por Mes</option>
                  </select>
                </div>
              )}
            </div>
          )}

          <div className="border-t border-slate-200 pt-8">
            <h3 className="text-lg font-medium text-slate-900 mb-6">Ubicación</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Dirección Física</label>
                <input
                  type="text"
                  name="direccion"
                  required
                  value={formData.direccion}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Ej: Ruta 9 Km 200, Buenos Aires"
                />
              </div>

              {formData.latitud !== 0 && formData.longitud !== 0 && (
                <div className="text-sm text-green-600 bg-green-50 p-3 rounded-lg border border-green-200">
                  Ubicación GPS obtenida correctamente.
                </div>
              )}
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleGetLocation} 
                disabled={locating}
                className="w-full md:w-auto"
              >
                {locating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <MapPin className="w-4 h-4 mr-2" />}
                Usar mi ubicación actual
              </Button>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-8">
            <h3 className="text-lg font-medium text-slate-900 mb-6">Imágenes</h3>
            
            {formData.urlsImagenes.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {formData.urlsImagenes.map((url, idx) => (
                  <div key={idx} className="relative aspect-square bg-slate-100 rounded-lg overflow-hidden border border-slate-200 group">
                    <img src={url} alt={`Imagen ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition shadow-sm"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div>
              <label className="flex items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-slate-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-slate-400 focus:outline-none">
                <span className="flex items-center space-x-2">
                  {uploadingImage ? (
                    <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                  ) : (
                    <UploadCloud className="w-6 h-6 text-slate-400" />
                  )}
                  <span className="font-medium text-slate-600">
                    {uploadingImage ? 'Subiendo imagen...' : 'Haz clic para subir una imagen'}
                  </span>
                </span>
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} />
              </label>
            </div>
          </div>



        </div>

        <div className="flex justify-end gap-4 pt-6 mt-6 border-t border-slate-200">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            {isEditing ? 'Guardar Cambios' : 'Crear Publicación'}
          </Button>
        </div>
      </form>
    </div>
  );
}
