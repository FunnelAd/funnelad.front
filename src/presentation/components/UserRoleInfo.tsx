import { useAuth } from '@/presentation/contexts/AuthContext';

export default function UserRoleInfo() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="bg-[var(--fa-white)] p-4 rounded-lg shadow-sm border border-[var(--fa-light)]">
      <h3 className="text-lg font-medium text-[var(--fa-bg)] mb-2">Información de la cuenta</h3>
      <div className="space-y-2">
        <div>
          <span className="text-sm font-medium text-[var(--fa-gray)]">Rol principal:</span>
          <span className="ml-2 text-sm text-[var(--fa-bg)]">
            {user.role === 'FUNNELAD' ? 'FunnelAd' : 'Cliente'}
          </span>
        </div>
        {user.role === 'CLIENT' && user.clientSubRole && (
          <div>
            <span className="text-sm font-medium text-[var(--fa-gray)]">Rol de cliente:</span>
            <span className="ml-2 text-sm text-[var(--fa-bg)]">
              {user.clientSubRole === 'ADMIN' ? 'Administrador' : 'Auxiliar'}
            </span>
          </div>
        )}
        {user.storeName && (
          <div>
            <span className="text-sm font-medium text-[var(--fa-gray)]">Tienda:</span>
            <span className="ml-2 text-sm text-[var(--fa-bg)]">{user.storeName}</span>
          </div>
        )}
      </div>
    </div>
  );
} 