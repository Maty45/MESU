import React from 'react';
import { AlertCircle, CheckCircle, AlertTriangle, X } from 'lucide-react';

interface AlertProps {
  alert: { mensaje: string; tipo: 'roja' | 'verde' | 'amarilla' } | null;
  show: boolean;
  onClose: () => void;
}

export function Alert({ alert, show, onClose }: AlertProps) {
  if (!alert) return null;

  const { mensaje, tipo } = alert;

  return (
    <div 
      className={`fixed bottom-4 right-4 z-50 max-w-xs md:max-w-sm w-full transition-all duration-500 ease-in-out ${
        show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      {tipo === 'roja' && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 relative" role="alert">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span className="text-sm font-medium pr-6">{mensaje}</span>
          <button 
            onClick={onClose} 
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-red-100 rounded-full transition-colors"
            title="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {tipo === 'verde' && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl shadow-lg flex items-center gap-3" role="alert">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span className="text-sm font-medium">{mensaje}</span>
        </div>
      )}

      {tipo === 'amarilla' && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-xl shadow-lg flex items-center gap-3" role="alert">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span className="text-sm font-medium">{mensaje}</span>
        </div>
      )}
    </div>
  );
}