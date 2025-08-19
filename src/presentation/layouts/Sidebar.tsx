"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  HomeIcon,
  PlusCircleIcon,
  RectangleGroupIcon,
  UsersIcon,
  PuzzlePieceIcon,
  BoltIcon,
  ChatBubbleLeftRightIcon,
  KeyIcon, // Icono para Master
  ChevronDownIcon, // Icono para el dropdown
  DocumentTextIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  MicrophoneIcon,
} from "@heroicons/react/24/outline";
import { useAppConfig } from "@/core/contexts/AppConfigContext";

interface SidebarProps {
  onExpandChange?: (isExpanded: boolean) => void;
}

// Estructura de navegación actualizada para soportar sub-menús
const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
  { name: "Chat", href: "/chat", icon: ChatBubbleLeftRightIcon },
  { name: "Asistente", href: "/assistants", icon: PlusCircleIcon },
  { name: "Plantillas", href: "/template", icon: RectangleGroupIcon },
  { name: "Disparadores", href: "/triggers", icon: BoltIcon },
  { name: "Contactos", href: "/contacts", icon: UsersIcon },
  { name: "Integraciones", href: "/integrations", icon: PuzzlePieceIcon },
  // Nuevo elemento "Master" con sub-menú
  {
    name: "Master",
    icon: KeyIcon,
    children: [
      { name: "Prompts", href: "/master/prompts", icon: DocumentTextIcon },
      {
        name: "Companies",
        href: "/master/companies",
        icon: BuildingOfficeIcon,
      },
      { name: "Users", href: "/master/users", icon: UserGroupIcon },
      { name: "Voices", href: "/master/voices", icon: MicrophoneIcon },
    ],
  },
];

export default function Sidebar({ onExpandChange }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const { version } = useAppConfig();

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      onExpandChange?.(isHovered);
      // Cierra el dropdown cuando el sidebar se colapsa
      if (!isHovered) {
        setOpenDropdown(null);
      }
    }
  }, [isHovered, isMobile, onExpandChange]);

  // Detecta la ruta activa y abre el dropdown correspondiente
  useEffect(() => {
    const activeItem = navigation.find((item) =>
      item.children?.some((child) => pathname.startsWith(child.href))
    );
    if (activeItem) {
      setOpenDropdown(activeItem.name);
    }
  }, [pathname]);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const isExpanded = isMobile ? isOpen : isHovered;

  return (
    <>
      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-[90]"
          onClick={toggleSidebar}
        />
      )}

      <div
        className={`
                    fixed left-0 top-0 h-screen bg-[var(--fa-sidebar)] border-r border-[var(--fa-border)] transition-all duration-300 ease-in-out z-[100]
                    ${
                      isMobile
                        ? `${
                            isOpen
                              ? "translate-x-0 shadow-xl"
                              : "-translate-x-full"
                          } w-64`
                        : "w-16 hover:w-64 group"
                    }
                `}
        onMouseEnter={() => !isMobile && setIsHovered(true)}
        onMouseLeave={() => !isMobile && setIsHovered(false)}
      >
        <div className="flex items-center justify-center h-16 border-b border-[var(--fa-border)]">
          <Link
            href="/dashboard"
            className="text-xl font-bold text-[var(--fa-gold)] whitespace-nowrap overflow-hidden"
          >
            {isExpanded ? "FunnelAd" : <span className="text-2xl">F</span>}
          </Link>
        </div>

        <nav className="flex flex-col flex-1 p-2 space-y-1 h-[calc(100vh-8rem)]">
          {navigation.map((item) =>
            !item.children ? (
              <Link
                key={item.name}
                href={item.href!}
                className={`flex items-center p-3 text-sm font-medium rounded-md ${
                  pathname === item.href
                    ? "bg-[var(--fa-hover)] text-[var(--fa-gold)]"
                    : "text-[var(--fa-sidebar-text)] hover:bg-white hover:text-gray-900"
                } ${
                  !isMobile ? "justify-center group-hover:justify-start" : ""
                }`}
              >
                <item.icon
                  className={`h-6 w-6 flex-shrink-0`}
                  aria-hidden="true"
                />
                <span
                  className={`ml-4 whitespace-nowrap transition-opacity ${
                    isExpanded ? "opacity-100" : "opacity-0 w-0"
                  }`}
                >
                  {item.name}
                </span>
              </Link>
            ) : (
              <div key={item.name}>
                <button
                  onClick={() => toggleDropdown(item.name)}
                  className={`w-full flex items-center p-3 text-sm font-medium rounded-md text-left ${"text-[var(--fa-sidebar-text)] hover:bg-white hover:text-gray-900"} ${
                    !isMobile
                      ? "justify-center group-hover:justify-start"
                      : "justify-between"
                  }`}
                >
                  <item.icon
                    className="h-6 w-6 flex-shrink-0"
                    aria-hidden="true"
                  />
                  <div
                    className={`flex-1 flex justify-between items-center ml-4 whitespace-nowrap transition-opacity ${
                      isExpanded ? "opacity-100" : "opacity-0 w-0"
                    }`}
                  >
                    <span>{item.name}</span>
                    <ChevronDownIcon
                      className={`h-4 w-4 transition-transform duration-300 ${
                        openDropdown === item.name ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openDropdown === item.name ? "max-h-96" : "max-h-0"
                  }`}
                >
                  <div
                    className={`pl-8 pr-2 py-2 space-y-1 ${
                      isExpanded ? "block" : "hidden"
                    }`}
                  >
                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        href={child.href}
                        className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                          pathname === child.href
                            ? "bg-[var(--fa-hover)] text-[var(--fa-gold)]"
                            : "text-[var(--fa-sidebar-text)] hover:bg-white hover:text-gray-900"
                        }`}
                      >
                        <child.icon
                          className={`h-5 w-5 mr-3 flex-shrink-0`}
                          aria-hidden="true"
                        />
                        <span>{child.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )
          )}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 px-4 py-3 border-t border-[var(--fa-border)] bg-[var(--fa-sidebar)]">
          <div className="flex items-center justify-center">
            <span className="text-xs text-[var(--fa-sidebar-text)] font-light">
              v{version}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
