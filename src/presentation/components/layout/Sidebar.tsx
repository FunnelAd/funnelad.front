'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
   HomeIcon,
   PlusCircleIcon,
   RectangleGroupIcon,
   UsersIcon,
   PuzzlePieceIcon,
   BoltIcon
  } from '@heroicons/react/24/outline';
   
   const navigation = [
     { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
     { name: 'Asistente', href: '/assistants', icon: PlusCircleIcon },
     { name: 'Plantillas', href: '/templates', icon: RectangleGroupIcon },
     { name: 'Disparadores', href: '/triggers', icon: BoltIcon },
     { name: 'Contactos', href: '/contacts', icon: UsersIcon },
     { name: 'Integraciones', href: '/integrations', icon: PuzzlePieceIcon },
   ];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col w-64 bg-white border-r border-gray-200">
      <div className="flex items-center justify-center h-16 border-b border-gray-200">
        <Link href="/dashboard" className="text-xl font-bold text-primary-600">
          FunnelAd
        </Link>
      </div>
      <nav className="flex-1 px-4 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                isActive
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon
                className={`mr-3 h-5 w-5 ${
                  isActive ? 'text-primary-600' : 'text-gray-400'
                }`}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
} 