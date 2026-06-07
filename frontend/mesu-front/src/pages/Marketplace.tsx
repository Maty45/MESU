import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
// Input removed (unused) to avoid lint/TS warnings
import { Search, SlidersHorizontal, MapPin, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// ----- Tipos y datos de ejemplo -----
type ProductCategory = 'wheelchair' | 'walker' | 'bath' | 'other';
type OperationType = 'donation' | 'rental' | 'sale';

interface Product {
  id: string;
  title: string;
  description: string;
  category: ProductCategory;
  operationType: OperationType;
  status: 'available' | 'unavailable';
  images: string[];
  location: string;
  pricePerDay?: number;
  price?: number;
}

const categoryLabels: Record<ProductCategory, string> = {
  wheelchair: 'Sillas de ruedas',
  walker: 'Andadores',
  bath: 'Ayudas de baño',
  other: 'Otros',
};

const operationTypeLabels: Record<OperationType, string> = {
  donation: 'Donación',
  rental: 'Alquiler',
  sale: 'Venta',
};

// Datos de ejemplo minimalistas para evitar errores de referencia.
const mockProducts: Product[] = [
  {
    id: '1',
    title: 'Silla de ruedas plegable',
    description: 'Silla ligera, ideal para transporte.',
    category: 'wheelchair',
    operationType: 'rental',
    status: 'available',
    images: ['/images/wheelchair.jpg'],
    location: 'Buenos Aires',
    pricePerDay: 300,
  },
  {
    id: '2',
    title: 'Andador ajustable',
    description: 'Andador con ruedas y frenos.',
    category: 'walker',
    operationType: 'sale',
    status: 'available',
    images: ['/images/walker.jpg'],
    location: 'Córdoba',
    price: 15000,
  },
];

export function Marketplace() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<ProductCategory | 'all'>('all');
  const [filterOperation, setFilterOperation] = useState<OperationType | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    const matchesOperation = filterOperation === 'all' || product.operationType === filterOperation;
    const isAvailable = product.status === 'available';

    return matchesSearch && matchesCategory && matchesOperation && isAvailable;
  });

  const getOperationBadge = (type: OperationType) => {
    const variants = {
      donation: 'success' as const,
      rental: 'info' as const,
      sale: 'warning' as const,
    };
    return variants[type];
  };

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
                  onChange={(e) => setFilterCategory(e.target.value as ProductCategory | 'all')}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Todas las categorías</option>
                  {Object.entries(categoryLabels).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Tipo de operación</label>
                <select
                  value={filterOperation}
                  onChange={(e) => setFilterOperation(e.target.value as OperationType | 'all')}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Todas las operaciones</option>
                  {Object.entries(operationTypeLabels).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
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
          {filteredProducts.map((product) => (
            <Link key={product.id} to={`/product/${product.id}`}>
              <Card hover className="h-full flex flex-col">
                <div className="aspect-square bg-slate-100 rounded-t-xl overflow-hidden">
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-full object-cover hover:scale-105 transition duration-300"
                  />
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-slate-900 line-clamp-2 flex-1">
                      {product.title}
                    </h3>
                    <Badge variant={getOperationBadge(product.operationType)}>
                      {operationTypeLabels[product.operationType]}
                    </Badge>
                  </div>

                  <p className="text-sm text-slate-600 line-clamp-2 mb-3">
                    {product.description}
                  </p>

                  <div className="flex items-center gap-1 text-sm text-slate-500 mb-3">
                    <MapPin className="w-4 h-4" />
                    {product.location}
                  </div>

                  <div className="mt-auto pt-3 border-t border-slate-100">
                    {product.operationType === 'donation' ? (
                      <div className="text-lg font-bold text-green-600">Gratis</div>
                    ) : product.operationType === 'rental' ? (
                      <div className="text-lg font-bold text-blue-600">${product.pricePerDay}/día</div>
                    ) : (
                      <div className="text-lg font-bold text-purple-600">${product.price?.toLocaleString()}</div>
                    )}
                  </div>
                </div>
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
