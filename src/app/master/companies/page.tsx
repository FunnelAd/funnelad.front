"use client";

import React, { useState, ChangeEvent, useMemo } from "react";
import { useModal } from "@/core/hooks/useModal"; // Ajusta la ruta a tu hook de modales
import {
  UserGroupIcon,
  CpuChipIcon,
  ChatBubbleLeftRightIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import Dropdown, { Option } from "@/presentation/components/ui/Dropdown"; // Asumiendo que tienes un Dropdown reutilizable
import { Toaster, toast } from "sonner";

// --- Tipos y Datos Iniciales ---
type Business = {
  id: string;
  name: string;
  owner: string;
  contactEmail: string;
  userCount: number;
  assistantCount: number;
  promptCount: number;
  creationDate: string; // Formato YYYY-MM-DD
  status: "Active" | "Pending" | "Suspended";
  avatarUrl?: string;
};

const initialBusinesses: Business[] = [
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
  {
    id: "4",
    name: "Data Driven Co.",
    owner: "Diana Prince",
    contactEmail: "data@driven.com",
    userCount: 50,
    assistantCount: 10,
    promptCount: 120,
    creationDate: "2024-05-20",
    status: "Active",
    avatarUrl: "https://i.pravatar.cc/150?u=company4",
  },
];

// --- MODAL "AGREGAR NEGOCIO" ACTUALIZADO ---
function AddBusinessModal({
  onBusinessAdded,
}: {
  onBusinessAdded: (newBusiness: Business) => void;
}) {
  const { hideModal } = useModal();
  const [businessName, setBusinessName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  const createBusiness = () => {
    const newBusiness: Business = {
      id: crypto.randomUUID(),
      name: businessName,
      owner: ownerName,
      contactEmail: contactEmail,
      userCount: 0,
      assistantCount: 0,
      promptCount: 0,
      creationDate: new Date().toISOString().split("T")[0], // Fecha de hoy en YYYY-MM-DD
      status: "Pending",
    };
    onBusinessAdded(newBusiness);
    return newBusiness;
  };

  const handleSave = () => {
    if (!businessName || !ownerName || !contactEmail) {
      toast.error("Por favor, completa los campos obligatorios.");
      return;
    }
    const newBusiness = createBusiness();
    toast.success(`Negocio "${newBusiness.name}" creado exitosamente.`);
    hideModal();
  };

  const handleSaveAndAddAnother = () => {
    if (!businessName || !ownerName || !contactEmail) {
      toast.error("Por favor, completa los campos obligatorios.");
      return;
    }
    const newBusiness = createBusiness();
    toast.success(
      `Negocio "${newBusiness.name}" guardado. Puedes agregar otro.`
    );

    setBusinessName("");
    setOwnerName("");
    setContactEmail("");
    setContactPhone("");
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-xl w-full max-w-2xl">
      <h2 className="text-xl font-bold text-gray-800 mb-6">
        Agregar Nuevo Negocio
      </h2>
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Negocio
            </label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Propietario
            </label>
            <input
              type="text"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email de Contacto
            </label>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono de Contacto
            </label>
            <input
              type="tel"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
      </div>
      <div className="flex justify-start items-center gap-4 pt-8 mt-4 border-t border-gray-200">
        <button
          onClick={handleSave}
          className="px-6 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Guardar
        </button>
        <button
          onClick={handleSaveAndAddAnother}
          className="px-6 py-2 font-semibold text-indigo-700 bg-indigo-100 rounded-md hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Guardar y Añadir Otro
        </button>
        <button
          onClick={hideModal}
          className="px-6 py-2 font-semibold text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

// --- MODAL "EDITAR NEGOCIO" ACTUALIZADO ---
function EditBusinessModal({
  business,
  onBusinessUpdated,
}: {
  business: Business;
  onBusinessUpdated: (updatedBusiness: Business) => void;
}) {
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
    const updatedBusiness = {
      ...business,
      name,
      owner,
      contactEmail: email,
      status: status?.value as Business["status"],
    };
    onBusinessUpdated(updatedBusiness);
    toast.success(`Negocio "${name}" actualizado correctamente.`);
    hideModal();
  };

  const handlePasswordReset = () => {
    console.log(`Iniciando reseteo de contraseña para ${email}`);
    toast.info(
      `Se ha enviado un correo para resetear la contraseña a ${email}`
    );
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

// --- Modal de Detalles ---
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
        <div className="flex flex-col items-center justify-center p-4 border rounded-lg bg-slate-50">
          <UserGroupIcon className="h-8 w-8 text-blue-500 mb-2" />
          <p className="text-2xl font-bold text-gray-800">
            {business.userCount}
          </p>
          <p className="text-sm text-gray-600">Usuarios</p>
        </div>
        <div className="flex flex-col items-center justify-center p-4 border rounded-lg bg-slate-50">
          <CpuChipIcon className="h-8 w-8 text-purple-500 mb-2" />
          <p className="text-2xl font-bold text-gray-800">
            {business.assistantCount}
          </p>
          <p className="text-sm text-gray-600">Asistentes</p>
        </div>
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

// --- Modal de Confirmación de Eliminación ---
function DeleteConfirmationModal({
  businessName,
  onConfirm,
  onCancel,
}: {
  businessName: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="p-6 bg-white rounded-lg shadow-xl w-full max-w-sm">
      <div className="flex flex-col items-center text-center">
        <div className="p-3 bg-red-100 rounded-full">
          <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
        </div>
        <h2 className="text-lg font-semibold text-gray-800 mt-4">
          ¿Estás seguro?
        </h2>
        <p className="text-sm text-gray-600 mt-2">
          Estás a punto de eliminar el negocio{" "}
          <span className="font-bold">{businessName}</span>. Esta acción no se
          puede deshacer.
        </p>
      </div>
      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={onCancel}
          className="px-6 py-2 font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          Cancelar
        </button>
        <button
          onClick={onConfirm}
          className="px-6 py-2 font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}

// --- Componente Principal ---
export default function BusinessManager() {
  const { showModal, hideModal } = useModal();
  const [businesses, setBusinesses] = useState<Business[]>(initialBusinesses);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBusinesses, setSelectedBusinesses] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterDate, setFilterDate] = useState("");
  const [filterUserCount, setFilterUserCount] = useState("");

  const handleAddBusiness = (newBusiness: Business) => {
    setBusinesses((prev) => [newBusiness, ...prev]);
  };

  const handleUpdateBusiness = (updatedBusiness: Business) => {
    setBusinesses((prev) =>
      prev.map((b) => (b.id === updatedBusiness.id ? updatedBusiness : b))
    );
  };

  const handleDeleteBusiness = (businessId: string) => {
    const businessToDelete = businesses.find((b) => b.id === businessId);
    if (!businessToDelete) return;

    const confirmDeletion = () => {
      setBusinesses((prev) => prev.filter((b) => b.id !== businessId));
      toast.success(`Negocio "${businessToDelete.name}" eliminado.`);
      hideModal();
    };

    showModal(
      <DeleteConfirmationModal
        businessName={businessToDelete.name}
        onConfirm={confirmDeletion}
        onCancel={hideModal}
      />
    );
  };

  const resetFilters = () => {
    setFilterDate("");
    setFilterUserCount("");
    setIsFilterOpen(false);
  };

  const filteredBusinesses = useMemo(() => {
    return businesses.filter((business) => {
      const matchesSearchTerm =
        business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        business.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
        business.contactEmail.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDate = filterDate
        ? business.creationDate === filterDate
        : true;
      const matchesUserCount = filterUserCount
        ? business.userCount >= parseInt(filterUserCount, 10)
        : true;
      return matchesSearchTerm && matchesDate && matchesUserCount;
    });
  }, [searchTerm, filterDate, filterUserCount, businesses]);

  const handleSelectAll = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedBusinesses(filteredBusinesses.map((business) => business.id));
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
    return new Date(dateString).toLocaleDateString("es-ES", options);
  };

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
      <Toaster richColors position="top-right" />
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Gestión de Negocios
        </h2>
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-gray-200 bg-white">
            <div className="flex items-center space-x-2 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar negocio..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div className="relative">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                >
                  <AdjustmentsHorizontalIcon className="h-5 w-5 text-gray-500" />
                  <span>Filtro</span>
                </button>
                {isFilterOpen && (
                  <div className="absolute top-full mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-xl z-10 p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-sm font-semibold text-gray-800">
                        Filtros Avanzados
                      </h4>
                      <button
                        onClick={() => setIsFilterOpen(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Fecha de Creación
                        </label>
                        <input
                          type="date"
                          value={filterDate}
                          onChange={(e) => setFilterDate(e.target.value)}
                          className="block w-full text-sm px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Mínimo de Usuarios
                        </label>
                        <input
                          type="number"
                          placeholder="Ej: 20"
                          value={filterUserCount}
                          onChange={(e) => setFilterUserCount(e.target.value)}
                          className="block w-full text-sm px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-6 border-t pt-4">
                      <button
                        onClick={resetFilters}
                        className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                      >
                        Limpiar
                      </button>
                      <button
                        onClick={() => setIsFilterOpen(false)}
                        className="px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                      >
                        Aplicar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <button
              className="inline-flex items-center bg-blue-600 text-white px-3 py-2 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors w-full md:w-auto justify-center text-sm font-medium"
              onClick={() =>
                showModal(
                  <AddBusinessModal onBusinessAdded={handleAddBusiness} />
                )
              }
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
                        filteredBusinesses.length > 0 &&
                        selectedBusinesses.length === filteredBusinesses.length
                      }
                      ref={(input) => {
                        if (input) {
                          input.indeterminate =
                            selectedBusinesses.length > 0 &&
                            selectedBusinesses.length <
                              filteredBusinesses.length;
                        }
                      }}
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
                {filteredBusinesses.length > 0 ? (
                  filteredBusinesses.map((business) => (
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
                              showModal(
                                <EditBusinessModal
                                  business={business}
                                  onBusinessUpdated={handleUpdateBusiness}
                                />
                              )
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
                            onClick={() => handleDeleteBusiness(business.id)}
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
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-10 px-4">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <MagnifyingGlassIcon className="w-12 h-12 text-gray-400 mb-3" />
                        <h3 className="text-lg font-semibold text-gray-700">
                          No se encontraron negocios
                        </h3>
                        <p className="text-sm">
                          Intenta ajustar tus filtros de búsqueda.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
