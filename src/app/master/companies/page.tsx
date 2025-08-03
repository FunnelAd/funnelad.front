"use client";

import React, { useState, FC, ChangeEvent } from "react";
import { useModal } from "@/core/hooks/useModal"; // Ajusta la ruta a tu hook de modales
import {
  UserGroupIcon,
  CpuChipIcon,
  ChatBubbleLeftRightIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import Dropdown, { Option } from "@/presentation/components/ui/Dropdown"; // Asumiendo que tienes un Dropdown reutilizable

// --- Tipos y Datos de Ejemplo ---
type Business = {
  id: string;
  name: string;
  owner: string;
  contactEmail: string;
  userCount: number;
  assistantCount: number;
  promptCount: number;
  creationDate: string;
  status: "Active" | "Pending" | "Suspended";
  avatarUrl?: string;
};

const mockBusinesses: Business[] = [
  {
    id: "1",
    name: "Innovate Inc.",
    owner: "Alice Johnson",
    contactEmail: "contact@innovate.com",
    userCount: 25,
    assistantCount: 5,
    promptCount: 42,
    creationDate: "2024-05-20",
    status: "Active",
    avatarUrl: "https://i.pravatar.cc/150?u=company1",
  },
  {
    id: "2",
    name: "Tech Solutions",
    owner: "Bob Smith",
    contactEmail: "support@techsolutions.dev",
    userCount: 12,
    assistantCount: 2,
    promptCount: 15,
    creationDate: "2024-06-15",
    status: "Pending",
    avatarUrl: "https://i.pravatar.cc/150?u=company2",
  },
  {
    id: "3",
    name: "Creative Minds",
    owner: "Charlie Brown",
    contactEmail: "hello@creativeminds.art",
    userCount: 8,
    assistantCount: 1,
    promptCount: 8,
    creationDate: "2024-07-01",
    status: "Suspended",
    avatarUrl: "https://i.pravatar.cc/150?u=company3",
  },
];

// --- Modales (Plantillas) ---
function AddBusinessModal() {
  const { hideModal } = useModal();
  return (
    <div className="p-6 bg-white rounded-lg shadow-xl w-full max-w-md">
      <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
        Agregar Nuevo Negocio
      </h2>
      {/* Aquí iría el formulario para agregar un negocio */}
      <div className="flex justify-center pt-8">
        <button
          onClick={hideModal}
          className="px-5 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Guardar
        </button>
      </div>
    </div>
  );
}

function EditBusinessModal({ business }: { business: Business }) {
  const { hideModal } = useModal();
  const [name, setName] = useState(business.name);
  const [owner, setOwner] = useState(business.owner);
  const [email, setEmail] = useState(business.contactEmail);

  const statusOptions: Option[] = [
    { value: "Active", label: "Activo" },
    { value: "Pending", label: "Pendiente" },
    { value: "Suspended", label: "Suspendido" },
  ];
  const findOption = (options: Option[], value: string) =>
    options.find((opt) => opt.value === value) || null;
  const [status, setStatus] = useState<Option | null>(
    findOption(statusOptions, business.status)
  );

  const handleUpdate = () => {
    console.log("Actualizando negocio:", {
      id: business.id,
      name,
      owner,
      email,
      status: status?.value,
    });
    hideModal();
  };

  const handlePasswordReset = () => {
    console.log(`Iniciando reseteo de contraseña para ${email}`);
    alert(`Se ha enviado un correo para resetear la contraseña a ${email}`);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-xl w-full max-w-md">
      <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
        Editar Negocio
      </h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nombre del Negocio
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nombre del Propietario
          </label>
          <input
            type="text"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email de Contacto
          </label>
          <div className="flex items-center space-x-2 mt-1">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button
              onClick={handlePasswordReset}
              className="px-3 py-2 text-xs font-medium text-blue-600 border border-gray-300 rounded-md hover:bg-gray-50 whitespace-nowrap"
            >
              Resetear Contraseña
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Estado
          </label>
          <Dropdown
            options={statusOptions}
            onSelect={(option) => setStatus(option)}
            placeholder="Seleccionar estado"
            value={status}
          />
        </div>
      </div>
      <div className="flex justify-center pt-8">
        <button
          onClick={handleUpdate}
          className="px-5 py-2 font-semibold text-white bg-green-600 rounded-md hover:bg-green-700"
        >
          Actualizar
        </button>
      </div>
    </div>
  );
}

// --- Nuevo Modal de Detalles ---
function BusinessDetailsModal({ business }: { business: Business }) {
  const { hideModal } = useModal();
  return (
    <div className="p-6 bg-white rounded-lg shadow-xl w-full max-w-lg">
      <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">
        Detalles de {business.name}
      </h2>
      <p className="text-sm text-gray-500 text-center mb-6">
        {business.contactEmail}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card de Usuarios */}
        <div className="flex flex-col items-center justify-center p-4 border rounded-lg bg-slate-50">
          <UserGroupIcon className="h-8 w-8 text-blue-500 mb-2" />
          <p className="text-2xl font-bold text-gray-800">
            {business.userCount}
          </p>
          <p className="text-sm text-gray-600">Usuarios</p>
        </div>
        {/* Card de Asistentes */}
        <div className="flex flex-col items-center justify-center p-4 border rounded-lg bg-slate-50">
          <CpuChipIcon className="h-8 w-8 text-purple-500 mb-2" />
          <p className="text-2xl font-bold text-gray-800">
            {business.assistantCount}
          </p>
          <p className="text-sm text-gray-600">Asistentes</p>
        </div>
        {/* Card de Prompts */}
        <div className="flex flex-col items-center justify-center p-4 border rounded-lg bg-slate-50">
          <ChatBubbleLeftRightIcon className="h-8 w-8 text-green-500 mb-2" />
          <p className="text-2xl font-bold text-gray-800">
            {business.promptCount}
          </p>
          <p className="text-sm text-gray-600">Prompts</p>
        </div>
      </div>
      <div className="flex justify-center pt-8">
        <button
          onClick={hideModal}
          className="px-5 py-2 font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}

// --- Componente Principal ---
export default function BusinessManager() {
  const { showModal } = useModal();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBusinesses, setSelectedBusinesses] = useState<string[]>([]);

  const handleSelectAll = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedBusinesses(mockBusinesses.map((business) => business.id));
    } else {
      setSelectedBusinesses([]);
    }
  };

  const handleSelectOne = (e: ChangeEvent<HTMLInputElement>, id: string) => {
    if (e.target.checked) {
      setSelectedBusinesses((prev) => [...prev, id]);
    } else {
      setSelectedBusinesses((prev) =>
        prev.filter((businessId) => businessId !== id)
      );
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getInitials = (name: string) => {
    const names = name.split(" ");
    if (names.length > 1 && names[1]) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Gestión de Negocios
        </h2>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-gray-200 bg-white">
            <div className="flex items-center space-x-2 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Buscar negocio..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <button className="px-3 py-2 border border-gray-300 rounded-md text-xs text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                <span>Filtro</span>
                <svg
                  className="h-4 w-4 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>
            <button
              className="inline-flex items-center bg-blue-600 text-white px-3 py-2 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors w-full md:w-auto justify-center text-sm font-medium"
              onClick={() => showModal(<AddBusinessModal />)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <span>Agregar Negocio</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-slate-100">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      onChange={handleSelectAll}
                      checked={
                        selectedBusinesses.length === mockBusinesses.length &&
                        mockBusinesses.length > 0
                      }
                    />
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider"
                  >
                    Negocio
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider"
                  >
                    Propietario
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider"
                  >
                    Fecha de Creación
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider"
                  >
                    Usuarios
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider"
                  >
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockBusinesses.map((business) => (
                  <tr
                    key={business.id}
                    className={
                      selectedBusinesses.includes(business.id)
                        ? "bg-blue-50"
                        : ""
                    }
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        checked={selectedBusinesses.includes(business.id)}
                        onChange={(e) => handleSelectOne(e, business.id)}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-full"
                            src={business.avatarUrl}
                            alt={business.name}
                            onError={(e) =>
                              (e.currentTarget.src =
                                "https://placehold.co/40x40/E0E7FF/4F46E5?text=B")
                            }
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {business.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {business.contactEmail}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {business.owner}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(business.creationDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium text-center">
                      {business.userCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                      <div className="flex items-center justify-center space-x-4">
                        <button
                          onClick={() =>
                            showModal(
                              <BusinessDetailsModal business={business} />
                            )
                          }
                          className="text-gray-400 hover:text-blue-600"
                          title="Ver Detalles"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() =>
                            showModal(<EditBusinessModal business={business} />)
                          }
                          className="text-gray-400 hover:text-indigo-600"
                          title="Editar"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                            <path
                              fillRule="evenodd"
                              d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                        <button
                          className="text-gray-400 hover:text-red-600"
                          title="Eliminar"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
