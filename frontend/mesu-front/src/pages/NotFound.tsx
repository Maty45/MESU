import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Home, Search } from 'lucide-react';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 bg-gradient-to-br from-blue-50 via-white to-teal-50">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <div className="text-9xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
            404
          </div>
        </div>

        <h1 className="text-3xl font-bold text-slate-900 mb-4">
          Página no encontrada
        </h1>

        <p className="text-lg text-slate-600 mb-8">
          Lo sentimos, la página que buscas no existe o ha sido movida.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => navigate('/')} className="gap-2">
            <Home className="w-4 h-4" />
            Ir al inicio
          </Button>
          <Button onClick={() => navigate('/marketplace')} variant="outline" className="gap-2">
            <Search className="w-4 h-4" />
            Explorar productos
          </Button>
        </div>
      </div>
    </div>
  );
}
