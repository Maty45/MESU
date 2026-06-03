import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Al navegar a una nueva ruta, llevar el scroll al inicio
    window.scrollTo({ top: 0, left: 0 });
  }, [pathname]);

  return null;
}

export default ScrollToTop;
