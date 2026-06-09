import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { mockReports } from '../data/mockData';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import {
  Users,
  Package,
  TrendingUp,
  AlertTriangle,
  Eye,
  Trash2,
  CheckCircle,
  BarChart3,
  ShieldCheck,
  RefreshCcw,
  DollarSign,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

// Define the DTO types based on backend structure
interface RolDTO {
  idRol: number;
  nombreRol: string;
  fechaAltaRol: string; // LocalDate
  fechaBajaRol: string | null; // LocalDate
}

interface UsuarioRolDTO {
  rol: RolDTO;
}

interface UsuarioDTO {
  idUsuario: number;
  dniUsuario: number;
  nombreUsuario: string;
  apellidoUsuario: string;
  emailUsuario: string;
  telefonoUsuario: string;
  fechaHRegistroUsuario: string; // LocalDate
  fechaHBajaUsuario: string | null; // LocalDate
  usuarioRoles: UsuarioRolDTO[];
}

interface PublicacionInsumoResponseDTO {
  id: number;
  titulo: string;
  descripcion: string;
  fecha: string; // LocalDate from Java will be a string in JS
  nombreTipoOperacion: string;
  monto: number | null;
  unidadTiempo: string | null;
  nombreEstadoPublicacion: string;
  nombreEstadoInsumo: string;
  nombreTipoInsumo: string;
  nombreUsuario: string;
  apellidoUsuario: string;
  // urlsImagenes: string[]; // Excluded as per user request
}

// Backend DTO Interfaces
interface MetricasBackendDTO {
  cantUser: number;
  cantOpMensual: number;
  prodActivos: number;
  cantReportes: number;
}

interface OperacionesMesBackendDTO {
  ene: number;
  feb: number;
  mar: number;
  abr: number;
  may: number;
  jun: number;
  jul: number;
  ago: number;
  sep: number;
  oct: number;
  nov: number;
  dic: number;
}

interface ProdCategoriaBackendDTO {
  nombreCategoria: string;
  cantidadProductosActivos: number;
  porcentajeActivos: number;
}

export function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'users' | 'reports'>('overview');
  const [backendUsers, setBackendUsers] = useState<UsuarioDTO[]>([]); // State to store fetched users
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [backendPublications, setBackendPublications] = useState<PublicacionInsumoResponseDTO[]>([]);
  const [loadingPublications, setLoadingPublications] = useState(false);
  const [metrics, setMetrics] = useState({ 
    usuariosTotales: 0, 
    productosActivos: 0, 
    operacionesTotales: 0, 
    reportesPendientes: 0,
    // Tendencia fields removed as they are not provided by the backend DTO
  });
  const [operationsData, setOperationsData] = useState<any[]>([]);
  const [categoriesData, setCategoriesData] = useState<any[]>([]);
  const [loadingOverview, setLoadingOverview] = useState(false);
  const [errorPublications, setErrorPublications] = useState<string | null>(null);
  const [errorUsers, setErrorUsers] = useState<string | null>(null);

  const getAuthHeader = () => {
    const token = user?.token?.replace(/['"]+/g, '').trim(); // Elimina comillas si existen
    return { 'Authorization': `Bearer ${token}` };
  };

  const obtenerMetricas = async (): Promise<MetricasBackendDTO> => {
    const response = await fetch('http://localhost:8080/api/admin/metricas', {
      headers: getAuthHeader(),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    console.log("Métricas obtenidas del backend:", response);
    return await response.json();
  };

  const obtenerOperacionesPorMes = async (): Promise<OperacionesMesBackendDTO> => {
    const response = await fetch('http://localhost:8080/api/admin/meses', {
      headers: getAuthHeader(),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  };

  const obtenerProductosPorCategoria = async (): Promise<ProdCategoriaBackendDTO[]> => {
    const response = await fetch('http://localhost:8080/api/admin/productos-categoria', {
      headers: getAuthHeader(),
    }); 
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  };

  const fetchOverviewData = async () => {
    if (!user?.token) return;
    setLoadingOverview(true);
    try {
      const [m, o, c] = await Promise.all([
        obtenerMetricas(),
        obtenerOperacionesPorMes(),
        obtenerProductosPorCategoria()
      ]);
      
      setMetrics({
        usuariosTotales: m.cantUser || 0,
        productosActivos: m.prodActivos || 0,
        operacionesTotales: m.cantOpMensual || 0,
        reportesPendientes: m.cantReportes || 0,
      });
      
      const monthKeys = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
      const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      const operationsArray = monthKeys.map((key, index) => ({
        name: monthNames[index],
        operaciones: (o as any)[key] || 0
      }));

      setOperationsData(operationsArray);

      setCategoriesData((c || []).map((item: ProdCategoriaBackendDTO) => ({
        name: item.nombreCategoria,
        value: item.cantidadProductosActivos
      })));
      
    } catch (error) {
      console.error("Error loading overview data:", error);
    } finally {
      setLoadingOverview(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'overview') {
      fetchOverviewData();
    }
  }, [activeTab, user?.token]); // Se añadió user?.token a las dependencias

  if (!user || !user.roles.includes('ADMIN')) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Acceso denegado</h2>
          <p className="text-slate-600 mb-6">Esta página es solo para administradores</p>
          <Button onClick={() => navigate('/marketplace')}>Ir al Marketplace</Button>
        </div>
      </div>
    );
  }

  const COLORS = ['#3b82f6', '#14b8a6', '#8b5cf6', '#f59e0b', '#ef4444', '#6b7280'];

  const fetchUsers = async () => {
    setLoadingUsers(true);
    setErrorUsers(null);
    try {
      if (!user || !user.token) { // Check if user or token is missing
        console.error("Authentication token is missing for fetching users.");
        setErrorUsers("No autorizado: token de usuario no disponible.");
        navigate('/login');
        return;
      }
      const response = await fetch('http://localhost:8080/api/usuario', {
        headers: getAuthHeader(),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: UsuarioDTO[] = await response.json();
      setBackendUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      setErrorUsers("Error al cargar los usuarios.");
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchPublications = async () => {
    setLoadingPublications(true);
    setErrorPublications(null);
    try {
      if (!user || !user.token) { // Check if user or token is missing
        console.error("Authentication token is missing for fetching publications.");
        setErrorPublications("No autorizado: token de usuario no disponible.");
        navigate('/login');
        return;
      }
      const response = await fetch('http://localhost:8080/api/publicaciones/obtenerPublicaciones', {
        headers: getAuthHeader(),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: PublicacionInsumoResponseDTO[] = await response.json();
      setBackendPublications(data);
    } catch (error) {
      console.error("Error fetching publications:", error);
      setErrorPublications("Error al cargar las publicaciones.");
    } finally {
      setLoadingPublications(false);
    }
  };


  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab, user?.token]); // Se añadió user?.token a las dependencias

  const handleDeleteProduct = async (productId: number) => {
    if (confirm(`¿Estás seguro de eliminar la publicación con ID: ${productId}?`)) {
      try {
        // Ensure user and token are available before making the request
        if (!user || !user.token) { // Direct access to user.token
          console.error("Authentication token is missing. Redirecting to login.");
          setErrorPublications("No autorizado: token de usuario no disponible.");
          navigate('/login');
          return;
        }

        const response = await fetch(`http://localhost:8080/api/publicaciones/delete?id=${productId}`, {
          method: 'DELETE',
          headers: getAuthHeader(),
        });
        if (!response.ok) {
          // Handle specific HTTP error codes from backend
          if (response.status === 401) {
            setErrorPublications("Tu sesión ha expirado. Por favor, vuelve a ingresar.");
            navigate('/login');
          } else if (response.status === 403) {
            setErrorPublications("No tienes permisos suficientes para realizar esta acción.");
          } else {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        }
        console.log('Eliminar publicación:', productId);
        alert(`Publicación ${productId} marcada como ELIMINADA por el administrador.`);
        // Re-fetch publications to update the table
        fetchPublications();
      } catch (error) {
        console.error("Error deleting publication:", error);
        setErrorPublications("Error al eliminar la publicación.");
      }
    }
  };
  

  useEffect(() => {
    if (activeTab === 'products') {
      fetchPublications();
    }
  }, [activeTab, user?.token]); // Se añadió user?.token a las dependencias

  const getPublicationStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'ACTIVA':
        return 'success';
      case 'PENDIENTE':
        return 'warning';
      case 'ELIMINADA':
        return 'destructive';
      default:
        return 'default';
    }
  };

  const getOperationBadge = (type: string) => {
    const variants = {
      DONACION: 'success' as const,
      ALQUILER: 'info' as const,
      VENTA: 'warning' as const,
    };
    return variants[type.toUpperCase() as keyof typeof variants] || 'default';
  };


  const handleDeleteUser = async (dni: number) => { 
    if (confirm(`¿Estás seguro de eliminar al usuario con DNI: ${dni}?`)) {
      try {
        if (!user || !user.token) { // Check if user or token is missing
          console.error("Authentication token is missing for deleting user.");
          setErrorUsers("No autorizado: token de usuario no disponible.");
          navigate('/login');
          return;
        }
        const response = await fetch(`http://localhost:8080/api/usuario/delete?dni=${dni}`, {
          method: 'DELETE',
          headers: getAuthHeader(),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        setBackendUsers((prevUsers) => prevUsers.filter((user) => user.dniUsuario !== dni));
        console.log('Eliminar usuario con DNI:', dni);
        alert(`Usuario con DNI ${dni} eliminado del sistema.`);
      } catch (error) {
        console.error("Error deleting user:", error);
        setErrorUsers("Error al eliminar el usuario.");
      }
    }
  };

  const handleResolveReport = (reportId: string) => {
    // usar reportId para evitar warning de variable no usada
    console.log('Resolver reporte:', reportId);
    alert(`Reporte ${reportId} marcado como resuelto.`);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Panel de Administración</h1>
            <p className="text-slate-600">Gestión completa de la plataforma MESU</p>
          </div>
          {activeTab === 'overview' && (
            <Button
              onClick={fetchOverviewData}
              disabled={loadingOverview}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <RefreshCcw className={`w-4 h-4 ${loadingOverview ? 'animate-spin' : ''}`} />
              Refrescar Vista
            </Button>
          )}
        </div>

        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
              activeTab === 'overview'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            Vista General
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
              activeTab === 'products'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            Productos
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
              activeTab === 'users'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            Usuarios
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
              activeTab === 'reports'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            Reportes ({metrics.reportesPendientes})
          </button>
        </div>

        {activeTab === 'overview' && (
          <>
            <div className={`grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 ${loadingOverview ? 'opacity-50 pointer-events-none' : ''}`}>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-slate-900">{metrics.usuariosTotales}</div>
                      <div className="text-sm text-slate-600 mt-1">Usuarios totales</div>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  {/* Tendencia de usuarios eliminada */}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-slate-900">{metrics.productosActivos}</div>
                      <div className="text-sm text-slate-600 mt-1">Productos activos</div>
                    </div>
                    <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                      <Package className="w-6 h-6 text-teal-600" />
                    </div>
                  </div>
                  {/* Tendencia de productos eliminada */}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-slate-900">{metrics.operacionesTotales}</div>
                      <div className="text-sm text-slate-600 mt-1">Operaciones</div>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                  {/* Tendencia de operaciones eliminada */}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-slate-900">{metrics.reportesPendientes}</div>
                      <div className="text-sm text-slate-600 mt-1">Reportes pendientes</div>
                    </div>
                    <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-amber-600" />
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-slate-500">Requieren atención</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Operaciones por mes
                  </h2>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={operationsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="name" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="operaciones" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Productos por categoría
                  </h2>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={categoriesData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoriesData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {activeTab === 'products' && (
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-slate-900">Gestión de Productos</h2>
            </CardHeader>
            <CardContent>
              {loadingPublications && <div className="text-center py-8 text-slate-600">Cargando publicaciones...</div>}
              {errorPublications && <div className="text-center py-8 text-red-600">{errorPublications}</div>}
              {!loadingPublications && !errorPublications && backendPublications.length === 0 && (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">No se encontraron publicaciones</h3>
                  <p className="text-slate-600">Intenta recargar la página o verifica la conexión con el backend.</p>
                </div>
              )}
              {!loadingPublications && !errorPublications && backendPublications.length > 0 && (
                <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">Título</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">Propietario</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">Tipo Insumo</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">Operación</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">Estado Publicación</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">Fecha Publicación</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">Monto</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {backendPublications.map((publication) => (
                      <tr key={publication.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4">
                          <div className="font-medium text-slate-900">{publication.titulo}</div>
                        </td>
                        <td className="py-3 px-4 text-slate-600">{publication.nombreUsuario} {publication.apellidoUsuario}</td>
                        <td className="py-3 px-4 text-slate-600">{publication.nombreTipoInsumo}</td>
                        <td className="py-3 px-4">
                          <Badge variant={getOperationBadge(publication.nombreTipoOperacion)}>
                            {publication.nombreTipoOperacion}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant={getPublicationStatusBadge(publication.nombreEstadoPublicacion) as any}>
                            {publication.nombreEstadoPublicacion}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-600">
                          {new Date(publication.fecha).toLocaleDateString('es-AR')}
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-900">
                          {publication.monto ? `$${publication.monto.toLocaleString()}` : 'Gratis'}
                          {publication.unidadTiempo && `/${publication.unidadTiempo}`}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => navigate(`/product/${publication.id}`)} // Assuming product detail page exists
                              className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded transition"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(publication.id)}
                              className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded transition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                  </div>
                )}
            </CardContent>
          </Card>
        )}

        {activeTab === 'users' && (
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-slate-900">Gestión de Usuarios</h2>
            </CardHeader>
            <CardContent>
              {loadingUsers && <div className="text-center py-8 text-slate-600">Cargando usuarios...</div>}
              {errorUsers && <div className="text-center py-8 text-red-600">{errorUsers}</div>}
              {!loadingUsers && !errorUsers && backendUsers.length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">No se encontraron usuarios</h3>
                  <p className="text-slate-600">Intenta recargar la página o verifica la conexión con el backend.</p>
                </div>
              )}
              {!loadingUsers && !errorUsers && backendUsers.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">Usuario</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">Email</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">Rol</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">Registro</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">Estado</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {backendUsers.map((user) => (
                        <tr key={user.idUsuario} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center text-white font-semibold">
                                {user.nombreUsuario.charAt(0)}
                              </div>
                              <div className="font-medium text-slate-900">{user.nombreUsuario} {user.apellidoUsuario}</div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-slate-600">{user.emailUsuario}</td>
                          <td className="py-3 px-4">
                            {user.usuarioRoles.map((ur, index) => (
                              <Badge key={index} variant={ur.rol.nombreRol === 'ADMIN' ? 'danger' : ur.rol.nombreRol === 'PROPIETARIO' ? 'info' : 'default'}>
                                {ur.rol.nombreRol}
                              </Badge>
                            ))}
                          </td>
                          <td className="py-3 px-4 text-sm text-slate-600">
                            {new Date(user.fechaHRegistroUsuario).toLocaleDateString('es-AR')}
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant={user.fechaHBajaUsuario ? 'danger' : 'success'}>
                              {user.fechaHBajaUsuario ? 'Inactivo' : 'Activo'}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => handleDeleteUser(user.dniUsuario)}
                              className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded transition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === 'reports' && (
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5" />
                Reportes y Moderación
              </h2>
            </CardHeader>
            <CardContent>
              {mockReports.length === 0 ? (
                <div className="text-center py-12">
                  <ShieldCheck className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">No hay reportes</h3>
                  <p className="text-slate-600">Todo está en orden</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {mockReports.map((report) => (
                    <div
                      key={report.id}
                      className={`p-4 rounded-lg border ${
                        report.status === 'pending'
                          ? 'bg-amber-50 border-amber-200'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge variant={report.status === 'pending' ? 'warning' : 'success'}>
                              {report.status === 'pending' ? 'Pendiente' : report.status === 'reviewed' ? 'Revisado' : 'Resuelto'}
                            </Badge>
                            <span className="text-sm text-slate-600">
                              {new Date(report.createdAt).toLocaleDateString('es-AR')}
                            </span>
                          </div>
                          <div className="font-medium text-slate-900 mb-1">
                            {report.reason}
                          </div>
                          <div className="text-sm text-slate-600 mb-2">
                            Reportado por: {report.reporterName}
                          </div>
                          <div className="text-sm text-slate-700">
                            {report.description}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {report.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleResolveReport(report.id)}
                                className="gap-2"
                              >
                                <CheckCircle className="w-4 h-4" />
                                Resolver
                              </Button>
                              <Button size="sm" variant="outline" className="gap-2">
                                <Eye className="w-4 h-4" />
                                Ver
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}