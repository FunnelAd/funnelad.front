
import { Permission } from '@/core/types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: Permission;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  // Temporalmente permitimos todo el acceso
  // TODO: Implementar la lógica de verificación de permisos basada en `requiredPermission`
  // y el usuario autenticado (ej. usando `useAuth` para obtener roles/permisos del usuario).
  return <>{children}</>;
}