import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Edit2 } from 'lucide-react';

export function AccountSettings() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editField, setEditField] = useState('');
  const [editValue, setEditValue] = useState('');

  const [accountData, setAccountData] = useState({
    dni: '12345678',
    nombre: user?.name.split(' ')[0] || 'Juan',
    apellido: user?.name.split(' ').slice(1).join(' ') || 'Pérez',
    email: user?.email || 'usuario@email.com',
    telefono: '+54 9 11 1234-5678',
  });

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const handleEdit = (field: string) => {
    setEditField(field);
    setEditValue(accountData[field as keyof typeof accountData]);
    setShowEditModal(true);
  };

  const handleConfirmEdit = () => {
    setAccountData({
      ...accountData,
      [editField]: editValue,
    });
    setShowEditModal(false);
    setEditField('');
    setEditValue('');
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    setEditField('');
    setEditValue('');
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    alert('Cuenta eliminada exitosamente');
    navigate('/login');
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  const fieldLabels: { [key: string]: string } = {
    dni: 'DNI',
    nombre: 'Nombre',
    apellido: 'Apellido',
    email: 'Email',
    telefono: 'Teléfono',
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Gestionar Cuenta</h1>
          <p className="text-slate-600">Administra tu información personal</p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <h2 className="text-xl font-semibold text-slate-900">Datos de la cuenta</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(accountData).map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200"
                >
                  <div>
                    <div className="text-sm text-slate-600 mb-1">{fieldLabels[key]}</div>
                    <div className="font-medium text-slate-900">{value}</div>
                  </div>
                  <button
                    onClick={() => handleEdit(key)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <button
            onClick={handleDeleteAccount}
            className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            Eliminar Cuenta
          </button>
        </div>
      </div>

      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              {fieldLabels[editField]}
            </h2>
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              placeholder={`Ingrese ${fieldLabels[editField].toLowerCase()}`}
            />
            <div className="flex gap-3">
              <button
                onClick={handleCancelEdit}
                className="flex-1 bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-500 transition-colors"
              >
                Cancelar
              </button>
              <Button onClick={handleConfirmEdit} className="flex-1">
                Confirmar
              </Button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
              ¿Está seguro que desea eliminar su cuenta?
            </h2>
            <div className="flex gap-3">
              <button
                onClick={handleCancelDelete}
                className="flex-1 bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-500 transition-colors"
              >
                NO
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                SI
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
