import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { mockOperations, mockProducts } from '../data/mockData';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import {
  ShoppingBag,
  Clock,
  CheckCircle,
  Package,
  AlertCircle,
} from 'lucide-react';

export function ClientDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user || !user.roles.includes('CLIENTE')) {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">
          Acceso denegado
        </h2>
        <p className="text-slate-600 mb-6">
          Esta página es solo para clientes
        </p>
        <Button onClick={() => navigate('/marketplace')}>
          Ir al Marketplace
        </Button>
      </div>
    </div>
  );
}

  const userOperations = mockOperations.filter((op) => op.clientId === 'client1');
  const activeRentals = userOperations.filter((op) => op.type === 'rental' && op.status === 'active');
  const pendingOperations = userOperations.filter((op) => op.status === 'pending');
  const completedOperations = userOperations.filter((op) => op.status === 'completed');

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'warning' as const,
      active: 'info' as const,
      completed: 'success' as const,
      cancelled: 'danger' as const,
    };
    return variants[status as keyof typeof variants] || 'default';
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      pending: 'Pendiente',
      active: 'Activa',
      completed: 'Completada',
      cancelled: 'Cancelada',
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const today = new Date();
    const diff = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Panel de Cliente</h1>
          <p className="text-slate-600">Bienvenido, {user.name}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-slate-900">{activeRentals.length}</div>
                  <div className="text-sm text-slate-600 mt-1">Alquileres activos</div>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-slate-900">{pendingOperations.length}</div>
                  <div className="text-sm text-slate-600 mt-1">Operaciones pendientes</div>
                </div>
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-slate-900">{completedOperations.length}</div>
                  <div className="text-sm text-slate-600 mt-1">Operaciones completadas</div>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {activeRentals.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-slate-900">Recordatorios de devolución</h2>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeRentals.map((rental) => {
                  const daysRemaining = getDaysRemaining(rental.endDate!);
                  const product = mockProducts.find((p) => p.id === rental.productId);

                  return (
                    <div
                      key={rental.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg gap-4"
                    >
                      <div className="flex items-start gap-4">
                        {product && (
                          <img
                            src={product.images[0]}
                            alt={rental.productTitle}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        )}
                        <div>
                          <h3 className="font-medium text-slate-900">{rental.productTitle}</h3>
                          <div className="text-sm text-slate-600 mt-1">
                            Devolver antes del {new Date(rental.endDate!).toLocaleDateString('es-AR')}
                          </div>
                          <div className="text-sm font-medium text-blue-600 mt-1">
                            {daysRemaining > 0
                              ? `${daysRemaining} día${daysRemaining > 1 ? 's' : ''} restante${daysRemaining > 1 ? 's' : ''}`
                              : daysRemaining === 0
                              ? '¡Hoy es el último día!'
                              : '¡Devolución atrasada!'}
                          </div>
                        </div>
                      </div>
                      <Button size="sm">Contactar propietario</Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-slate-900">Mis operaciones</h2>
          </CardHeader>
          <CardContent>
            {userOperations.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No tienes operaciones aún</h3>
                <p className="text-slate-600 mb-6">Explora el marketplace para encontrar productos</p>
                <Button onClick={() => navigate('/marketplace')}>Ir al Marketplace</Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">Producto</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">Propietario</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">Tipo</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">Estado</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">Fecha</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">Monto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userOperations.map((operation) => (
                      <tr key={operation.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4">
                          <div className="font-medium text-slate-900">{operation.productTitle}</div>
                        </td>
                        <td className="py-3 px-4 text-slate-600">{operation.ownerName}</td>
                        <td className="py-3 px-4">
                          <Badge
                            variant={
                              operation.type === 'donation'
                                ? 'success'
                                : operation.type === 'rental'
                                ? 'info'
                                : 'warning'
                            }
                          >
                            {operation.type === 'donation'
                              ? 'Donación'
                              : operation.type === 'rental'
                              ? 'Alquiler'
                              : 'Venta'}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant={getStatusBadge(operation.status ?? 'pending')}>
                            {getStatusLabel(operation.status ?? 'pending')}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-600">
                          {operation.startDate
                            ? new Date(operation.startDate).toLocaleDateString('es-AR')
                            : operation.date
                            ? new Date(operation.date).toLocaleDateString('es-AR')
                            : '-'}
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-900">
                          {operation.amount ? `$${operation.amount.toLocaleString()}` : 'Gratis'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
