import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rutas que no requieren autenticación
const publicRoutes = ['/auth', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Verificar si la ruta es pública
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  
  // Si es una ruta pública, permitir el acceso
  if (isPublicRoute) {
    return NextResponse.next();
  }
  
  // COMENTADO TEMPORALMENTE PARA DESARROLLO
  // Verificar si el usuario está autenticado
  // const token = request.cookies.get('auth_token')?.value;
  
  // if (!token) {
  //   // Redirigir a la página de inicio de sesión si no hay token
  //   return NextResponse.redirect(new URL('/auth', request.url));
  // }
  
  // FIN DE SECCIÓN COMENTADA TEMPORALMENTE PARA DESARROLLO
  // ¡¡¡IMPORTANTE!!! Reactivar la lógica de verificación de token antes de pasar a producción.
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images).*)'],
};