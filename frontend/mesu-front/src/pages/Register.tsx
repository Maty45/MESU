import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
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

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden');
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

      alert('Usuario registrado correctamente');
      navigate('/login');

    } catch (error) {
      console.error(error);
      alert('Error al registrar usuario');
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
              onChange={(e) => setDni(e.target.value)}
              required
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
            />

            <Input
              type="text"
              label="Teléfono"
              placeholder="2615551234"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              required
            />

            <Input
              type="password"
              label="Contraseña"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Input
              type="password"
              label="Confirmar contraseña"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
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
      </div>
    </div>
  );
}