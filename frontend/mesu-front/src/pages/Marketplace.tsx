import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Search, SlidersHorizontal, MapPin, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { publicacionInsumoService } from '../services/publicacionInsumoService';
import { diccionarioService, type ParametricOption } from '../services/diccionarioService';
import type { PublicacionInsumoResponse } from '../types/publicacionInsumo';

export function Marketplace() {
  const { user } = useAuth();
  const [publicaciones, setPublicaciones] = useState<PublicacionInsumoResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [tiposInsumo, setTiposInsumo] = useState<ParametricOption[]>([]);
  const [tiposOperacion, setTiposOperacion] = useState<ParametricOption[]>([]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterOperation, setFilterOperation] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [pubs, categories, operations] = await Promise.all([
          publicacionInsumoService.getAll(),
          diccionarioService.getTiposInsumo(),
          diccionarioService.getTiposOperacion()
        ]);
        setPublicaciones(pubs);
        setTiposInsumo(categories);
        setTiposOperacion(operations);
        setError(null);
      } catch (err: any) {
        console.error('Error al cargar datos del marketplace:', err);
        setError('Error al cargar las publicaciones del marketplace');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredProducts = publicaciones.filter((product) => {
    const matchesSearch = product.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.nombreTipoInsumo === filterCategory;
    const matchesOperation = filterOperation === 'all' || product.nombreTipoOperacion === filterOperation;
    const isActive = product.nombreEstadoPublicacion.toUpperCase() === 'ACTIVA';

    return matchesSearch && matchesCategory && matchesOperation && isActive;
  });

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50">
        <div className="text-slate-500 font-medium">Cargando marketplace...</div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50">
      <div className="bg-white border-b border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Marketplace</h1>
              <p className="text-slate-600">Encuentra el producto ortopédico que necesitas</p>
            </div>
            {user?.roles.includes('PROPIETARIO') && (
              <Link to="/create-product">
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Publicar Producto
                </Button>
              </Link>
            )}
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200 mb-6">
              {error}
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2.5 border border-slate-300 rounded-lg hover:bg-slate-50 transition"
            >
              <SlidersHorizontal className="w-5 h-5" />
              Filtros
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 p-4 bg-slate-50 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Categoría</label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="all">Todas las categorías</option>
                  {tiposInsumo.map((t) => (
                    <option key={t.id} value={t.nombre}>{t.nombre}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Tipo de operación</label>
                <select
                  value={filterOperation}
                  onChange={(e) => setFilterOperation(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="all">Todas las operaciones</option>
                  {tiposOperacion.map((o) => (
                    <option key={o.id} value={o.nombre}>{o.nombre}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-4 text-sm text-slate-600">
          {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} disponible{filteredProducts.length !== 1 ? 's' : ''}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((pub) => (
            <Link key={pub.id} to={`/product/${pub.id}`}>
              <Card hover className="overflow-hidden hover:shadow-lg transition flex flex-col h-full bg-white">
                <div className="h-48 bg-slate-200 overflow-hidden relative">
                  {pub.urlsImagenes && pub.urlsImagenes.length > 0 ? (
                    <img 
                      src={pub.urlsImagenes[0]} 
                      alt={pub.titulo} 
                      className="w-full h-full object-cover hover:scale-105 transition duration-300" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-100">
                      Sin Imagen
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <Badge variant={
                      pub.nombreTipoOperacion.toUpperCase().includes('DONACION') ? 'success' :
                      pub.nombreTipoOperacion.toUpperCase().includes('ALQUILER') ? 'info' : 'warning'
                    }>
                      {pub.nombreTipoOperacion}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4 flex-1 flex flex-col bg-white">
                  <h3 className="text-lg font-semibold text-slate-900 mb-1 line-clamp-2">{pub.titulo}</h3>
                  <p className="text-slate-600 text-sm mb-4 line-clamp-2">{pub.descripcion}</p>
                  
                  <div className="space-y-2 mt-auto pt-3 border-t border-slate-100">
                    <div className="flex items-center text-sm text-slate-500 gap-2">
                      <MapPin className="w-4 h-4" />
                      <span className="truncate">{pub.direccion}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <Badge variant="info">{pub.nombreTipoInsumo}</Badge>
                      <span className="font-semibold text-blue-600">
                        {pub.nombreTipoOperacion.toUpperCase().includes('DONACION') ? (
                          <span className="text-green-600 font-bold">Gratis</span>
                        ) : (
                          <span>${pub.monto} {pub.unidadTiempo && `/ ${pub.unidadTiempo}`}</span>
                        )}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No se encontraron productos</h3>
            <p className="text-slate-600">Intenta ajustar los filtros o buscar otro término</p>
          </div>
        )}
      </div>
    </div>
  );
}
