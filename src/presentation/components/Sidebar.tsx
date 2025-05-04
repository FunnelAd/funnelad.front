import { useAuth } from '@/presentation/contexts/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { Permission } from '@/core/types/auth';

interface MenuItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  permission: Permission | null;
}

const menuItems: MenuItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: HomeIcon,
    permission: null, // Accesible para todos los usuarios autenticados
  },
  {
    name: 'Conversaciones',
    href: '/dashboard/conversations',
    icon: ChatBubbleLeftRightIcon,
    permission: 'view_conversations',
  },
  {
    name: 'Contactos',
    href: '/dashboard/contacts',
    icon: UserGroupIcon,
    permission: 'manage_contacts',
  },
  {
    name: 'Asistentes',
    href: '/dashboard/assistants',
    icon: UserGroupIcon,
    permission: null,
  },
  {
    name: 'Reportes',
    href: '/dashboard/reports',
    icon: ChartBarIcon,
    permission: 'view_reports',
  },
  {
    name: 'Configuración',
    href: '/dashboard/settings',
    icon: Cog6ToothIcon,
    permission: 'manage_settings',
  },
];

export default function Sidebar() {
  const { user, hasPermission, logout } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

  const filteredMenuItems = menuItems.filter(
    (item) => !item.permission || hasPermission(item.permission)
  );

  return (
    <div className="flex h-full flex-col bg-[var(--fa-white)] border-r border-[var(--fa-light)]">
      <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
        <div className="flex flex-shrink-0 items-center px-4">
          <img
            className="h-8 w-auto"
            src="/logo.png"
            alt="FunnelAd"
          />
        </div>
        <nav className="mt-5 flex-1 space-y-1 px-2">
          {filteredMenuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                  isActive
                    ? 'bg-[var(--fa-gold)] text-[var(--fa-bg)]'
                    : 'text-[var(--fa-gray)] hover:bg-[var(--fa-gold)] hover:text-[var(--fa-bg)]'
                }`}
              >
                <item.icon
                  className={`mr-3 h-6 w-6 flex-shrink-0 ${
                    isActive ? 'text-[var(--fa-bg)]' : 'text-[var(--fa-gray)] group-hover:text-[var(--fa-bg)]'
                  }`}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="flex flex-shrink-0 border-t border-[var(--fa-light)] p-4">
        <button
          onClick={logout}
          className="group flex w-full items-center px-2 py-2 text-sm font-medium text-[var(--fa-gray)] hover:bg-[var(--fa-gold)] hover:text-[var(--fa-bg)] rounded-md"
        >
          <ArrowRightOnRectangleIcon
            className="mr-3 h-6 w-6 text-[var(--fa-gray)] group-hover:text-[var(--fa-bg)]"
            aria-hidden="true"
          />
          Cerrar sesión
        </button>
      </div>
    </div>
  );
} 