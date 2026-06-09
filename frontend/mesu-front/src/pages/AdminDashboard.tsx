import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import {
  Users,
  Package,
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

interface RolDTO {
  idRol: number;
  nombreRol: string;
  fechaAltaRol: string;
  fechaBajaRol: string | null;
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
  fechaHRegistroUsuario: string;
  fechaHBajaUsuario: string | null;
  usuarioRoles: UsuarioRolDTO[];
}

// --- INTERFACES DE REPORTES (Mapeadas directo desde Reporte.java) ---
interface UsuarioReporte {
  idUsuario: number;
  nombreUsuario: string;
  apellidoUsuario: string;
  emailUsuario: string;
}

interface PublicacionReportada {
  id: number;
  titulo: string;
}

interface ReporteBackend {
  id: number;                     // id_reporte
  fechaHoraReporte: string;       // LocalDate
  tipoReporte: string;            // Enum TipoReporte
  detalleReporte: string;         // varchar(512)
  usuarioReportante: UsuarioReporte;
  usuarioReportado: UsuarioReporte | null;
  publicacionInsumoReportada: PublicacionReportada | null;
}

// --- OTRAS INTERFACES DEL BACKEND ---
interface PublicacionInsumoResponseDTO {
  id: number;
  titulo: string;
  descripcion: string;
  fecha: string;
  nombreTipoOperacion: string;
  monto: number | null;
  unidadTiempo: string | null;
  nombreEstadoPublicacion: string;
  nombreEstadoInsumo: string;
  nombreTipoInsumo: string;
  nombreUsuario: string;
  apellidoUsuario: string;
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
  percentageActivos?: number; // Opcional por compatibilidad
}

export function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'users' | 'reports'>('overview');
  
  // --- ESTADOS PARA GUARDAR LOS DATOS REALES ---
  const [backendUsers, setBackendUsers] = useState<UsuarioDTO[]>([]);
  const [backendPublications, setBackendPublications] = useState<PublicacionInsumoResponseDTO[]>([]);
  const [backendReports, setBackendReports] = useState<ReporteBackend[]>([]);
  
  // --- ESTADOS DE PANTALLAS DE CARGA ---
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingPublications, setLoadingPublications] = useState(false);
  const [loadingReports, setLoadingReports] = useState(false);
  const [loadingOverview, setLoadingOverview] = useState(false);
  
  // --- ESTADOS DE MANEJO DE ERRORES ---
  const [errorPublications, setErrorPublications] = useState<string | null>(null);
  const [errorUsers, setErrorUsers] = useState<string | null>(null);
  const [errorReports, setErrorReportes] = useState<string | null>(null);

  const [metrics, setMetrics] = useState({ 
    usuariosTotales: 0, 
    productosActivos: 0, 
    operacionesTotales: 0, 
    reportesPendientes: 0,
  });
  const [operationsData, setOperationsData] = useState<any[]>([]);
  const [categoriesData, setCategoriesData] = useState<any[]>([]);

  // Función para obtener los encabezados de autenticación con el Token JWT
  const getAuthHeader = () => {
    const token = user?.token?.replace(/['"]+/g, '').trim();
    return { 'Authorization': `Bearer ${token}` };
  };

  // --- FUNCIONES QUE LLAMAN AL BACKEND (FETCH) ---
  
  const obtenerMetricas = async (): Promise<MetricasBackendDTO> => {
    const response = await fetch('http://localhost:8080/api/publicaciones/metricas', { headers: getAuthHeader() });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  };

  const obtenerOperacionesPorMes = async (): Promise<OperacionesMesBackendDTO> => {
    const response = await fetch('http://localhost:8080/api/publicaciones/meses', { headers: getAuthHeader() });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  };

  const obtenerProductosPorCategoria = async (): Promise<ProdCategoriaBackendDTO[]> => {
    const response = await fetch('http://localhost:8080/api/publicaciones/productos-categoria', { headers: getAuthHeader() }); 
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

  const fetchUsers = async () => {
    setLoadingUsers(true);
    setErrorUsers(null);
    try {
      if (!user?.token) {
        setErrorUsers("No autorizado: token no disponible.");
        navigate('/login');
        return;
      }
      const response = await fetch('http://localhost:8080/api/usuario', { headers: getAuthHeader() });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
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
      if (!user?.token) {
        setErrorPublications("No autorizado: token no disponible.");
        navigate('/login');
        return;
      }
      const response = await fetch('http://localhost:8080/api/publicaciones/obtenerPublicaciones', { headers: getAuthHeader() });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data: PublicacionInsumoResponseDTO[] = await response.json();
      setBackendPublications(data);
    } catch (error) {
      console.error("Error fetching publications:", error);
      setErrorPublications("Error al cargar las publicaciones.");
    } finally {
      setLoadingPublications(false);
    }
  };

  const fetchReports = async () => {
    setLoadingReports(true);
    setErrorReportes(null);
    try {
      if (!user?.token) {
        setErrorReportes("No autorizado: token no disponible.");
        navigate('/login');
        return;
      }
      const response = await fetch('http://localhost:8080/reportes', { headers: getAuthHeader() });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data: ReporteBackend[] = await response.json();
      setBackendReports(data);
    } catch (error) {
      console.error("Error fetching reports:", error);
      setErrorReportes("Error al cargar los reportes desde el backend.");
    } finally {
      setLoadingReports(false);
    }
  };

  // Controla qué datos buscar según la pestaña seleccionada
  useEffect(() => {
    if (activeTab === 'overview') fetchOverviewData();
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'products') fetchPublications();
    if (activeTab === 'reports') fetchReports();
  }, [activeTab, user?.token]);

  // --- ENLACES DE ACCIÓN CON EL BACKEND ---
  const handleDeleteProduct = async (productId: number) => {
    if (confirm(`¿Estás seguro de eliminar la publicación con ID: ${productId}?`)) {
      try {
        if (!user?.token) { navigate('/login'); return; }
        const response = await fetch(`http://localhost:8080/api/publicaciones/delete?id=${productId}`, {
          method: 'DELETE',
          headers: getAuthHeader(),
        });
        if (!response.ok) throw new Error(`Status: ${response.status}`);
        alert(`Publicación ${productId} eliminada.`);
        fetchPublications();
      } catch (error) {
        setErrorPublications("Error al eliminar la publicación.");
      }
    }
  };

  const handleDeleteUser = async (dni: number) => { 
    if (confirm(`¿Estás seguro de eliminar al usuario con DNI: ${dni}?`)) {
      try {
        if (!user?.token) { navigate('/login'); return; }
        const response = await fetch(`http://localhost:8080/api/usuario/delete?dni=${dni}`, {
          method: 'DELETE',
          headers: getAuthHeader(),
        });
        if (!response.ok) throw new Error(`Status: ${response.status}`);
        setBackendUsers((prev) => prev.filter((u) => u.dniUsuario !== dni));
        alert(`Usuario con DNI ${dni} eliminado con éxito.`);
      } catch (error) {
        setErrorUsers("Error al eliminar el usuario.");
      }
    }
  };

  const handleResolveReport = (reportId: number) => {
    console.log('Resolver reporte:', reportId);
    alert(`Reporte ${reportId} marcado localmente como atendido.`);
  };

  const COLORS = ['#3b82f6', '#14b8a6', '#8b5cf6', '#f59e0b', '#ef4444', '#6b7280'];
  
  const getPublicationStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'ACTIVA': return 'success';
      case 'PENDIENTE': return 'warning';
      case 'ELIMINADA': return 'destructive';
      default: return 'default';
    }
  };

  const getOperationBadge = (type: string) => {
    const variants = { DONACION: 'success' as const, ALQUILER: 'info' as const, VENTA: 'warning' as const };
    return variants[type?.toUpperCase() as keyof typeof variants] || 'default';
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

        {/* NAVEGACIÓN DE PESTAÑAS */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {['overview', 'products', 'users', 'reports'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 rounded-lg font-medium capitalize whitespace-nowrap transition ${
                activeTab === tab ? 'bg-blue-600 text-white' : 'bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              {tab === 'overview' ? 'Vista General' : tab === 'products' ? 'Productos' : tab === 'users' ? 'Usuarios' : `Reportes (${metrics.reportesPendientes})`}
            </button>
          ))}
        </div>

        {/* --- VISTA GENERAL --- */}
        {activeTab === 'overview' && (
          <>
            <div className={`grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 ${loadingOverview ? 'opacity-50 pointer-events-none' : ''}`}>
              <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><div className="text-2xl font-bold text-slate-900">{metrics.usuariosTotales}</div><div className="text-sm text-slate-600 mt-1">Usuarios totales</div></div><div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"><Users className="w-6 h-6 text-blue-600" /></div></div></CardContent></Card>
              <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><div className="text-2xl font-bold text-slate-900">{metrics.productosActivos}</div><div className="text-sm text-slate-600 mt-1">Productos activos</div></div><div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center"><Package className="w-6 h-6 text-teal-600" /></div></div></CardContent></Card>
              <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><div className="text-2xl font-bold text-slate-900">{metrics.operacionesTotales}</div><div className="text-sm text-slate-600 mt-1">Operaciones</div></div><div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center"><DollarSign className="w-6 h-6 text-purple-600" /></div></div></CardContent></Card>
              <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><div className="text-2xl font-bold text-slate-900">{metrics.reportesPendientes}</div><div className="text-sm text-slate-600 mt-1">Reportes pendientes</div></div><div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center"><AlertTriangle className="w-6 h-6 text-amber-600" /></div></div></CardContent></Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader><h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2"><BarChart3 className="w-5 h-5" />Operaciones por mes</h2></CardHeader>
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
                <CardHeader><h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2"><Package className="w-5 h-5" />Productos por categoría</h2></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie data={categoriesData} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`} outerRadius={80} fill="#8884d8" dataKey="value">
                        {categoriesData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
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

        {/* --- PESTAÑA PRODUCTOS --- */}
        {activeTab === 'products' && (
          <Card>
            <CardHeader><h2 className="text-xl font-semibold text-slate-900">Gestión de Productos</h2></CardHeader>
            <CardContent>
              {loadingPublications && <div className="text-center py-8 text-slate-600">Cargando publicaciones...</div>}
              {errorPublications && <div className="text-center py-8 text-red-600">{errorPublications}</div>}
              {!loadingPublications && !errorPublications && backendPublications.length === 0 && (
                <div className="text-center py-12"><Package className="w-16 h-16 text-slate-300 mx-auto mb-4" /><h3 className="text-lg font-medium text-slate-900 mb-2">No se encontraron publicaciones</h3></div>
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
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">Estado</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">Fecha</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">Monto</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {backendPublications.map((pub) => (
                        <tr key={pub.id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="py-3 px-4 font-medium text-slate-900">{pub.titulo}</td>
                          <td className="py-3 px-4 text-slate-600">{pub.nombreUsuario} {pub.apellidoUsuario}</td>
                          <td className="py-3 px-4 text-slate-600">{pub.nombreTipoInsumo}</td>
                          <td className="py-3 px-4"><Badge variant={getOperationBadge(pub.nombreTipoOperacion)}>{pub.nombreTipoOperacion}</Badge></td>
                          <td className="py-3 px-4"><Badge variant={getPublicationStatusBadge(pub.nombreEstadoPublicacion) as any}>{pub.nombreEstadoPublicacion}</Badge></td>
                          <td className="py-3 px-4 text-sm text-slate-600">{new Date(pub.fecha).toLocaleDateString('es-AR')}</td>
                          <td className="py-3 px-4 font-medium text-slate-900">{pub.monto ? `$${pub.monto.toLocaleString()}` : 'Gratis'}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <button onClick={() => navigate(`/product/${pub.id}`)} className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded transition"><Eye className="w-4 h-4" /></button>
                              <button onClick={() => handleDeleteProduct(pub.id)} className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded transition"><Trash2 className="w-4 h-4" /></button>
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

        {/* --- PESTAÑA USUARIOS --- */}
        {activeTab === 'users' && (
          <Card>
            <CardHeader><h2 className="text-xl font-semibold text-slate-900">Gestión de Usuarios</h2></CardHeader>
            <CardContent>
              {loadingUsers && <div className="text-center py-8 text-slate-600">Cargando usuarios...</div>}
              {errorUsers && <div className="text-center py-8 text-red-600">{errorUsers}</div>}
              {!loadingUsers && !errorUsers && backendUsers.length === 0 && (
                <div className="text-center py-12"><Users className="w-16 h-16 text-slate-300 mx-auto mb-4" /><h3 className="text-lg font-medium text-slate-900 mb-2">No se encontraron usuarios</h3></div>
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
                      {backendUsers.map((bUser) => (
                        <tr key={bUser.idUsuario} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center text-white font-semibold">
                                {bUser.nombreUsuario?.charAt(0)}
                              </div>
                              <div className="font-medium text-slate-900">{bUser.nombreUsuario} {bUser.apellidoUsuario}</div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-slate-600">{bUser.emailUsuario}</td>
                          <td className="py-3 px-4">
                            {bUser.usuarioRoles?.map((ur, idx) => (
                              <Badge key={idx} variant={ur.rol.nombreRol === 'ADMIN' ? 'danger' : ur.rol.nombreRol === 'PROPIETARIO' ? 'info' : 'default'}>
                                {ur.rol.nombreRol}
                              </Badge>
                            ))}
                          </td>
                          <td className="py-3 px-4 text-sm text-slate-600">{new Date(bUser.fechaHRegistroUsuario).toLocaleDateString('es-AR')}</td>
                          <td className="py-3 px-4">
                            <Badge variant={bUser.fechaHBajaUsuario ? 'danger' : 'success'}>
                              {bUser.fechaHBajaUsuario ? 'Inactivo' : 'Activo'}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <button onClick={() => handleDeleteUser(bUser.dniUsuario)} className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded transition"><Trash2 className="w-4 h-4" /></button>
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

        {/* --- PESTAÑA REPORTES --- */}
        {activeTab === 'reports' && (
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5" /> Reportes y Moderación
              </h2>
            </CardHeader>
            <CardContent>
              {loadingReports && <div className="text-center py-8 text-slate-600">Cargando reportes...</div>}
              {errorReports && <div className="text-center py-8 text-red-600">{errorReports}</div>}
              {!loadingReports && !errorReports && backendReports.length === 0 ? (
                <div className="text-center py-12">
                  <ShieldCheck className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">No hay reportes</h3>
                  <p className="text-slate-600">Todo marcha perfecto en el sistema.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {backendReports.map((report) => (
                    <div key={report.id} className="p-4 rounded-lg border bg-amber-50 border-amber-200">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge variant="warning">{report.tipoReporte}</Badge>
                            <span className="text-sm text-slate-600">
                              {report.fechaHoraReporte ? new Date(report.fechaHoraReporte).toLocaleDateString('es-AR') : 'Sin fecha'}
                            </span>
                          </div>
                          
                          <div className="font-medium text-slate-900 mb-1">{report.detalleReporte}</div>
                          
                          {report.publicacionInsumoReportada && (
                            <div className="text-xs text-blue-700 font-semibold mb-1">
                              Publicación Afectada: {report.publicacionInsumoReportada.titulo} (ID: {report.publicacionInsumoReportada.id})
                            </div>
                          )}
                          {report.usuarioReportado && (
                            <div className="text-xs text-purple-700 font-semibold mb-1">
                              Usuario Reportado: {report.usuarioReportado.nombreUsuario} {report.usuarioReportado.apellidoUsuario}
                            </div>
                          )}
                          
                          <div className="text-sm text-slate-600 mt-2">
                            Reportado por: {report.usuarioReportante?.nombreUsuario} {report.usuarioReportante?.apellidoUsuario} ({report.usuarioReportante?.emailUsuario})
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleResolveReport(report.id)} className="gap-2 bg-white hover:bg-emerald-50 hover:text-emerald-700">
                            <CheckCircle className="w-4 h-4" /> Resolver
                          </Button>
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