import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { mockProducts, mockOperations, mockReports, categoryLabels, type ProductCategory } from '../data/mockData';
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
  DollarSign,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'; // Import useEffect
import { useEffect } from 'react';

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

export function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'users' | 'reports'>('overview');
  const [backendUsers, setBackendUsers] = useState<UsuarioDTO[]>([]); // State to store fetched users
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [errorUsers, setErrorUsers] = useState<string | null>(null);

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

  const totalUsers = backendUsers.length; // Use fetched users count
  const totalProducts = mockProducts.length;
  const totalOperations = mockOperations.length;
  const pendingReports = mockReports.filter((r) => r.status === 'pending').length;

  const categoriesData = (Object.keys(categoryLabels) as ProductCategory[]).map((key) => ({
    name: categoryLabels[key],
    value: mockProducts.filter((p) => p.category === key).length,
  }));

  const operationsData = [
    { name: 'Ene', operaciones: 12 },
    { name: 'Feb', operaciones: 19 },
    { name: 'Mar', operaciones: 25 },
    { name: 'Abr', operaciones: 31 },
    { name: 'May', operaciones: 28 },
  ];

  const COLORS = ['#3b82f6', '#14b8a6', '#8b5cf6', '#f59e0b', '#ef4444', '#6b7280'];

  const fetchUsers = async () => {
    setLoadingUsers(true);
    setErrorUsers(null);
    try {
      const response = await fetch('http://localhost:8080/api/usuario'); // Assuming backend runs on 8080
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

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab]);

  const handleDeleteProduct = (productId: string) => {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      // usar productId para evitar warning de variable no usada
      console.log('Eliminar producto:', productId);
      alert(`Producto ${productId} eliminado por el administrador.`);
    }
  };


  const handleDeleteUser = async (dni: number) => { 
    if (confirm(`¿Estás seguro de eliminar al usuario con DNI: ${dni}?`)) {
      try {
        const response = await fetch(`http://localhost:8080/api/usuario/delete?dni=${dni}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        setBackendUsers((prevUsers) => prevUsers.filter((user) => user.dniUsuario !== dni));
      } catch (error) {
        console.error("Error deleting user:", error);
        setErrorUsers("Error al eliminar el usuario.");
      }

      console.log('Eliminar usuario con DNI:', dni);
      alert(`Usuario con DNI ${dni} eliminado del sistema.`);
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Panel de Administración</h1>
          <p className="text-slate-600">Gestión completa de la plataforma MESU</p>
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
            Reportes ({pendingReports})
          </button>
        </div>

        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-slate-900">{totalUsers}</div>
                      <div className="text-sm text-slate-600 mt-1">Usuarios totales</div>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-center text-sm text-green-600">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +12% este mes
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-slate-900">{totalProducts}</div>
                      <div className="text-sm text-slate-600 mt-1">Productos activos</div>
                    </div>
                    <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                      <Package className="w-6 h-6 text-teal-600" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-center text-sm text-green-600">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +8% este mes
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-slate-900">{totalOperations}</div>
                      <div className="text-sm text-slate-600 mt-1">Operaciones</div>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-center text-sm text-green-600">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +15% este mes
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-slate-900">{pendingReports}</div>
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
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">Producto</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">Propietario</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">Categoría</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">Estado</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">Fecha</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockProducts.map((product) => (
                      <tr key={product.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={product.images[0]}
                              alt={product.title}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                            <div className="font-medium text-slate-900">{product.title}</div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-600">{product.ownerName}</td>
                        <td className="py-3 px-4 text-slate-600">{categoryLabels[product.category]}</td>
                        <td className="py-3 px-4">
                          <Badge variant={product.status === 'available' ? 'success' : 'default'}>
                            {product.status === 'available' ? 'Disponible' : product.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-600">
                          {new Date(product.createdAt).toLocaleDateString('es-AR')}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => navigate(`/product/${product.id}`)}
                              className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded transition"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
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
