import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rutas públicas que no requieren autenticación
const publicRoutes = ['/auth', '/terms', '/'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Permitir acceso a rutas públicas
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Verificar autenticación
  const token = request.cookies.get('auth-token')?.value;
  
  // Si no hay token y no es una ruta pública, redirigir a auth
  if (!token && !publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 