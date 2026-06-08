import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { categoryLabels, operationTypeLabels } from '../data/mockData';
import type { OperationType, ProductCategory } from '../data/mockData';

export function CreateProduct() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ProductCategory>('wheelchair');
  const [operationType, setOperationType] = useState<OperationType>('sale');
  const [price, setPrice] = useState('');
  const [pricePerDay, setPricePerDay] = useState('');
  const [location, setLocation] = useState('');
  const [condition, setCondition] = useState<'new' | 'like-new' | 'good' | 'fair'>('good');
  const [images, setImages] = useState<string[]>([]);

  if (!user || !user.roles.includes('PROPIETARIO')) {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">
          Acceso denegado
        </h2>
        <p className="text-slate-600 mb-6">
          Debes ser propietario para publicar productos
        </p>
        <Button onClick={() => navigate('/marketplace')}>
          Volver al Marketplace
        </Button>
      </div>
    </div>
  );
}

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('¡Producto publicado exitosamente! En una aplicación real, esto se guardaría en la base de datos.');
    navigate('/owner-dashboard');
  };

  const handleImageUpload = () => {
    const mockImage = 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=800';
    setImages([...images, mockImage]);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/owner-dashboard')}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al panel
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Publicar producto</h1>
          <p className="text-slate-600 mb-8">Completa la información del producto ortopédico</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                type="text"
                label="Título del producto"
                placeholder="Ej: Silla de ruedas plegable"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Descripción
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe el producto, su estado, características especiales..."
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition min-h-32"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Categoría
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ProductCategory)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {(Object.entries(categoryLabels) as [ProductCategory, string][]).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Tipo de operación
                </label>
                <select
                  value={operationType}
                  onChange={(e) => setOperationType(e.target.value as OperationType)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {(Object.entries(operationTypeLabels) as [OperationType, string][]).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
            </div>

            {operationType === 'sale' && (
              <div>
                <Input
                  type="number"
                  label="Precio de venta"
                  placeholder="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
            )}

            {operationType === 'rental' && (
              <div>
                <Input
                  type="number"
                  label="Precio por día"
                  placeholder="0"
                  value={pricePerDay}
                  onChange={(e) => setPricePerDay(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Input
                  type="text"
                  label="Ubicación"
                  placeholder="Ej: Palermo, CABA"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Estado del producto
                </label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value as 'new' | 'like-new' | 'good' | 'fair')}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="new">Nuevo</option>
                  <option value="like-new">Como nuevo</option>
                  <option value="good">Buen estado</option>
                  <option value="fair">Estado aceptable</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Imágenes del producto
              </label>
              <div className="grid grid-cols-3 gap-4">
                {images.map((img, index) => (
                  <div key={index} className="relative aspect-square bg-slate-100 rounded-lg overflow-hidden">
                    <img src={img} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setImages(images.filter((_, i) => i !== index))}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleImageUpload}
                  className="aspect-square border-2 border-dashed border-slate-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition flex flex-col items-center justify-center gap-2 text-slate-600 hover:text-blue-600"
                >
                  <Upload className="w-6 h-6" />
                  <span className="text-sm">Subir foto</span>
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-2">En esta demo, se agrega una imagen de ejemplo</p>
            </div>

            <div className="flex gap-4 pt-6">
              <Button type="button" variant="outline" onClick={() => navigate('/owner-dashboard')} className="flex-1">
                Cancelar
              </Button>
              <Button type="submit" className="flex-1">
                Publicar producto
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
