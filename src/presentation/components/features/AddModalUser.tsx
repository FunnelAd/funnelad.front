"use client";

import React, { useState, ChangeEvent } from "react";
import { useModal } from "@/core/hooks/useModal";
import { CameraIcon, TrashIcon } from "@heroicons/react/24/outline";

// --- Tipos para el formulario ---
type Permissions = {
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canViewReports: boolean;
};

type FormData = {
  fullName: string;
  email: string;
  role: "Admin" | "Editor" | "Viewer" | "";
  permissions: Permissions;
  company: string;
  photo: File | null;
  avatarUrl?: string;
};

// --- Propiedades del Componente ---
type AddUserModalProps = {
  onAddUser: (newUser: any) => void;
};

// --- Componente del Modal para Agregar Usuario ---
export default function AddUserModal({ onAddUser }: AddUserModalProps) {
  const { hideModal } = useModal();
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    role: "Viewer", // Rol por defecto
    company: "",
    permissions: {
      canCreate: false,
      canEdit: false,
      canDelete: false,
      canViewReports: true,
    },
    photo: null,
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
      setFormData((prev) => ({ ...prev, photo: file }));
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = () => {
    // Se construye el objeto de usuario completo para pasarlo al padre
    const newUser = {
      id: Date.now().toString(),
      name: formData.fullName,
      email: formData.email,
      role: formData.role,
      lastLogin: new Date().toISOString().split("T")[0],
      status: "Active" as "Active",
      avatarUrl: photoPreview || "",
      company: formData.company,
      createdAgents: [],
      permissions: formData.permissions, // Se incluyen los permisos
    };

    onAddUser(newUser); // Se llama a la función del padre
    hideModal(); // No hay 'alert' ni 'toast' aquí
  };

  return (
    <div className="p-4 sm:p-8 bg-white rounded-xl shadow-2xl w-full max-w-5xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Crear Nuevo Usuario
      </h2>

      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
              Detalles de Usuario y Roles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
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
                  value={formData.company}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center">
            <label htmlFor="photo-upload" className="cursor-pointer">
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
                    <span className="text-sm mt-2">Añadir Foto</span>
                  </>
                )}
              </div>
            </label>
            <input
              id="photo-upload"
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
            onClick={handleSave}
            className="px-6 py-2 font-semibold text-white bg-orange-500 rounded-md hover:bg-orange-600"
          >
            Guardar Usuario
          </button>
        </div>
      </div>
    </div>
  );
}
