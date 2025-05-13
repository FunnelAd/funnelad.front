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
   ChatBubbleLeftRightIcon,
  } from '@heroicons/react/24/outline';
import { useAppConfig } from '@/core/contexts/AppConfigContext';

interface SidebarProps {
  onExpandChange?: (isExpanded: boolean) => void;
}
   
   const navigation = [
     { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
     { name: 'Chat', href: '/chat', icon: ChatBubbleLeftRightIcon },
     { name: 'Asistente', href: '/assistants', icon: PlusCircleIcon },
     { name: 'Plantillas', href: '/templates', icon: RectangleGroupIcon },
     { name: 'Disparadores', href: '/triggers', icon: BoltIcon },
     { name: 'Contactos', href: '/contacts', icon: UsersIcon },
     { name: 'Integraciones', href: '/integrations', icon: PuzzlePieceIcon },
   ];

export default function Sidebar({ onExpandChange }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { version } = useAppConfig();

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Notificar cuando el sidebar está expandido
  useEffect(() => {
    if (!isMobile) {
      onExpandChange?.(isHovered);
    }
  }, [isHovered, isMobile, onExpandChange]);

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
      const touchY = e.touches[0].clientY;
      if (e.target === swipeArea && touchY < 60 && !isOpen) {
        touchStartX = e.touches[0].clientX;
        touchingSidebar = true;
        startedInSwipeArea = true;
      } else if (isOpen) {
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
      if (startedInSwipeArea && !isOpen && touchEndX - touchStartX > 10) {
        e.preventDefault();
      }
    };

    const handleTouchEnd = () => {
      if (!touchingSidebar) return;
      const deltaX = touchEndX - touchStartX;
      if (!isOpen && startedInSwipeArea && deltaX > 50) {
        setIsOpen(true);
      }
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
      {/* Área sensible para swipe en móvil (franja superior) */}
      {isMobile && !isOpen && (
        <div
          id="swipe-area"
          className="fixed top-0 left-0 w-screen h-[60px] z-50"
          style={{ touchAction: 'pan-y' }}
        />
      )}

      {/* Sidebar - Aumentado z-index y eliminado transformación del layout */}
      <div
        className={`
          fixed left-0 top-[56px] h-[calc(100vh-56px)] bg-[#0B2C3D] border-r border-[#1D3E4E] transition-all duration-300 ease-in-out z-[100]
          ${isMobile
            ? `${isOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full'} w-64`
            : 'w-16 hover:w-64 group'
          }
        `}
        style={{ 
          boxShadow: isOpen ? '0 0 15px rgba(0, 0, 0, 0.3)' : 'none'
        }}
        onMouseEnter={() => !isMobile && setIsHovered(true)}
        onMouseLeave={() => !isMobile && setIsHovered(false)}
      >
      <div className="flex items-center justify-center h-16 border-b border-[#1D3E4E]">
          <Link href="/dashboard" className="text-xl font-bold text-[#C9A14A] whitespace-nowrap overflow-hidden">
            {(!isMobile || isOpen) && 'FunnelAd'}
        </Link>
      </div>
        <nav className="flex-1 px-2 py-4 space-y-1 pb-16">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
                className={`
                  flex items-center px-4 py-2 text-sm font-medium rounded-md
                  ${isActive
                  ? 'bg-[#1D3E4E] text-[#C9A14A]'
                  : 'text-gray-300 hover:bg-[#1D3E4E] hover:text-white'
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
                    className={`h-5 w-5 ${isActive ? 'text-[#C9A14A]' : 'text-gray-400'} transition-all duration-300`}
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
        {/* Versión de la aplicación */}
        <div className="absolute bottom-0 left-0 right-0 px-4 py-3 border-t border-[#1D3E4E] bg-[#0B2C3D]">
          <div className="flex items-center justify-center">
            <span className="text-xs text-gray-400 font-light">
              v{version}
            </span>
          </div>
        </div>
    </div>

      {/* Overlay for mobile - Aumentado z-index */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-[90]"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
}