import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Rutas que no requieren autenticación
const publicRoutes = ["/auth", "/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Verificar si la ruta es pública
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // ✅ LÓGICA ACTIVADA
  // Verificar si el usuario está autenticado buscando la cookie
  const token = request.cookies.get("auth_token")?.value;

  if (!token) {
    // Redirigir a la página de inicio de sesión si no hay token
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  // Si hay token, permitir el acceso a la ruta protegida
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images).*)"],
};
