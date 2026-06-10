import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Alert } from './Alert';
//import { Heart, Mail, Lock } from 'lucide-react';
import logoMesu from '../assets/images/logo.png';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [alert, setAlert] = useState<{ mensaje: string; tipo: 'roja' | 'verde' | 'amarilla' } | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (alert) {
      setShow(true);
      
      const hideTimer = setTimeout(() => {
        setShow(false);
      }, 3000);

      const clearTimer = setTimeout(() => {
        setAlert(null);
      }, 3500); // Damos 500ms adicionales para que complete la animación de salida

      return () => {
        clearTimeout(hideTimer);
        clearTimeout(clearTimer);
      };
    }
  }, [alert]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login(email, password);
      navigate('/marketplace');
      setAlert({ mensaje: 'Inicio de sesión exitoso', tipo: 'verde' });
    } catch (error) {
      setAlert({ mensaje: "Email o contraseña incorrectos", tipo: 'roja' });
    }
  };

  return (
    <div id='login' className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-blue-50 via-white to-teal-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4">
            <img src={logoMesu} alt="Logo MESU" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Bienvenido a MESU</h1>
          <p className="text-slate-600">Ingresa a tu cuenta para continuar</p>
        </div>

        <Alert alert={alert} show={show} onClose={() => setShow(false)} />

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Input
                type="email"
                label="Correo electrónico"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <Input
                type="password"
                label="Contraseña"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-slate-300" />
                <span className="text-slate-600">Recordarme</span>
              </label>
              <a href="#" className="text-blue-600 hover:text-blue-700">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <Button type="submit" className="w-full" size="lg">
              Ingresar
            </Button>
          </form>


          <div className="mt-6 text-center text-sm text-slate-600">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">
              Regístrate aquí
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
