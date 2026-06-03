import { Link } from 'react-router-dom';
import { Heart, Search, Users, Shield, ArrowRight, Package, Clock, DollarSign } from 'lucide-react';
import { Button } from '../components/ui/button';

export function Landing() {
  return (
    <div id="landing" className="bg-white">
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-teal-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-6">
              <Heart className="w-4 h-4 fill-blue-700" />
              <span className="text-sm font-medium">Marketplace Solidario</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
              Acceso a productos ortopédicos para{' '}
              <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                todos
              </span>
            </h1>
            <p className="text-xl text-slate-600 mb-8">
              Conectamos personas que necesitan productos ortopédicos con quienes pueden donarlos, alquilarlos o venderlos de forma accesible.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/marketplace">
                <Button size="lg" className="gap-2">
                  Explorar Productos
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" size="lg">
                  Crear Cuenta
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">¿Cómo funciona MESU?</h2>
            <p className="text-lg text-slate-600">Simple, seguro y solidario</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">1. Busca</h3>
              <p className="text-slate-600">
                Explora productos ortopédicos disponibles en tu zona. Filtra por tipo, precio y ubicación.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">2. Conecta</h3>
              <p className="text-slate-600">
                Contacta directamente con el propietario para coordinar los detalles de la operación.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">3. Confía</h3>
              <p className="text-slate-600">
                Sistema de reportes y moderación que garantiza un ambiente seguro para todos.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Modalidades disponibles</h2>
            <p className="text-lg text-slate-600">Elige la opción que mejor se adapte a tus necesidades</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-green-600 fill-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Donación</h3>
              <p className="text-slate-600 mb-4">
                Productos gratuitos para quienes más lo necesitan. Ayuda solidaria de la comunidad.
              </p>
              <div className="inline-block bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                Gratis
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Alquiler</h3>
              <p className="text-slate-600 mb-4">
                Ideal para productos que necesitas por tiempo limitado. Accesible y económico.
              </p>
              <div className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                Por día/mes
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Venta</h3>
              <p className="text-slate-600 mb-4">
                Compra productos usados o nuevos a precios accesibles. Pago único.
              </p>
              <div className="inline-block bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                Precio fijo
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-blue-500 to-teal-500 rounded-2xl p-8 md:p-12 text-center text-white">
            <Package className="w-16 h-16 mx-auto mb-6 opacity-90" />
            <h2 className="text-3xl font-bold mb-4">¿Tienes productos para compartir?</h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Ayuda a otras personas publicando productos ortopédicos que ya no uses. Dona, alquila o vende de forma simple y segura.
            </p>
            <Link to="/register">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-slate-100">
                Publicar Ahora
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Preguntas frecuentes</h2>
          </div>

          <div className="space-y-4">
            <details className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 group">
              <summary className="font-semibold text-slate-900 cursor-pointer flex items-center justify-between">
                ¿Es seguro usar MESU?
                <span className="text-slate-400 group-open:rotate-180 transition">▼</span>
              </summary>
              <p className="mt-4 text-slate-600">
                Sí. Contamos con un sistema de reportes, moderación y verificación de usuarios para garantizar la seguridad de todas las operaciones.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 group">
              <summary className="font-semibold text-slate-900 cursor-pointer flex items-center justify-between">
                ¿Cómo funciona el alquiler?
                <span className="text-slate-400 group-open:rotate-180 transition">▼</span>
              </summary>
              <p className="mt-4 text-slate-600">
                Coordinas directamente con el propietario el tiempo y el precio. El sistema te enviará recordatorios antes de la fecha de devolución.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 group">
              <summary className="font-semibold text-slate-900 cursor-pointer flex items-center justify-between">
                ¿Puedo publicar cualquier producto?
                <span className="text-slate-400 group-open:rotate-180 transition">▼</span>
              </summary>
              <p className="mt-4 text-slate-600">
                Puedes publicar productos ortopédicos como sillas de ruedas, muletas, andadores, bastones, camas ortopédicas y más. Los administradores revisan todas las publicaciones.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 group">
              <summary className="font-semibold text-slate-900 cursor-pointer flex items-center justify-between">
                ¿Tiene costo registrarse?
                <span className="text-slate-400 group-open:rotate-180 transition">▼</span>
              </summary>
              <p className="mt-4 text-slate-600">
                No, registrarse y usar MESU es completamente gratuito. Solo pagas si compras o alquilas un producto, según lo acordado con el propietario.
              </p>
            </details>
          </div>
        </div>
      </section>
    </div>
  );
}
