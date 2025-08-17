"use client";

import { useModal } from "@/core/hooks/useModal";
// Asegúrate que la ruta sea correcta
import AddUserModal from "@/presentation/components/features/AddModalUser";
import {
  useState,
  FC,
  ChangeEvent,
  Fragment,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { CameraIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Toaster, toast } from "sonner";

// --- Tipos y Datos de Ejemplo ---
type Permissions = {
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canViewReports: boolean;
};

type User = {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Editor" | "Viewer";
  lastLogin: string;
  status: "Active" | "Inactive";
  avatarUrl?: string;
  business: string;
  createdAgents: string[];
  permissions: Permissions;
};

const initialUsers: User[] = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice.j@example.com",
    role: "Admin",
    lastLogin: "2024-07-28",
    status: "Active",
    avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    business: "Innovate Inc.",
    createdAgents: ["Agente Alpha", "Agente Beta"],
    permissions: {
      canCreate: true,
      canEdit: true,
      canDelete: true,
      canViewReports: true,
    },
  },
  {
    id: "2",
    name: "Bob Smith",
    email: "bob.smith@example.com",
    role: "Editor",
    lastLogin: "2024-07-25",
    status: "Active",
    avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    business: "Tech Solutions",
    createdAgents: ["Agente Gamma"],
    permissions: {
      canCreate: true,
      canEdit: true,
      canDelete: false,
      canViewReports: true,
    },
  },
  {
    id: "3",
    name: "Charlie Brown",
    email: "charlie.b@example.com",
    role: "Viewer",
    lastLogin: "2024-06-15",
    status: "Inactive",
    avatarUrl: "https://i.pravatar.cc/150?u=a04258114e29026702d",
    business: "Creative Minds",
    createdAgents: [],
    permissions: {
      canCreate: false,
      canEdit: false,
      canDelete: false,
      canViewReports: true,
    },
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

function EditUserModal({
  user,
  onUpdateUser,
}: {
  user: User;
  onUpdateUser: (updatedUser: User) => void;
}) {
  const { hideModal } = useModal();
  const [formData, setFormData] = useState(user);
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    user.avatarUrl || null
  );

  useEffect(() => {
    setFormData(user);
    setPhotoPreview(user.avatarUrl || null);
  }, [user]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePermissionChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [name]: checked,
      },
    }));
  };

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newPhotoURL = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, avatarUrl: newPhotoURL }));
      setPhotoPreview(newPhotoURL);
    }
  };

  const handleUpdate = () => {
    onUpdateUser(formData);
    hideModal();
  };

  return (
    <div className="p-4 sm:p-8 bg-white rounded-xl shadow-2xl w-full max-w-5xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Editar Usuario
      </h2>

      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
              Detalles de Usuario
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Rol de Usuario
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                >
                  <option value="Admin">Admin</option>
                  <option value="Editor">Editor</option>
                  <option value="Viewer">Viewer</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Empresa
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.business}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center">
            <label htmlFor="photo-upload-edit" className="cursor-pointer">
              <div className="w-40 h-40 border-2 border-dashed border-gray-300 rounded-full flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <>
                    <CameraIcon className="w-12 h-12" />
                    <span className="text-sm mt-2">Cambiar Foto</span>
                  </>
                )}
              </div>
            </label>
            <input
              id="photo-upload-edit"
              name="photo"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handlePhotoChange}
            />
          </div>
        </div>

        <div className="pt-4 border-t">
          <h4 className="text-lg font-semibold text-gray-700 mb-2">Permisos</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="canCreate"
                checked={formData.permissions.canCreate}
                onChange={handlePermissionChange}
                className="focus:ring-orange-500 h-4 w-4 text-orange-600 border-gray-300 rounded"
              />
              <span>Crear</span>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="canEdit"
                checked={formData.permissions.canEdit}
                onChange={handlePermissionChange}
                className="focus:ring-orange-500 h-4 w-4 text-orange-600 border-gray-300 rounded"
              />
              <span>Editar</span>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="canDelete"
                checked={formData.permissions.canDelete}
                onChange={handlePermissionChange}
                className="focus:ring-orange-500 h-4 w-4 text-orange-600 border-gray-300 rounded"
              />
              <span>Eliminar</span>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="canViewReports"
                checked={formData.permissions.canViewReports}
                onChange={handlePermissionChange}
                className="focus:ring-orange-500 h-4 w-4 text-orange-600 border-gray-300 rounded"
              />
              <span>Ver Reportes</span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end items-center pt-8 mt-6 border-t border-gray-200">
        <div className="flex items-center gap-4">
          <button
            onClick={hideModal}
            className="px-6 py-2 font-semibold text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancelar
          </button>
          <button
            onClick={handleUpdate}
            className="px-6 py-2 font-semibold text-white bg-green-600 rounded-md hover:bg-green-700"
          >
            Actualizar Usuario
          </button>
        </div>
      </div>
    </div>
  );
}

function ConfirmDeleteModal({
  userName,
  onConfirm,
}: {
  userName: string;
  onConfirm: () => void;
}) {
  const { hideModal } = useModal();

  const handleConfirm = () => {
    onConfirm();
    hideModal();
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-xl w-full max-w-sm">
      <h3 className="text-lg font-bold text-gray-900 text-center">
        Confirmar Eliminación
      </h3>
      <p className="text-center text-gray-600 my-4">
        ¿Estás seguro de que quieres eliminar a{" "}
        <span className="font-bold">{userName}</span>? Esta acción no se puede
        deshacer.
      </p>
      <div className="flex justify-center gap-4 pt-4">
        <button
          onClick={hideModal}
          className="px-6 py-2 font-semibold text-gray-800 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          Cancelar
        </button>
        <button
          onClick={handleConfirm}
          className="px-6 py-2 font-semibold text-white bg-red-600 rounded-md hover:bg-red-700"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}

function ConfirmDeleteMultipleModal({
  count,
  onConfirm,
}: {
  count: number;
  onConfirm: () => void;
}) {
  const { hideModal } = useModal();

  const handleConfirm = () => {
    onConfirm();
    hideModal();
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-xl w-full max-w-sm">
      <h3 className="text-lg font-bold text-gray-900 text-center">
        Confirmar Eliminación Múltiple
      </h3>
      <p className="text-center text-gray-600 my-4">
        ¿Estás seguro de que quieres eliminar a{" "}
        <span className="font-bold">{count} usuarios</span> seleccionados? Esta
        acción no se puede deshacer.
      </p>
      <div className="flex justify-center gap-4 pt-4">
        <button
          onClick={hideModal}
          className="px-6 py-2 font-semibold text-gray-800 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          Cancelar
        </button>
        <button
          onClick={handleConfirm}
          className="px-6 py-2 font-semibold text-white bg-red-600 rounded-md hover:bg-red-700"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}

function ConfirmDeactivateMultipleModal({
  count,
  onConfirm,
}: {
  count: number;
  onConfirm: () => void;
}) {
  const { hideModal } = useModal();

  const handleConfirm = () => {
    onConfirm();
    hideModal();
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-xl w-full max-w-sm">
      <h3 className="text-lg font-bold text-gray-900 text-center">
        Confirmar Desactivación
      </h3>
      <p className="text-center text-gray-600 my-4">
        ¿Estás seguro de que quieres desactivar a{" "}
        <span className="font-bold">{count} usuarios</span> seleccionados?
      </p>
      <div className="flex justify-center gap-4 pt-4">
        <button
          onClick={hideModal}
          className="px-6 py-2 font-semibold text-gray-800 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          Cancelar
        </button>
        <button
          onClick={handleConfirm}
          className="px-6 py-2 font-semibold text-white bg-yellow-600 rounded-md hover:bg-yellow-700"
        >
          Desactivar
        </button>
      </div>
    </div>
  );
}

function ConfirmActivateMultipleModal({
  count,
  onConfirm,
}: {
  count: number;
  onConfirm: () => void;
}) {
  const { hideModal } = useModal();

  const handleConfirm = () => {
    onConfirm();
    hideModal();
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-xl w-full max-w-sm">
      <h3 className="text-lg font-bold text-gray-900 text-center">
        Confirmar Activación
      </h3>
      <p className="text-center text-gray-600 my-4">
        ¿Estás seguro de que quieres activar a{" "}
        <span className="font-bold">{count} usuarios</span> seleccionados?
      </p>
      <div className="flex justify-center gap-4 pt-4">
        <button
          onClick={hideModal}
          className="px-6 py-2 font-semibold text-gray-800 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          Cancelar
        </button>
        <button
          onClick={handleConfirm}
          className="px-6 py-2 font-semibold text-white bg-green-600 rounded-md hover:bg-green-700"
        >
          Activar
        </button>
      </div>
    </div>
  );
}

interface Option {
  value: string;
  label: string;
}

const MultiSelectDropdown: FC<{
  options: Option[];
  onSelect: (selected: string[]) => void;
  selectedValues: string[];
  label: string;
  isOpen: boolean;
  onToggle: () => void;
}> = ({ options, onSelect, selectedValues, label, isOpen, onToggle }) => {
  // CAMBIO: Se añade un ref y un useEffect para detectar clics fuera del componente
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onToggle();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onToggle]);

  const handleSelect = (value: string) => {
    const newSelection = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];
    onSelect(newSelection);
  };

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      <button
        type="button"
        onClick={onToggle}
        className="inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-xs text-gray-700 hover:bg-gray-50"
      >
        {label}
        {selectedValues.length > 0 && (
          <span className="ml-2 bg-blue-500 text-white text-xs font-semibold rounded-full px-2 py-0.5">
            {selectedValues.length}
          </span>
        )}
        <svg
          className={`-mr-1 ml-2 h-4 w-4 transform transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
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
      <div
        className={`origin-top-left absolute z-10 left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 transition-all duration-200 ease-out ${
          isOpen
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <div className="py-1">
          {options.map((option) => (
            <label
              key={option.value}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedValues.includes(option.value)}
                onChange={() => handleSelect(option.value)}
                className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              {option.label}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Componente Principal ---
export default function UserManager() {
  const { showModal } = useModal();
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [roleFilter, setRoleFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [openFilter, setOpenFilter] = useState<string | null>(null);

  const handleAddNewUser = (newUser: User) => {
    setUsers((prevUsers) => [...prevUsers, newUser]);
    toast.success(`Usuario "${newUser.name}" creado exitosamente.`);
  };

  const handleDeleteUser = (userId: string) => {
    const userToDelete = users.find((u) => u.id === userId);
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    if (userToDelete) {
      toast.success(`Usuario "${userToDelete.name}" ha sido eliminado.`);
    }
  };

  const handleDeleteSelected = () => {
    const count = selectedUsers.length;
    setUsers((prevUsers) =>
      prevUsers.filter((user) => !selectedUsers.includes(user.id))
    );
    setSelectedUsers([]);
    toast.success(
      `${count} ${
        count > 1 ? "usuarios han sido eliminados" : "usuario ha sido eliminado"
      }.`
    );
  };

  const handleDeactivateSelected = () => {
    const count = selectedUsers.length;
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        selectedUsers.includes(user.id) ? { ...user, status: "Inactive" } : user
      )
    );
    setSelectedUsers([]);
    toast.success(
      `${count} ${
        count > 1
          ? "usuarios han sido desactivados"
          : "usuario ha sido desactivado"
      }.`
    );
  };

  const handleActivateSelected = () => {
    const count = selectedUsers.length;
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        selectedUsers.includes(user.id) ? { ...user, status: "Active" } : user
      )
    );
    setSelectedUsers([]);
    toast.success(
      `${count} ${
        count > 1 ? "usuarios han sido activados" : "usuario ha sido activado"
      }.`
    );
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );
    toast.success(`Usuario "${updatedUser.name}" actualizado correctamente.`);
  };

  const handleToggleRow = (id: string) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedUsers(filteredUsers.map((user) => user.id));
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

  const selectionStatus = useMemo(() => {
    if (selectedUsers.length === 0) {
      return { canActivate: false, canDeactivate: false };
    }
    const selectedUsersDetails = users.filter((user) =>
      selectedUsers.includes(user.id)
    );
    const allActive = selectedUsersDetails.every(
      (user) => user.status === "Active"
    );
    const allInactive = selectedUsersDetails.every(
      (user) => user.status === "Inactive"
    );

    return {
      canActivate: allInactive,
      canDeactivate: allActive,
    };
  }, [selectedUsers, users]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const roleMatch =
        roleFilter.length === 0 || roleFilter.includes(user.role);
      const statusMatch =
        statusFilter.length === 0 || statusFilter.includes(user.status);
      const searchMatch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      return roleMatch && statusMatch && searchMatch;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

  const roleOptions: Option[] = [
    { value: "Admin", label: "Admin" },
    { value: "Editor", label: "Editor" },
    { value: "Viewer", label: "Viewer" },
  ];

  const statusOptions: Option[] = [
    { value: "Active", label: "Activo" },
    { value: "Inactive", label: "Inactivo" },
  ];

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
      <Toaster position="top-right" richColors />
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Gestión de Usuarios
        </h2>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-gray-200 bg-white">
            <div className="flex items-center space-x-2 w-full md:w-auto">
              {selectedUsers.length > 0 ? (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      showModal(
                        <ConfirmActivateMultipleModal
                          count={selectedUsers.length}
                          onConfirm={handleActivateSelected}
                        />
                      )
                    }
                    disabled={!selectionStatus.canActivate}
                    className="inline-flex items-center bg-green-500 text-white px-3 py-2 rounded-md shadow-sm hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                  >
                    <svg
                      className="h-5 w-5 mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                    <span>Activar ({selectedUsers.length})</span>
                  </button>
                  <button
                    onClick={() =>
                      showModal(
                        <ConfirmDeactivateMultipleModal
                          count={selectedUsers.length}
                          onConfirm={handleDeactivateSelected}
                        />
                      )
                    }
                    disabled={!selectionStatus.canDeactivate}
                    className="inline-flex items-center bg-yellow-500 text-white px-3 py-2 rounded-md shadow-sm hover:bg-yellow-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                  >
                    <svg
                      className="h-5 w-5 mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                      />
                    </svg>
                    <span>Desactivar ({selectedUsers.length})</span>
                  </button>
                  <button
                    onClick={() =>
                      showModal(
                        <ConfirmDeleteMultipleModal
                          count={selectedUsers.length}
                          onConfirm={handleDeleteSelected}
                        />
                      )
                    }
                    className="inline-flex items-center bg-red-600 text-white px-3 py-2 rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors text-sm font-medium"
                  >
                    <TrashIcon className="h-5 w-5 mr-2" />
                    <span>Eliminar ({selectedUsers.length})</span>
                  </button>
                </div>
              ) : (
                <>
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
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <MultiSelectDropdown
                    label="Rol"
                    options={roleOptions}
                    selectedValues={roleFilter}
                    onSelect={setRoleFilter}
                    isOpen={openFilter === "role"}
                    onToggle={() =>
                      setOpenFilter((prev) => (prev === "role" ? null : "role"))
                    }
                  />
                  <MultiSelectDropdown
                    label="Estado"
                    options={statusOptions}
                    selectedValues={statusFilter}
                    onSelect={setStatusFilter}
                    isOpen={openFilter === "status"}
                    onToggle={() =>
                      setOpenFilter((prev) =>
                        prev === "status" ? null : "status"
                      )
                    }
                  />
                </>
              )}
            </div>
            <button
              className="inline-flex items-center bg-blue-600 text-white px-3 py-2 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors w-full md:w-auto justify-center text-sm font-medium"
              onClick={() =>
                showModal(<AddUserModal onAddUser={handleAddNewUser} />)
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
              <span>Agregar Usuario</span>
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
                        filteredUsers.length > 0 &&
                        selectedUsers.length === filteredUsers.length
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
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <Fragment key={user.id}>
                      <tr>
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
                                showModal(
                                  <EditUserModal
                                    user={user}
                                    onUpdateUser={handleUpdateUser}
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
                              onClick={() =>
                                showModal(
                                  <ConfirmDeleteModal
                                    userName={user.name}
                                    onConfirm={() => handleDeleteUser(user.id)}
                                  />
                                )
                              }
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
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <button
                            onClick={() => handleToggleRow(user.id)}
                            className="p-1 rounded-full hover:bg-gray-200"
                          >
                            <svg
                              className={`h-5 w-5 text-gray-500 transform transition-transform duration-300 ease-out ${
                                expandedRows.includes(user.id)
                                  ? "rotate-180"
                                  : ""
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
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-10">
                      <div className="flex flex-col items-center">
                        <svg
                          className="w-12 h-12 text-gray-300"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                          />
                        </svg>
                        <p className="mt-2 text-sm text-gray-500">
                          No se encontraron usuarios con los filtros
                          seleccionados.
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
