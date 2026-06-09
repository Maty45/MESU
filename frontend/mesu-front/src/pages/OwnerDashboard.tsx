import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// mockOperations removed
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import {
  Plus,
  Package,
  TrendingUp,
  DollarSign,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { publicacionInsumoService } from '../services/publicacionInsumoService';
import type { PublicacionInsumoResponse } from '../types/publicacionInsumo';

export function OwnerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [publicaciones, setPublicaciones] = useState<PublicacionInsumoResponse[]>([]);
  const [operaciones, setOperaciones] = useState<any[]>([]);
  const [alquileresActivos, setAlquileresActivos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportClientName, setReportClientName] = useState('');
  const [reportReason, setReportReason] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [pubData, opData, rentData] = await Promise.all([
        publicacionInsumoService.getMisPublicaciones(),
        publicacionInsumoService.getMisOperaciones(),
        publicacionInsumoService.getMisAlquileresActivos()
      ]);
      setPublicaciones(pubData);
      setOperaciones(opData);
      setAlquileresActivos(rentData);
    } catch (err) {
      console.error('Error al cargar datos en owner dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (!user || !user.roles.includes('PROPIETARIO')) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Acceso denegado
          </h2>
          <p className="text-slate-600 mb-6">
            Esta página es solo para propietarios
          </p>
          <Button onClick={() => navigate('/marketplace')}>
            Ir al Marketplace
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50">
        <div className="text-slate-500 font-medium">Cargando panel...</div>
      </div>
    );
  }

  const userProducts = publicaciones;
  const availableProducts = userProducts.filter((p) => p.nombreEstadoPublicacion.toUpperCase() === 'ACTIVA').length;

  const totalRevenue = operaciones
    .filter((op) => {
      const type = op.nombreTipoInteraccion?.toUpperCase();
      return type === 'VENTA' || type === 'ALQUILER';
    })
    .reduce((sum, op) => sum + (op.montoOperacion || 0), 0);

  const getRentalBadge = (dueDateStr: string) => {
    if (!dueDateStr) return { label: 'En curso', variant: 'info' as const };
    const parts = dueDateStr.split('-');
    let dueDate: Date;
    if (parts.length === 3) {
      dueDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]), 23, 59, 59);
    } else {
      dueDate = new Date(dueDateStr);
      dueDate.setHours(23, 59, 59, 999);
    }
    const today = new Date();
    
    if (today > dueDate) {
      return { label: '¡Vencido!', variant: 'danger' as const };
    }
    
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 3) {
      return { label: '¡Por vencer!', variant: 'warning' as const };
    }
    
    return { label: 'En curso', variant: 'info' as const };
  };

  const formatDateString = (dateStr: string) => {
    if (!dateStr) return '';
    if (dateStr.includes('T')) {
      return new Date(dateStr).toLocaleDateString('es-AR');
    }
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return new Date(dateStr).toLocaleDateString('es-AR');
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!confirm('¿Estás seguro de eliminar esta publicación?')) return;
    try {
      await publicacionInsumoService.delete(productId);
      await loadData();
    } catch (err: any) {
      alert('Error al eliminar: ' + err.message);
    }
  };

  const getStatusBadge = (status: string) => {
    const s = status.toUpperCase();
    if (s === 'ACTIVA') return 'success';
    if (s === 'ALQUILADA') return 'info';
    if (s === 'FINALIZADA') return 'warning';
    return 'default';
  };

  const getStatusLabel = (status: string) => {
    const s = status.toUpperCase();
    if (s === 'ACTIVA') return 'Activa';
    if (s === 'ALQUILADA') return 'Alquilada';
    if (s === 'FINALIZADA') return 'Finalizada';
    if (s === 'ELIMINADA') return 'Eliminada';
    return status;
  };

  const handleReportClient = (clientName: string) => {
    setReportClientName(clientName);
    setShowReportModal(true);
  };

  const handleSubmitReport = () => {
    alert('Reporte de cliente enviado. Nuestro equipo lo revisará pronto.');
    setShowReportModal(false);
    setReportReason('');
    setReportClientName('');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Panel de Propietario</h1>
            <p className="text-slate-600">Gestiona tus publicaciones y operaciones</p>
          </div>
          <Link to="/create-product">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Nueva Publicación
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-slate-900">{userProducts.length}</div>
                  <div className="text-sm text-slate-600 mt-1">Total publicaciones</div>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-slate-900">{availableProducts}</div>
                  <div className="text-sm text-slate-600 mt-1">Disponibles</div>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-slate-900">{operaciones.length}</div>
                  <div className="text-sm text-slate-600 mt-1">Operaciones</div>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-slate-900">${totalRevenue.toLocaleString()}</div>
                  <div className="text-sm text-slate-600 mt-1">Ingresos totales</div>
                </div>
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-teal-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {alquileresActivos.length > 0 && (
          <Card className="mb-8 border border-amber-200">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                <h2 className="text-xl font-semibold text-slate-900">Avisos sobre alquileres</h2>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alquileresActivos.map((rent) => {
                  const badgeInfo = getRentalBadge(rent.fechaHastaAcordadaAI);
                  return (
                    <div
                      key={rent.idPII}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-amber-50/50 border border-amber-200 rounded-lg gap-3"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-slate-900">{rent.tituloPublicacion}</div>
                        <div className="text-sm text-slate-600 mt-1">
                          Cliente: {rent.nombreUsuarioCliente} {rent.apellidoUsuarioCliente} • Vence el {formatDateString(rent.fechaHastaAcordadaAI)}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge
                          variant={badgeInfo.variant}
                          className={
                            badgeInfo.variant === 'warning'
                              ? 'bg-amber-100 text-amber-700 border-amber-300'
                              : badgeInfo.variant === 'danger'
                              ? 'bg-red-100 text-red-700 border-red-300'
                              : 'bg-blue-100 text-blue-700 border-blue-300'
                          }
                        >
                          {badgeInfo.label}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="mb-8">
          <CardHeader>
            <h2 className="text-xl font-semibold text-slate-900">Operaciones recientes</h2>
          </CardHeader>
          <CardContent>
            {operaciones.length === 0 ? (
              <div className="text-center py-8 text-slate-600">
                No tienes operaciones aún
              </div>
            ) : (
              <div className="space-y-3">
                {operaciones.slice(0, 3).map((operation) => (
                  <div
                    key={operation.idPII}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 rounded-lg gap-3"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-slate-900">{operation.tituloPublicacion}</div>
                      <div className="text-sm text-slate-600 mt-1">
                        Cliente: {operation.nombreUsuarioCliente} {operation.apellidoUsuarioCliente} • {formatDateString(operation.fechaHPII)}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={
                          operation.nombreTipoInteraccion?.toUpperCase() === 'DONACION'
                            ? 'success'
                            : operation.nombreTipoInteraccion?.toUpperCase() === 'ALQUILER'
                            ? 'info'
                            : 'warning'
                        }
                      >
                        {operation.nombreTipoInteraccion?.toUpperCase() === 'DONACION'
                          ? 'Donación'
                          : operation.nombreTipoInteraccion?.toUpperCase() === 'ALQUILER'
                          ? 'Alquiler'
                          : 'Venta'}
                      </Badge>
                      <div className="font-medium text-slate-900">
                        {operation.montoOperacion ? `$${operation.montoOperacion.toLocaleString()}` : 'Gratis'}
                      </div>
                      <button
                        onClick={() => handleReportClient(`${operation.nombreUsuarioCliente} ${operation.apellidoUsuarioCliente}`)}
                        className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                        title="Reportar cliente"
                      >
                        <AlertTriangle className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-slate-900">Mis publicaciones</h2>
          </CardHeader>
          <CardContent>
            {userProducts.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No tienes publicaciones aún</h3>
                <p className="text-slate-600 mb-6">Crea tu primera publicación para empezar</p>
                <Link to="/create-product">
                  <Button>Crear publicación</Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userProducts.map((product) => (
                  <div key={product.id} className="border border-slate-200 rounded-lg overflow-hidden hover:shadow-md transition bg-white">
                    <div className="aspect-square bg-slate-100">
                      {product.urlsImagenes && product.urlsImagenes.length > 0 ? (
                        <img
                          src={product.urlsImagenes[0]}
                          alt={product.titulo}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-50">
                          Sin Imagen
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-slate-900 flex-1 line-clamp-1">
                          {product.titulo}
                        </h3>
                        <Badge variant={getStatusBadge(product.nombreEstadoPublicacion)}>
                          {getStatusLabel(product.nombreEstadoPublicacion)}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 line-clamp-2 mb-3">
                        {product.descripcion}
                      </p>
                      <div className="flex items-center gap-2">
                        <Link to={`/product/${product.id}`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full gap-2">
                            <Eye className="w-4 h-4" />
                            Ver
                          </Button>
                        </Link>
                        <button 
                          onClick={() => navigate(`/publicacion-insumo/editar/${product.id}`)}
                          className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded transition"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Reportar Cliente</h2>
            <p className="text-slate-600 mb-4">{reportClientName}</p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Razón del reporte
              </label>
              <textarea
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder="Describe el motivo del reporte..."
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-32"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowReportModal(false);
                  setReportReason('');
                  setReportClientName('');
                }}
                className="flex-1 bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-500 transition-colors"
              >
                Cancelar
              </button>
              <Button onClick={handleSubmitReport} className="flex-1">
                Enviar Reporte
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
