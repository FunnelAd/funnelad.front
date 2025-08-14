"use client";

import React, { FC, useState, useEffect, useRef } from "react";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  CpuChipIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  DocumentTextIcon,
  PlusCircleIcon,
  ArrowRightIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import dynamic from "next/dynamic";
import Link from "next/link";

// --- Carga dinámica de los gráficos para optimizar el rendimiento ---
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

// --- Tipos de Datos ---
type KpiData = {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative";
  icon: React.ElementType;
};

type ActivityItem = {
  icon: React.ElementType;
  text: React.ReactNode;
  time: string;
};

type QuickAccessLink = {
  name: string;
  href: string;
  icon: React.ElementType;
};

type Product = {
  name: string;
  category: string;
  sales: number;
  imageUrl: string;
};

// --- Datos de Ejemplo (Esto vendría de tu API) ---
const kpiMetrics: KpiData[] = [
  {
    title: "Asistentes Activos",
    value: "12",
    change: "+5.4%",
    changeType: "positive",
    icon: CpuChipIcon,
  },
  {
    title: "Conversaciones Hoy",
    value: "842",
    change: "+12.1%",
    changeType: "positive",
    icon: ChatBubbleLeftRightIcon,
  },
  {
    title: "Usuarios Totales",
    value: "1,230",
    change: "-1.2%",
    changeType: "negative",
    icon: UserGroupIcon,
  },
  {
    title: "Prompts Creados",
    value: "78",
    change: "+2",
    changeType: "positive",
    icon: DocumentTextIcon,
  },
];

const mockActivity: ActivityItem[] = [
  {
    icon: PlusCircleIcon,
    text: (
      <p>
        Nuevo asistente <strong>"Soporte Nivel 2"</strong> fue creado.
      </p>
    ),
    time: "Hace 5m",
  },
  {
    icon: DocumentTextIcon,
    text: (
      <p>
        El prompt <strong>"Welcome"</strong> fue actualizado.
      </p>
    ),
    time: "Hace 1h",
  },
  {
    icon: UserGroupIcon,
    text: (
      <p>
        <strong>3 nuevos usuarios</strong> se registraron.
      </p>
    ),
    time: "Hace 3h",
  },
];

const quickAccessLinks: QuickAccessLink[] = [
  { name: "Gestionar Asistentes", href: "/assistants", icon: CpuChipIcon },
  {
    name: "Biblioteca de Prompts",
    href: "/master/prompts",
    icon: DocumentTextIcon,
  },
  { name: "Administrar Usuarios", href: "/master/users", icon: UserGroupIcon },
];

const topProducts: Product[] = [
  {
    name: "Asistente de Ventas Pro",
    category: "Software",
    sales: 120,
    imageUrl: "https://placehold.co/100x100/1F2937/FFFFFF?text=AVP",
  },
  {
    name: "Paquete de Soporte Básico",
    category: "Servicio",
    sales: 98,
    imageUrl: "https://placehold.co/100x100/1F2937/FFFFFF?text=PSB",
  },
  {
    name: "Integración con WhatsApp",
    category: "Add-on",
    sales: 85,
    imageUrl: "https://placehold.co/100x100/1F2937/FFFFFF?text=WA",
  },
  {
    name: "Análisis de Datos Avanzado",
    category: "Software",
    sales: 72,
    imageUrl: "https://placehold.co/100x100/1F2937/FFFFFF?text=ADA",
  },
  {
    name: "Horas de Consultoría",
    category: "Servicio",
    sales: 65,
    imageUrl: "https://placehold.co/100x100/1F2937/FFFFFF?text=HC",
  },
];

// --- Componente Reutilizable para cada Tarjeta de KPI ---
const KpiCard: FC<KpiData> = ({
  title,
  value,
  change,
  changeType,
  icon: Icon,
}) => {
  const isPositive = changeType === "positive";
  return (
    <div className="bg-gray-800 p-4 rounded-lg flex items-center">
      <div className="p-3 bg-gray-700 rounded-lg mr-4">
        <Icon className="h-6 w-6 text-gray-300" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-white mt-1">{value}</p>
        <div
          className={`flex items-center text-xs font-semibold ${
            isPositive ? "text-green-400" : "text-red-400"
          } mt-1`}
        >
          {isPositive ? (
            <ArrowUpIcon className="h-3 w-3 mr-1" />
          ) : (
            <ArrowDownIcon className="h-3 w-3 mr-1" />
          )}
          <span>{change}</span>
        </div>
      </div>
    </div>
  );
};

// --- Componente para Gráfico de Rendimiento Histórico ---
const PerformanceChart = () => {
  const [activeView, setActiveView] = useState("General");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const chartData = {
    General: [
      120, 130, 125, 150, 149, 160, 170, 165, 180, 190, 185, 200, 195, 210, 220,
      215, 230, 225, 240, 250, 245, 260, 255, 270, 280, 275, 290, 285, 300, 295,
    ],
    "Asistente de Ventas": [
      80, 85, 82, 90, 88, 95, 100, 98, 105, 110, 108, 115, 112, 120, 125, 122,
      130, 128, 135, 140, 138, 145, 142, 150, 155, 152, 160, 158, 165, 162,
    ],
    "Soporte Técnico": [
      40, 45, 43, 60, 61, 65, 70, 67, 75, 80, 77, 85, 83, 90, 95, 93, 100, 97,
      105, 110, 107, 115, 113, 120, 125, 123, 130, 127, 135, 133,
    ],
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const options = {
    chart: {
      id: "performance-chart",
      toolbar: { show: false },
      background: "transparent",
    },
    theme: { mode: "dark" as const },
    colors: ["#3b82f6"],
    stroke: { curve: "smooth" as const, width: 3 },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.5,
        opacityTo: 0.1,
        stops: [0, 90, 100],
      },
    },
    xaxis: {
      type: "datetime" as const,
      categories: new Array(30).fill(0).map((_, i) => `2024-06-${i + 1}`),
      labels: { style: { colors: "#9CA3AF" } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: { labels: { style: { colors: "#9CA3AF" } } },
    grid: { borderColor: "#374151", strokeDashArray: 4 },
    tooltip: { x: { format: "dd MMM yyyy" } },
    dataLabels: { enabled: false },
  };
  const series = [
    {
      name: "Conversaciones",
      data: chartData[activeView],
    },
  ];

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">
            Rendimiento Histórico
          </h3>
          <p className="text-sm text-gray-400">
            Conversaciones en los últimos 30 días
          </p>
        </div>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center bg-gray-700 rounded-lg px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-600 transition-colors"
          >
            <span>{activeView}</span>
            <ChevronDownIcon
              className={`h-4 w-4 ml-2 transition-transform duration-200 ${
                dropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-lg shadow-lg z-10">
              <div className="py-1">
                {Object.keys(chartData).map((view) => (
                  <button
                    key={view}
                    onClick={() => {
                      setActiveView(view);
                      setDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-600"
                  >
                    {view}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Chart options={options} series={series} type="area" height={250} />
    </div>
  );
};

// --- Componentes para Gráficos Adicionales ---
const PromptsChart = () => {
  const options = {
    chart: { id: "prompts-distribution", background: "transparent" },
    theme: { mode: "dark" as const },
    labels: ["Welcome", "Fallback", "Custom", "Error"],
    colors: ["#3B82F6", "#F59E0B", "#10B981", "#EF4444"],
    legend: { position: "bottom" as const },
    dataLabels: { enabled: false },
  };
  const series = [44, 55, 41, 17];
  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h3 className="text-lg font-semibold text-white">
        Distribución de Prompts
      </h3>
      <p className="text-sm text-gray-400 mb-4">Por tipo</p>
      <Chart options={options} series={series} type="donut" height={200} />
    </div>
  );
};

const PlatformUsageChart = () => {
  const options = {
    chart: { id: "platform-usage", background: "transparent" },
    theme: { mode: "dark" as const },
    labels: ["WhatsApp", "Instagram", "Messenger", "Telegram"],
    colors: ["#25D366", "#E1306C", "#00B2FF", "#0088CC"],
    legend: { position: "bottom" as const },
    dataLabels: { enabled: false },
  };
  const series = [448, 400, 430, 170];

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h3 className="text-lg font-semibold text-white">Uso por Plataforma</h3>
      <p className="text-sm text-gray-400 mb-4">Total de conversaciones</p>
      <Chart options={options} series={series} type="pie" height={200} />
    </div>
  );
};

// --- Componente para Slider de Productos (CORREGIDO) ---
const TopProductsSlider: FC<{ products: Product[] }> = ({ products }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? products.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === products.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h3 className="text-lg font-semibold text-white mb-4">
        Inventario Destacado
      </h3>
      <div className="relative h-48 overflow-hidden rounded-lg">
        <div
          className="flex transition-transform ease-out duration-500 h-full"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {products.map((product, index) => (
            <div key={index} className="flex-shrink-0 w-full p-2 h-full">
              <div className="bg-gray-700 rounded-lg p-4 text-center h-full flex flex-col justify-center items-center">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-16 h-16 rounded-full mb-2"
                />
                <p className="text-sm font-semibold text-white">
                  {product.name}
                </p>
                <p className="text-xs text-gray-400">{product.category}</p>
                <p className="mt-2 text-base font-bold text-green-400">
                  {product.sales}{" "}
                  <span className="text-xs font-normal text-gray-400">
                    ventas
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
        {/* Botones de Navegación */}
        <button
          onClick={prevSlide}
          className="absolute top-1/2 left-2 -translate-y-1/2 p-2 rounded-full bg-gray-900/50 hover:bg-gray-900/75 text-white z-10"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute top-1/2 right-2 -translate-y-1/2 p-2 rounded-full bg-gray-900/50 hover:bg-gray-900/75 text-white z-10"
        >
          <ChevronRightIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

// --- Componente para Actividad Reciente ---
const RecentActivity: FC<{ items: ActivityItem[] }> = ({ items }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg h-full">
      <h3 className="text-lg font-semibold text-white mb-4">
        Actividad Reciente
      </h3>
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            <div className="p-2 bg-gray-700 rounded-full">
              <item.icon className="h-5 w-5 text-gray-400" />
            </div>
            <div className="ml-3 text-sm text-gray-300 flex-grow">
              {item.text}
            </div>
            <span className="text-xs text-gray-500 whitespace-nowrap">
              {item.time}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

// --- Componente para Accesos Directos ---
const QuickAccess: FC<{ links: QuickAccessLink[] }> = ({ links }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg h-full">
      <h3 className="text-lg font-semibold text-white mb-4">
        Accesos Directos
      </h3>
      <div className="space-y-3">
        {links.map((link) => (
          <Link key={link.name} href={link.href}>
            <div className="bg-gray-700 p-3 rounded-lg flex items-center justify-between hover:bg-gray-600 transition-all">
              <div className="flex items-center">
                <link.icon className="h-5 w-5 text-gray-300" />
                <span className="ml-3 font-medium text-sm text-gray-200">
                  {link.name}
                </span>
              </div>
              <ArrowRightIcon className="h-4 w-4 text-gray-500" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

// --- Componente Principal del Dashboard ---
export default function DashboardPage() {
  return (
    <div className="p-4 md:p-8 bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {kpiMetrics.map((metric) => (
            <KpiCard key={metric.title} {...metric} />
          ))}
        </div>

        <div className="mb-6">
          <PerformanceChart />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <PromptsChart />
          <PlatformUsageChart />
          <QuickAccess links={quickAccessLinks} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentActivity items={mockActivity} />
          </div>
          <div>
            <TopProductsSlider products={topProducts} />
          </div>
        </div>
      </div>
    </div>
  );
}
