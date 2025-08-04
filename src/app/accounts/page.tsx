"use client";

import { useModal } from "@/core/hooks/useModal";
import { useState, FC, ChangeEvent, Fragment } from "react";

// --- Tipos y Datos de Ejemplo ---
type User = {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Editor" | "Viewer";
  lastLogin: string;
  status: "Active" | "Inactive";
  avatarUrl?: string;
  company: string;
  createdAgents: string[];
};

const mockUsers: User[] = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice.j@example.com",
    role: "Admin",
    lastLogin: "2024-07-28",
    status: "Active",
    avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    company: "Innovate Inc.",
    createdAgents: ["Agente Alpha", "Agente Beta"],
  },
  {
    id: "2",
    name: "Bob Smith",
    email: "bob.smith@example.com",
    role: "Editor",
    lastLogin: "2024-07-25",
    status: "Active",
    avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    company: "Tech Solutions",
    createdAgents: ["Agente Gamma"],
  },
  {
    id: "3",
    name: "Charlie Brown",
    email: "charlie.b@example.com",
    role: "Viewer",
    lastLogin: "2024-06-15",
    status: "Inactive",
    avatarUrl: "https://i.pravatar.cc/150?u=a04258114e29026702d",
    company: "Creative Minds",
    createdAgents: [],
  },
];

// --- Componentes de la UI ---

const RoleBadge: FC<{ role: User["role"] }> = ({ role }) => {
  const roleClasses = {
    Admin: "bg-purple-100 text-purple-800",
    Editor: "bg-blue-100 text-blue-800",
    Viewer: "bg-gray-100 text-gray-800",
  };
  return (
    <span
      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${roleClasses[role]}`}
    >
      {role}
    </span>
  );
};

const StatusBadge: FC<{ status: User["status"] }> = ({ status }) => {
  const statusClasses = {
    Active: "bg-green-100 text-green-800",
    Inactive: "bg-red-100 text-red-800",
  };
  return (
    <span
      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClasses[status]}`}
    >
      {status}
    </span>
  );
};

// --- Modales ---
function AddUserModal() {
  const { hideModal } = useModal();
  return (
    <div className="p-6 bg-white rounded-lg shadow-xl w-full max-w-md">
      <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
        Agregar Nuevo Usuario
      </h2>
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

function EditUserModal({ user }: { user: User }) {
  const { hideModal } = useModal();
  return (
    <div className="p-6 bg-white rounded-lg shadow-xl w-full max-w-md">
      <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
        Editar Usuario: {user.name}
      </h2>
      <div className="flex justify-center pt-8">
        <button
          onClick={hideModal}
          className="px-5 py-2 font-semibold text-white bg-green-600 rounded-md hover:bg-green-700"
        >
          Actualizar
        </button>
      </div>
    </div>
  );
}

// --- Componente Principal ---
export default function AccountManager() {
  const { showModal } = useModal();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [expandedRows, setExpandedRows] = useState<string[]>([]);

  const handleToggleRow = (id: string) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedUsers(mockUsers.map((user) => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectOne = (e: ChangeEvent<HTMLInputElement>, id: string) => {
    if (e.target.checked) {
      setSelectedUsers((prev) => [...prev, id]);
    } else {
      setSelectedUsers((prev) => prev.filter((userId) => userId !== id));
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

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Gestión de Cuentas
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
                  placeholder="Buscar usuario..."
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
              onClick={() => showModal(<AddUserModal />)}
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
              <span>Agregar Cuenta</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-100">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      onChange={handleSelectAll}
                      checked={
                        selectedUsers.length === mockUsers.length &&
                        mockUsers.length > 0
                      }
                    />
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider"
                  >
                    Usuario
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider"
                  >
                    Rol
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider"
                  >
                    Último Acceso
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider"
                  >
                    Estado
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider"
                  >
                    Acciones
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Expandir</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockUsers.map((user) => (
                  <Fragment key={user.id}>
                    <tr
                      className={
                        selectedUsers.includes(user.id) ? "bg-blue-50" : ""
                      }
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          checked={selectedUsers.includes(user.id)}
                          onChange={(e) => handleSelectOne(e, user.id)}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img
                              className="h-10 w-10 rounded-full"
                              src={user.avatarUrl}
                              alt={user.name}
                              onError={(e) =>
                                (e.currentTarget.src =
                                  "https://placehold.co/40x40/E0E7FF/4F46E5?text=U")
                              }
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <RoleBadge role={user.role} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(user.lastLogin)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={user.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                        <div className="flex items-center justify-center space-x-4">
                          <button
                            onClick={() =>
                              showModal(<EditUserModal user={user} />)
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
                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-h3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => handleToggleRow(user.id)}
                          className="p-1 rounded-full hover:bg-gray-200"
                        >
                          <svg
                            className={`h-5 w-5 text-gray-500 transform transition-transform duration-300 ease-out ${
                              expandedRows.includes(user.id) ? "rotate-180" : ""
                            }`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                    {/* --- Fila de Detalles Expandible --- */}
                    <tr>
                      <td
                        colSpan={7}
                        className="p-0"
                        style={{ transition: "padding 0.3s ease-out" }}
                      >
                        <div
                          className={`grid transition-all duration-300 ease-out ${
                            expandedRows.includes(user.id)
                              ? "grid-rows-[1fr]"
                              : "grid-rows-[0fr]"
                          }`}
                        >
                          <div className="overflow-hidden">
                            <div className="p-4 bg-slate-50 flex items-center space-x-6">
                              <div className="flex items-baseline space-x-2">
                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                  Empresa:
                                </h4>
                                <p className="text-xs text-gray-700">
                                  {user.company}
                                </p>
                              </div>
                              <div className="flex items-baseline space-x-2">
                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                  Agentes Creados:
                                </h4>
                                <p className="text-xs font-bold text-gray-800">
                                  {user.createdAgents.length}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
