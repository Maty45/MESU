import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { publicacionInsumoService } from '../services/publicacionInsumoService';
import type { PublicacionInsumoResponse } from '../types/publicacionInsumo';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { useAuth } from '../context/AuthContext';
import {
  MapPin,
  User,
  Calendar,
  Package,
  MessageCircle,
  Flag,
  ArrowLeft,
  Heart,
  Share2,
} from 'lucide-react';

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [product, setProduct] = useState<PublicacionInsumoResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showContactModal, setShowContactModal] = useState(false);
  const [message, setMessage] = useState('');
  const [showConfirmReportModal, setShowConfirmReportModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');

  // Estados de Administrar Publicación
  const [interacciones, setInteracciones] = useState<any[]>([]);
  const [loadingInteracciones, setLoadingInteracciones] = useState(false);
  const [selectedInteraccion, setSelectedInteraccion] = useState<any | null>(null);
  
  // Modales de Operación
  const [showAlquilerModal, setShowAlquilerModal] = useState(false);
  const [showDevolucionModal, setShowDevolucionModal] = useState(false);
  const [showConcretarConfirmModal, setShowConcretarConfirmModal] = useState(false);

  // Campos de formulario
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHastaAcordada, setFechaHastaAcordada] = useState('');
  const [montoAcordado, setMontoAcordado] = useState(0);
  const [fechaDevolucion, setFechaDevolucion] = useState('');
  const [concrecionType, setConcrecionType] = useState<'VENTA' | 'DONACION' | null>(null);

  const isOwner = user && product && (
    product.nombreUsuario && product.apellidoUsuario
      ? `${product.nombreUsuario} ${product.apellidoUsuario}`.trim().toLowerCase() === user.name.trim().toLowerCase()
      : false
  );

  useEffect(() => {
    if (id) {
      fetchProduct(parseInt(id));
    }
  }, [id]);

  useEffect(() => {
    if (id && isOwner) {
      fetchInteracciones(parseInt(id));
    }
  }, [id, isOwner]);

  const fetchProduct = async (productId: number) => {
    try {
      setLoading(true);
      const data = await publicacionInsumoService.getById(productId);
      setProduct(data);
      setError(null);
    } catch (err: any) {
      console.error('Error al cargar la publicación en detalle:', err);
      setError('Producto no encontrado');
    } finally {
      setLoading(false);
    }
  };

  const fetchInteracciones = async (productId: number) => {
    try {
      setLoadingInteracciones(true);
      const data = await publicacionInsumoService.getInteracciones(productId);
      setInteracciones(data);
    } catch (err: any) {
      console.error('Error al cargar interacciones:', err);
    } finally {
      setLoadingInteracciones(false);
    }
  };

  const handleContact = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setShowContactModal(true);
  };

  const handleSendMessage = async () => {
    if (!product) return;
    try {
      await publicacionInsumoService.registrarContacto(product.id);
      alert(`Contacto registrado. Mensaje enviado al propietario. Recibirás una respuesta pronto.`);
      setShowContactModal(false);
      setMessage('');
    } catch (err: any) {
      alert('Error al registrar el contacto: ' + err.message);
    }
  };

  const handleRegistrarAlquilerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInteraccion) return;
    try {
      await publicacionInsumoService.concretarInteraccion(selectedInteraccion.idPII, {
        tipoInteraccionConcretada: 'ALQUILER',
        fechaDesde,
        fechaHastaAcordada,
        montoAcordado
      });
      alert('Alquiler registrado con éxito. El insumo ahora está alquilado.');
      setShowAlquilerModal(false);
      if (id) {
        fetchProduct(parseInt(id));
        fetchInteracciones(parseInt(id));
      }
    } catch (err: any) {
      alert('Error al registrar alquiler: ' + err.message);
    }
  };

  const handleRegistrarDevolucionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    try {
      await publicacionInsumoService.registrarDevolucion(product.id, {
        fechaDevolucion: fechaDevolucion || null
      });
      alert('Devolución registrada con éxito. La publicación vuelve a estar activa.');
      setShowDevolucionModal(false);
      if (id) {
        fetchProduct(parseInt(id));
        fetchInteracciones(parseInt(id));
      }
    } catch (err: any) {
      alert('Error al registrar devolución: ' + err.message);
    }
  };

  const handleConcretarConfirmSubmit = async () => {
    if (!selectedInteraccion || !concrecionType) return;
    try {
      await publicacionInsumoService.concretarInteraccion(selectedInteraccion.idPII, {
        tipoInteraccionConcretada: concrecionType
      });
      alert(`${concrecionType === 'VENTA' ? 'Venta' : 'Donación'} registrada con éxito. La publicación ha finalizado.`);
      setShowConcretarConfirmModal(false);
      if (id) {
        fetchProduct(parseInt(id));
        fetchInteracciones(parseInt(id));
      }
    } catch (err: any) {
      alert(`Error al registrar ${concrecionType === 'VENTA' ? 'venta' : 'donación'}: ` + err.message);
    }
  };

  const handleReport = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setShowConfirmReportModal(true);
  };

  const handleConfirmReport = () => {
    setShowConfirmReportModal(false);
    setShowReportModal(true);
  };

  const handleCancelReport = () => {
    setShowConfirmReportModal(false);
  };

  const handleSubmitReport = () => {
    alert('Reporte enviado. Nuestro equipo lo revisará pronto.');
    setShowReportModal(false);
    setReportReason('');
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50">
        <div className="text-slate-500 font-medium">Cargando producto...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Producto no encontrado</h2>
          <Button onClick={() => navigate('/marketplace')}>Volver al Marketplace</Button>
        </div>
      </div>
    );
  }

  const isDonation = product.nombreTipoOperacion.toUpperCase().includes('DONACION');
  const isRental = product.nombreTipoOperacion.toUpperCase().includes('ALQUILER');

  const ownerName = product.nombreUsuario && product.apellidoUsuario
    ? `${product.nombreUsuario} ${product.apellidoUsuario}`
    : 'Usuario MESU';



  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/marketplace')}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al marketplace
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="aspect-square bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 mb-4">
              {product.urlsImagenes && product.urlsImagenes.length > 0 ? (
                <img
                  src={product.urlsImagenes[0]}
                  alt={product.titulo}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  Sin Imagen
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition font-medium text-slate-700">
                <Heart className="w-4 h-4" />
                Guardar
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition font-medium text-slate-700">
                <Share2 className="w-4 h-4" />
                Compartir
              </button>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <Badge variant={isDonation ? 'success' : isRental ? 'info' : 'warning'} className="mb-3">
                    {product.nombreTipoOperacion}
                  </Badge>
                  <h1 className="text-3xl font-bold text-slate-900 mb-2">{product.titulo}</h1>
                  <div className="flex items-center gap-4 text-sm text-slate-600">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {product.direccion}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(product.fecha).toLocaleDateString('es-AR')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t border-b border-slate-200 py-4 my-6">
                {isDonation ? (
                  <div className="text-3xl font-bold text-green-600">Gratis</div>
                ) : isRental ? (
                  <div>
                    <div className="text-3xl font-bold text-blue-600">${product.monto}</div>
                    <div className="text-sm text-slate-600 mt-1">por {product.unidadTiempo?.toLowerCase() || 'día'}</div>
                  </div>
                ) : (
                  <div className="text-3xl font-bold text-purple-600">${product.monto?.toLocaleString()}</div>
                )}
              </div>

              <h2 className="font-semibold text-slate-900 mb-2">Descripción</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">{product.descripcion}</p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <div className="text-sm text-slate-500 mb-1">Categoría</div>
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-slate-400" />
                    <span className="font-medium text-slate-900">{product.nombreTipoInsumo}</span>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-slate-500 mb-1">Estado</div>
                  <span className="font-medium text-slate-900">{product.nombreEstadoInsumo}</span>
                </div>
              </div>

              <div className="space-y-3">
                <Button onClick={handleContact} className="w-full gap-2" size="lg">
                  <MessageCircle className="w-5 h-5" />
                  Contactar al propietario
                </Button>
                <button
                  onClick={handleReport}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition"
                >
                  <Flag className="w-4 h-4" />
                  Reportar publicación
                </button>
              </div>
            </div>

            <Card>
              <CardHeader>
                <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Información del propietario
                </h3>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {ownerName.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">{ownerName}</div>
                    <div className="text-sm text-slate-500">Propietario verificado</div>
                  </div>
                </div>
                <div className="text-sm text-slate-600">
                  Miembro de MESU • Productos ortopédicos verificados
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Panel de administración */}
        {isOwner && (
          <div className="mt-8">
            <Card className="border-slate-200">
              <CardHeader className="bg-slate-50 border-b border-slate-200 py-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                      <Package className="w-5 h-5 text-blue-600" />
                      Administración de la Publicación
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">Gestioná las interacciones y el estado del insumo</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-500">Estado publicación:</span>
                    <Badge variant={
                      product.nombreEstadoPublicacion.toUpperCase() === 'ACTIVA' ? 'success' :
                      product.nombreEstadoPublicacion.toUpperCase() === 'ALQUILADA' ? 'info' : 'warning'
                    }>
                      {product.nombreEstadoPublicacion}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {loadingInteracciones ? (
                  <div className="text-center py-6 text-slate-500">Cargando interacciones...</div>
                ) : (
                  <div>
                    <h4 className="font-medium text-slate-900 mb-4 flex items-center gap-2">
                      Historial de Interacciones 
                      {product.nombreEstadoPublicacion.toUpperCase() === 'ALQUILADA' && (
                        <span className="text-sm font-normal text-slate-500">(Mostrando alquileres activos)</span>
                      )}
                    </h4>
                    
                    {(() => {
                      const displayed = product.nombreEstadoPublicacion.toUpperCase() === 'ALQUILADA'
                        ? interacciones.filter(i => i.nombreTipoInteraccion.toUpperCase() === 'ALQUILER')
                        : interacciones;

                      if (displayed.length === 0) {
                        return (
                          <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                            <User className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                            <p className="text-slate-600 font-medium">No hay interacciones registradas aún</p>
                            <p className="text-sm text-slate-500 mt-1">Las consultas de los clientes aparecerán en este panel.</p>
                          </div>
                        );
                      }

                      return (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-sm text-slate-600 border-collapse">
                            <thead>
                              <tr className="border-b border-slate-200 text-slate-700 bg-slate-50 font-semibold">
                                <th className="py-3 px-4">Fecha y Hora</th>
                                <th className="py-3 px-4">Cliente</th>
                                <th className="py-3 px-4">Contacto</th>
                                <th className="py-3 px-4">Tipo</th>
                                <th className="py-3 px-4">Detalle Operación</th>
                                <th className="py-3 px-4 text-right">Operaciones</th>
                              </tr>
                            </thead>
                            <tbody>
                              {displayed.map((i) => {
                                const isContacto = i.nombreTipoInteraccion.toUpperCase() === 'CONTACTO';
                                const isAlquiler = i.nombreTipoInteraccion.toUpperCase() === 'ALQUILER';
                                const isDevolucion = i.nombreTipoInteraccion.toUpperCase() === 'DEVOLUCION';
                                const isVenta = i.nombreTipoInteraccion.toUpperCase() === 'VENTA';
                                const isDonacion = i.nombreTipoInteraccion.toUpperCase() === 'DONACION';
                                
                                return (
                                  <tr key={i.idPII} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                                    <td className="py-4 px-4 font-medium text-slate-900">
                                      {new Date(i.fechaHPII).toLocaleString('es-AR')}
                                    </td>
                                    <td className="py-4 px-4">
                                      <div className="font-semibold text-slate-900">
                                        {i.nombreUsuarioCliente} {i.apellidoUsuarioCliente}
                                      </div>
                                      <div className="text-xs text-slate-500">{i.emailUsuarioCliente}</div>
                                    </td>
                                    <td className="py-4 px-4">
                                      <a
                                        href={`https://wa.me/${i.telefonoUsuarioCliente}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-emerald-600 hover:text-emerald-700 font-medium inline-flex items-center gap-1 hover:underline"
                                      >
                                        <MessageCircle className="w-4 h-4" />
                                        WhatsApp
                                      </a>
                                    </td>
                                    <td className="py-4 px-4">
                                      <Badge variant={
                                        isContacto ? 'default' :
                                        isAlquiler ? 'info' :
                                        isDevolucion ? 'success' :
                                        isVenta ? 'warning' : 'success'
                                      }>
                                        {i.nombreTipoInteraccion}
                                      </Badge>
                                    </td>
                                    <td className="py-4 px-4 text-xs text-slate-500">
                                      {isAlquiler && (
                                        <div>
                                          <div>Desde: {new Date(i.fechaDesdeAI).toLocaleDateString('es-AR')}</div>
                                          <div>Hasta: {new Date(i.fechaHastaAcordadaAI).toLocaleDateString('es-AR')}</div>
                                          {i.fechaHastaRealAI && (
                                            <div className="text-green-600 font-medium">Devuelto: {new Date(i.fechaHastaRealAI).toLocaleDateString('es-AR')}</div>
                                          )}
                                          <div className="font-medium text-slate-900 mt-1">Monto: ${i.montoAcordadoAI}</div>
                                        </div>
                                      )}
                                      {isDevolucion && (
                                        <div>
                                          <div>Devolución registrada</div>
                                          {i.fechaHastaRealAI && (
                                            <div>Fecha: {new Date(i.fechaHastaRealAI).toLocaleDateString('es-AR')}</div>
                                          )}
                                        </div>
                                      )}
                                      {(isVenta || isDonacion) && <div>Operación finalizada</div>}
                                      {isContacto && <div>En espera de concreción</div>}
                                    </td>
                                    <td className="py-4 px-4 text-right">
                                      {isContacto && product.nombreEstadoPublicacion.toUpperCase() === 'ACTIVA' && (
                                        <div className="flex justify-end gap-2">
                                          {product.nombreTipoOperacion.toUpperCase() === 'ALQUILER' && (
                                            <Button
                                              size="sm"
                                              onClick={() => {
                                                setSelectedInteraccion(i);
                                                setFechaDesde(new Date().toISOString().split('T')[0]);
                                                setFechaHastaAcordada('');
                                                setMontoAcordado(product.monto || 0);
                                                setShowAlquilerModal(true);
                                              }}
                                            >
                                              Registrar alquiler
                                            </Button>
                                          )}
                                          {product.nombreTipoOperacion.toUpperCase() === 'VENTA' && (
                                            <Button
                                              size="sm"
                                              variant="secondary"
                                              onClick={() => {
                                                setSelectedInteraccion(i);
                                                setConcrecionType('VENTA');
                                                setShowConcretarConfirmModal(true);
                                              }}
                                            >
                                              Registrar venta
                                            </Button>
                                          )}
                                          {product.nombreTipoOperacion.toUpperCase() === 'DONACION' && (
                                            <Button
                                              size="sm"
                                              className="bg-green-600 hover:bg-green-700 text-white"
                                              onClick={() => {
                                                setSelectedInteraccion(i);
                                                setConcrecionType('DONACION');
                                                setShowConcretarConfirmModal(true);
                                              }}
                                            >
                                              Registrar donación
                                            </Button>
                                          )}
                                        </div>
                                      )}
                                      {isAlquiler && product.nombreEstadoPublicacion.toUpperCase() === 'ALQUILADA' && !i.fechaHastaRealAI && (
                                        <Button
                                          size="sm"
                                          className="bg-amber-600 hover:bg-amber-700 text-white"
                                          onClick={() => {
                                            setSelectedInteraccion(i);
                                            setFechaDevolucion(new Date().toISOString().split('T')[0]);
                                            setShowDevolucionModal(true);
                                          }}
                                        >
                                          Registrar devolución
                                        </Button>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {showContactModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Contactar al propietario</h2>
            <p className="text-slate-600 mb-4">
              Envía un mensaje a {ownerName} sobre "{product.titulo}"
            </p>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Escribe tu mensaje aquí..."
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 min-h-32"
            />
            <div className="flex gap-3">
              <Button onClick={() => setShowContactModal(false)} variant="outline" className="flex-1">
                Cancelar
              </Button>
              <Button onClick={handleSendMessage} className="flex-1">
                Enviar mensaje
              </Button>
            </div>
          </div>
        </div>
      )}

      {showConfirmReportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
              ¿Desea reportar esta publicación?
            </h2>
            <div className="flex gap-3">
              <button
                onClick={handleCancelReport}
                className="flex-1 bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-500 transition-colors"
              >
                NO
              </button>
              <button
                onClick={handleConfirmReport}
                className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                SI
              </button>
            </div>
          </div>
        </div>
      )}

      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Reportar Publicación</h2>
            <p className="text-slate-600 mb-4">{product.titulo}</p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Ingrese aquí la razón de su reporte
              </label>
              <textarea
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder="Describe el motivo del reporte..."
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-32"
              />
            </div>
            <div className="flex gap-3">
              <Button onClick={() => setShowReportModal(false)} variant="outline" className="flex-1">
                Cancelar
              </Button>
              <Button onClick={handleSubmitReport} className="flex-1">
                Enviar reporte
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Registrar Alquiler */}
      {showAlquilerModal && selectedInteraccion && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <form onSubmit={handleRegistrarAlquilerSubmit} className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Registrar Alquiler</h2>
            <p className="text-sm text-slate-500 mb-4">
              Cliente: {selectedInteraccion.nombreUsuarioCliente} {selectedInteraccion.apellidoUsuarioCliente}
            </p>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Fecha Desde</label>
                <input
                  type="date"
                  required
                  value={fechaDesde}
                  onChange={(e) => setFechaDesde(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Fecha Hasta Acordada</label>
                <input
                  type="date"
                  required
                  value={fechaHastaAcordada}
                  onChange={(e) => setFechaHastaAcordada(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Monto Acordado ($)</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={montoAcordado}
                  onChange={(e) => setMontoAcordado(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button type="button" onClick={() => setShowAlquilerModal(false)} variant="outline" className="flex-1">
                Cancelar
              </Button>
              <Button type="submit" className="flex-1">
                Registrar Alquiler
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Modal para Registrar Devolución */}
      {showDevolucionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <form onSubmit={handleRegistrarDevolucionSubmit} className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Registrar Devolución</h2>
            <p className="text-sm text-slate-500 mb-4">
              Registrá el retorno del producto ortopédico.
            </p>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-1">Fecha de Devolución Real</label>
              <input
                type="date"
                required
                value={fechaDevolucion}
                onChange={(e) => setFechaDevolucion(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex gap-3">
              <Button type="button" onClick={() => setShowDevolucionModal(false)} variant="outline" className="flex-1">
                Cancelar
              </Button>
              <Button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white flex-1">
                Registrar Devolución
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Confirmación de Venta / Donación */}
      {showConcretarConfirmModal && selectedInteraccion && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Confirmar Concreción</h2>
            <p className="text-slate-600 mb-6">
              ¿Confirmas que concretaste la {concrecionType === 'VENTA' ? 'venta' : 'donación'} con{' '}
              <span className="font-semibold text-slate-900">
                {selectedInteraccion.nombreUsuarioCliente} {selectedInteraccion.apellidoUsuarioCliente}
              </span>
              ? Esta acción finalizará la publicación.
            </p>
            
            <div className="flex gap-3">
              <Button onClick={() => setShowConcretarConfirmModal(false)} variant="outline" className="flex-1">
                Cancelar
              </Button>
              <Button
                onClick={handleConcretarConfirmSubmit}
                className={`flex-1 text-white ${
                  concrecionType === 'VENTA' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                Confirmar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
