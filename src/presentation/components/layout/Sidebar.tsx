'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
   HomeIcon,
   PlusCircleIcon,
   RectangleGroupIcon,
   UsersIcon,
   PuzzlePieceIcon,
   BoltIcon,
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
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Swipe gesture logic mejorado con área sensible superior
  useEffect(() => {
    if (!isMobile) return;
    let touchStartX = 0;
    let touchEndX = 0;
    let touchingSidebar = false;
    let startedInSwipeArea = false;

    const swipeArea = document.getElementById('swipe-area');
    if (!swipeArea) return;

    const handleTouchStart = (e: TouchEvent) => {
      // Solo si el touch inicia en la franja superior (área sensible)
      const touchY = e.touches[0].clientY;
      if (e.target === swipeArea && touchY < 60 && !isOpen) {
        touchStartX = e.touches[0].clientX;
        touchingSidebar = true;
        startedInSwipeArea = true;
      } else if (isOpen) {
        // Si el sidebar está abierto, permitir swipe para cerrar desde cualquier lado
        touchStartX = e.touches[0].clientX;
        touchingSidebar = true;
        startedInSwipeArea = false;
      } else {
        touchingSidebar = false;
        startedInSwipeArea = false;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchingSidebar) return;
      touchEndX = e.touches[0].clientX;
      // Si está abriendo el sidebar desde el área sensible, prevenir el back
      if (startedInSwipeArea && !isOpen && touchEndX - touchStartX > 10) {
        e.preventDefault();
      }
    };

    const handleTouchEnd = () => {
      if (!touchingSidebar) return;
      const deltaX = touchEndX - touchStartX;
      // Swipe right to open
      if (!isOpen && startedInSwipeArea && deltaX > 50) {
        setIsOpen(true);
      }
      // Swipe left to close
      if (isOpen && deltaX < -50) {
        setIsOpen(false);
      }
      touchingSidebar = false;
      startedInSwipeArea = false;
      touchStartX = 0;
      touchEndX = 0;
    };

    swipeArea.addEventListener('touchstart', handleTouchStart);
    swipeArea.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);
    return () => {
      swipeArea.removeEventListener('touchstart', handleTouchStart);
      swipeArea.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isMobile, isOpen]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Sidebar */}
      <div
        className={`
          fixed md:relative
          h-full
          bg-white
          border-r border-gray-200
          transition-all duration-300 ease-in-out
          ${isMobile
            ? `${isOpen ? 'translate-x-0' : '-translate-x-full'} w-64`
            : 'w-16 hover:w-64 group'
          }
          z-40
        `}
      >
        <div className="flex items-center justify-center h-16 border-b border-gray-200">
          <Link href="/dashboard" className="text-xl font-bold text-primary-600 whitespace-nowrap overflow-hidden">
            {(!isMobile || isOpen) && 'FunnelAd'}
          </Link>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center px-4 py-2 text-sm font-medium rounded-md
                  transition-all duration-300
                  ${isActive
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                  ${!isMobile ? 'justify-center group-hover:justify-start' : ''}
                `}
              >
                <span
                  className={`flex items-center justify-center h-6 w-6 transition-all duration-300
                    ${!isMobile ? 'group-hover:justify-start' : ''}
                  `}
                >
                  <item.icon
                    className={`h-5 w-5 ${isActive ? 'text-primary-600' : 'text-gray-400'} transition-all duration-300`}
                    aria-hidden="true"
                  />
                </span>
                <span
                  className={`ml-3 whitespace-nowrap transition-all duration-300
                    ${isMobile
                      ? (isOpen ? 'opacity-100 visible w-auto' : 'opacity-0 invisible w-0 p-0 m-0')
                      : 'opacity-0 invisible w-0 p-0 m-0 group-hover:opacity-100 group-hover:visible group-hover:w-auto group-hover:ml-3'
                    }
                  `}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleSidebar}
        />
      )}

      {/* Área sensible para swipe en móvil (franja superior) */}
      {isMobile && !isOpen && (
        <div
          id="swipe-area"
          className="fixed top-0 left-0 w-screen h-[60px] z-50"
          style={{ touchAction: 'pan-y' }}
        />
      )}
    </>
  );
} 