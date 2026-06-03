import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Heart, Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import { useState } from 'react';

// Fallback `useAuth` cuando no existe el contexto global.
type AuthUser = { name?: string; role?: string } | null;
function useAuth() {
  return {
    user: null as AuthUser,
    logout: () => {},
    isAuthenticated: false,
  };
}

export function Layout() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const getDashboardLink = () => {
    if (!user) return '/marketplace';
    switch (user.role) {
      case 'admin':
        return '/admin-dashboard';
      case 'owner':
        return '/owner-dashboard';
      case 'client':
        return '/client-dashboard';
      default:
        return '/marketplace';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-blue-500 to-teal-500 rounded-lg p-2">
                <Heart className="w-6 h-6 text-white fill-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                MESU
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link to="/marketplace" className="text-slate-700 hover:text-blue-600 transition">
                Marketplace
              </Link>
              {isAuthenticated ? (
                <>
                  <Link to={getDashboardLink()} className="flex items-center gap-2 text-slate-700 hover:text-blue-600 transition">
                    <LayoutDashboard className="w-4 h-4" />
                    Panel
                  </Link>
                  {(user?.role === 'client' || user?.role === 'owner') && (
                    <Link
                      to="/account-settings"
                      className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition font-medium"
                    >
                      {user?.role === 'client' ? 'Cliente' : 'Propietario'}
                    </Link>
                  )}
                  <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                    <span className="text-sm text-slate-600">{user?.name}</span>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                    >
                      <LogOut className="w-4 h-4" />
                      Salir
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-slate-700 hover:text-blue-600 transition">
                    Ingresar
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                  >
                    Registrarse
                  </Link>
                </>
              )}
            </nav>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white">
            <div className="px-4 py-3 space-y-3">
              <Link
                to="/marketplace"
                className="block py-2 text-slate-700 hover:text-blue-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                Marketplace
              </Link>
              {isAuthenticated ? (
                <>
                  <Link
                    to={getDashboardLink()}
                    className="block py-2 text-slate-700 hover:text-blue-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Panel
                  </Link>
                  {(user?.role === 'client' || user?.role === 'owner') && (
                    <Link
                      to="/account-settings"
                      className="block py-2 text-blue-700 hover:text-blue-900 font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {user?.role === 'client' ? 'Cliente' : 'Propietario'}
                    </Link>
                  )}
                  <div className="pt-3 border-t border-slate-200">
                    <p className="text-sm text-slate-600 mb-2">{user?.name}</p>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg"
                    >
                      <LogOut className="w-4 h-4" />
                      Salir
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block py-2 text-slate-700 hover:text-blue-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Ingresar
                  </Link>
                  <Link
                    to="/register"
                    className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Registrarse
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-gradient-to-br from-blue-500 to-teal-500 rounded-lg p-2">
                  <Heart className="w-5 h-5 text-white fill-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                  MESU
                </span>
              </div>
              <p className="text-sm text-slate-600">
                Marketplace solidario de productos ortopédicos. Conectando personas que necesitan con quienes pueden ayudar.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-3">Enlaces</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><Link to="/marketplace" className="hover:text-blue-600">Marketplace</Link></li>
                <li><Link to="/register" className="hover:text-blue-600">Registrarse</Link></li>
                <li><a href="#" className="hover:text-blue-600">Sobre Nosotros</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-3">Contacto</h3>
              <p className="text-sm text-slate-600">
                Email: contacto@mesu.com<br />
                Teléfono: +54 11 1234-5678
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-200 text-center text-sm text-slate-600">
            © 2026 MESU. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
