import { ReactNode } from 'react';
import { Permission } from '@/core/types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: Permission;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  // Temporalmente permitimos todo el acceso
  return <>{children}</>;
}