import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Alert } from './Alert';
import logoMesu from '../assets/images/logo.png';

export function Register() {

  const [dni, setDni] = useState('');
  const [name, setName] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const [alert, setAlert] = useState<{ mensaje: string; tipo: 'roja' | 'verde' | 'amarilla' } | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (alert) {
      setShow(true);
      const hideTimer = setTimeout(() => setShow(false), 3000);
      const clearTimer = setTimeout(() => setAlert(null), 3500);
      return () => {
        clearTimeout(hideTimer);
        clearTimeout(clearTimer);
      };
    }
  }, [alert]);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setAlert({ mensaje: 'Las contraseñas no coinciden', tipo: 'roja' });
      return;
    }

    try {
      await register(
        dni,
        name,
        apellido,
        email,
        password,
        telefono
      );

      setAlert({ mensaje: 'Usuario registrado correctamente', tipo: 'verde' });
      setTimeout(() => navigate('/login'), 2000);

    } catch (error) {
      console.error(error);
      setAlert({ mensaje: 'Error al registrar usuario', tipo: 'roja' });
    }
  };

  // Escudo para el DNI: Borra letras/símbolos al toque y limita a 8 dígitos max
  const handleDniChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const soloNumeros = value.replace(/[^0-9]/g, '');
    if (soloNumeros.length <= 8) {
      setDni(soloNumeros);
    }
  };

  // Escudo para el Teléfono: Borra caracteres raros y limita a 15 dígitos max (evita desborde de Long)
  const handleTelefonoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const soloNumeros = value.replace(/[^0-9]/g, '');
    if (soloNumeros.length <= 15) {
      setTelefono(soloNumeros);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-blue-50 via-white to-teal-50">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4">
            <img src={logoMesu} alt="Logo MESU" />
          </div>

          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Únete a MESU
          </h1>

          <p className="text-slate-600">
            Crea tu cuenta y comienza a ayudar
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">

          <form onSubmit={handleSubmit} className="space-y-5">

            <Input
              type="text"
              label="DNI"
              placeholder="12345678"
              value={dni}
              onChange={handleDniChange}
              required
              pattern="[0-9]{7,8}" 
              title="El DNI debe contener entre 7 y 8 números enteros."
            />

            <Input
              type="text"
              label="Nombre"
              placeholder="Juan"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <Input
              type="text"
              label="Apellido"
              placeholder="Pérez"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              required
            />

            <Input
              type="email"
              label="Correo electrónico"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username" // Obliga al navegador a usar este campo como el usuario guardado
            />

            <Input
              type="text"
              label="Teléfono"
              placeholder="2615551234"
              value={telefono}
              onChange={handleTelefonoChange}
              required
              pattern="[0-9]{10,15}"
              title="El teléfono debe tener entre 10 y 15 números puros, sin guiones ni espacios."
              autoComplete="tel" // Le avisa al navegador que es solo un teléfono común
            />

            <Input
              type="password"
              label="Contraseña"
              placeholder="••••••••"
              minLength={9}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password" // Vincula esta contraseña al correo electrónico de arriba
            />

            <Input
              type="password"
              label="Confirmar contraseña"
              placeholder="••••••••"
              minLength={9}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
            />

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                required
                className="mt-1 rounded border-slate-300"
              />

              <label className="text-sm text-slate-600">
                Acepto los{' '}
                <a href="#" className="text-blue-600 hover:text-blue-700">
                  términos y condiciones
                </a>{' '}
                y la{' '}
                <a href="#" className="text-blue-600 hover:text-blue-700">
                  política de privacidad
                </a>
              </label>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
            >
              Crear cuenta
            </Button>

          </form>

          <div className="mt-6 text-center text-sm text-slate-600">
            ¿Ya tienes cuenta?{' '}
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Inicia sesión
            </Link>
          </div>

        </div>
        <Alert alert={alert} show={show} onClose={() => setShow(false)} />
      </div>
    </div>
  );
}