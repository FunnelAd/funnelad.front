"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  HomeIcon,
  PlusCircleIcon,
  RectangleGroupIcon,
  UsersIcon,
  PuzzlePieceIcon,
  BoltIcon,
  ChatBubbleLeftRightIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { useAppConfig } from "@/core/contexts/AppConfigContext";
import { useAuth } from "@/presentation/contexts/AuthContext";

interface SidebarProps {
  onExpandChange?: (isExpanded: boolean) => void;
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
  { name: "Chat", href: "/chat", icon: ChatBubbleLeftRightIcon },
  { name: "Asistente", href: "/assistants", icon: PlusCircleIcon },
  { name: "Plantillas", href: "/templates", icon: RectangleGroupIcon },
  { name: "Disparadores", href: "/triggers", icon: BoltIcon },
  { name: "Contactos", href: "/contacts", icon: UsersIcon },
  { name: "Integraciones", href: "/integrations", icon: PuzzlePieceIcon },
];

export default function Sidebar({ onExpandChange }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { version } = useAppConfig();
  const { user, logout } = useAuth(); // Obtenemos el objeto 'user' del contexto

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
    }
  }, [isHovered, isMobile, onExpandChange]);

  useEffect(() => {
    if (!isMobile) return;
    let touchStartX = 0;
    let touchEndX = 0;
    let touchingSidebar = false;
    let startedInSwipeArea = false;

    const sidebarElement = document.getElementById("main-sidebar");
    if (!sidebarElement) return;

    const handleTouchStart = (e: TouchEvent) => {
      const touchY = e.touches[0].clientY;
      const isInsideSidebar = sidebarElement.contains(e.target as Node);

      if (touchY < 60 && !isOpen) {
        touchStartX = e.touches[0].clientX;
        touchingSidebar = true;
        startedInSwipeArea = true;
      } else if (isOpen && isInsideSidebar) {
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
      const deltaX = touchEndX - touchStartX;

      if (
        (startedInSwipeArea && !isOpen && deltaX > 10) ||
        (isOpen && deltaX < -10)
      ) {
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

    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isMobile, isOpen]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/auth");
    } catch (error) {
      console.error("Error durante el logout:", error);
      alert("No se pudo cerrar la sesión correctamente.");
    }
  };

  return (
    <>
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-[90]"
          onClick={toggleSidebar}
        />
      )}

      <div
        id="main-sidebar"
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
        style={{
          boxShadow: isOpen ? "0 0 15px rgba(0, 0, 0, 0.3)" : "none",
        }}
        onMouseEnter={() => !isMobile && setIsHovered(true)}
        onMouseLeave={() => !isMobile && setIsHovered(false)}
      >
        <div className="flex flex-col items-center justify-center h-24 border-b border-[var(--fa-border)] pt-4 pb-2">
          {" "}
          {/* Aumentamos la altura y añadimos flex-col */}
          <Link
            href="/dashboard"
            className="text-xl font-bold text-[var(--fa-gold)] whitespace-nowrap overflow-hidden"
          >
            {!isMobile && !isHovered ? (
              <div className="flex justify-center">
                <span className="text-2xl">F</span>
              </div>
            ) : (
              "FunnelAd"
            )}
          </Link>
          {/* Nombre del usuario */}
          {user?.name && ( // Mostramos el nombre solo si el usuario está conectado y tiene un 'name'
            <div
              className={`mt-1 text-sm text-gray-400 whitespace-nowrap overflow-hidden text-center
                                ${
                                  !isMobile
                                    ? isHovered
                                      ? "opacity-100 visible w-auto"
                                      : "opacity-0 invisible w-0 h-0"
                                    : isOpen
                                    ? "opacity-100 visible w-auto"
                                    : "opacity-0 invisible w-0 h-0"
                                }
                            transition-all duration-300 ease-in-out`}
            >
              Hola, {user.name.split(" ")[0]}{" "}
              {/* Muestra solo el primer nombre */}
            </div>
          )}
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
                                    ${
                                      isActive
                                        ? "bg-[var(--fa-hover)] text-[var(--fa-gold)]"
                                        : "text-[var(--fa-sidebar-text)] hover:bg-[var(--fa-hover)] hover:text-white"
                                    }
                                    ${
                                      !isMobile
                                        ? "justify-center group-hover:justify-start"
                                        : ""
                                    }
                                `}
              >
                <span
                  className={`flex items-center justify-center h-6 w-6 transition-all duration-300
                                        ${
                                          !isMobile
                                            ? "group-hover:justify-start"
                                            : ""
                                        }
                                    `}
                >
                  <item.icon
                    className={`h-5 w-5 ${
                      isActive
                        ? "text-[var(--fa-gold)]"
                        : "text-[var(--fa-sidebar-text)]"
                    } transition-all duration-300`}
                    aria-hidden="true"
                  />
                </span>
                <span
                  className={`ml-3 whitespace-nowrap transition-all duration-300
                                        ${
                                          isMobile
                                            ? isOpen
                                              ? "opacity-100 visible w-auto"
                                              : "opacity-0 invisible w-0 p-0 m-0"
                                            : "opacity-0 invisible w-0 p-0 m-0 group-hover:opacity-100 group-hover:visible group-hover:w-auto group-hover:ml-3"
                                        }
                                    `}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto px-2 py-4">
          <button
            onClick={handleLogout}
            className={`
                            flex items-center w-full px-4 py-2 text-sm font-medium rounded-md
                            text-[var(--fa-sidebar-text)] hover:bg-red-500 hover:text-white transition-colors duration-300
                            ${
                              !isMobile
                                ? "justify-center group-hover:justify-start"
                                : ""
                            }
                        `}
          >
            <span
              className={`flex items-center justify-center h-6 w-6 transition-all duration-300
                                ${!isMobile ? "group-hover:justify-start" : ""}
                            `}
            >
              <ArrowRightOnRectangleIcon
                className="h-5 w-5 text-[var(--fa-sidebar-text)] group-hover:text-white transition-all duration-300"
                aria-hidden="true"
              />
            </span>
            <span
              className={`ml-3 whitespace-nowrap transition-all duration-300
                                ${
                                  isMobile
                                    ? isOpen
                                      ? "opacity-100 visible w-auto"
                                      : "opacity-0 invisible w-0 p-0 m-0"
                                    : "opacity-0 invisible w-0 p-0 m-0 group-hover:opacity-100 group-hover:visible group-hover:w-auto group-hover:ml-3"
                                }
                            `}
            >
              Cerrar Sesión
            </span>
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 px-4 py-3 border-t border-[var(--fa-border)] bg-[var(--fa-sidebar)]">
          <div className="flex items-center justify-center">
            <span className="text-xs text-[var(--fa-sidebar-text)] font-light">
              v{version}
            </span>
          </div>
        </div>
      </div>

      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-[90]"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
}
