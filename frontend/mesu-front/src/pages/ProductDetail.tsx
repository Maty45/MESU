import { useParams, useNavigate } from 'react-router-dom';
import { mockProducts, categoryLabels, operationTypeLabels, conditionLabels } from '../data/mockData';
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
import { useState } from 'react';

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [showContactModal, setShowContactModal] = useState(false);
  const [message, setMessage] = useState('');
  const [showConfirmReportModal, setShowConfirmReportModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');

  const product = mockProducts.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Producto no encontrado</h2>
          <Button onClick={() => navigate('/marketplace')}>Volver al Marketplace</Button>
        </div>
      </div>
    );
  }

  const handleContact = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setShowContactModal(true);
  };

  const handleSendMessage = () => {
    alert('Mensaje enviado al propietario. Recibirás una respuesta pronto.');
    setShowContactModal(false);
    setMessage('');
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
              <img
                src={product.images[0]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition">
                <Heart className="w-4 h-4" />
                Guardar
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition">
                <Share2 className="w-4 h-4" />
                Compartir
              </button>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <Badge variant={product.operationType === 'donation' ? 'success' : product.operationType === 'rental' ? 'info' : 'warning'} className="mb-3">
                    {operationTypeLabels[product.operationType ?? 'sale']}
                  </Badge>
                  <h1 className="text-3xl font-bold text-slate-900 mb-2">{product.title}</h1>
                  <div className="flex items-center gap-4 text-sm text-slate-600">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {product.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(product.createdAt).toLocaleDateString('es-AR')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t border-b border-slate-200 py-4 my-6">
                {product.operationType === 'donation' ? (
                  <div className="text-3xl font-bold text-green-600">Gratis</div>
                ) : product.operationType === 'rental' ? (
                  <div>
                    <div className="text-3xl font-bold text-blue-600">${product.pricePerDay}</div>
                    <div className="text-sm text-slate-600 mt-1">por día</div>
                  </div>
                ) : (
                  <div className="text-3xl font-bold text-purple-600">${product.price?.toLocaleString()}</div>
                )}
              </div>

              <h2 className="font-semibold text-slate-900 mb-2">Descripción</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">{product.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <div className="text-sm text-slate-500 mb-1">Categoría</div>
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-slate-400" />
                    <span className="font-medium text-slate-900">{categoryLabels[product.category]}</span>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-slate-500 mb-1">Estado</div>
                  <span className="font-medium text-slate-900">{conditionLabels[product.condition ?? 'good']}</span>
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
                    {product.ownerName.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">{product.ownerName}</div>
                    <div className="text-sm text-slate-500">Propietario verificado</div>
                  </div>
                </div>
                <div className="text-sm text-slate-600">
                  Miembro desde 2025 • 12 productos publicados
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {showContactModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Contactar al propietario</h2>
            <p className="text-slate-600 mb-4">
              Envía un mensaje a {product.ownerName} sobre "{product.title}"
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
            <p className="text-slate-600 mb-4">{product.title}</p>
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
    </div>
  );
}
