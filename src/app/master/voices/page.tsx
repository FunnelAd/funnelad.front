"use client";

import Dropdown, { Option } from "@/presentation/components/ui/Dropdown";
import { useModal } from "@/core/hooks/useModal";
import { useState, FC, ChangeEvent } from "react";
import { IVoice } from "@/core/types/voices"; // Asumiendo que este tipo está definido en tu proyecto

// --- Datos y Tipos ---
const mockVoices: IVoice[] = [
  {
    id: "1",
    name: "Joanna Banana",
    gender: "female",
    provider: "Google",
    language: "en-US",
    status: "active",
  },
  {
    id: "2",
    name: "Arnold",
    gender: "male",
    provider: "ElevenLabs",
    language: "en-UK",
    status: "active",
  },
  {
    id: "3",
    name: "Carla",
    gender: "female",
    provider: "Google",
    language: "es-ES",
    status: "active",
  },
];

// --- Componente para la Insignia de Estado ---
const StatusBadge: FC<{ status: "active"  | "inactive" }> = ({
  status,
}) => {
  const baseClasses =
    "px-2 inline-flex text-xs leading-5 font-semibold rounded-full";
  const statusClasses = {
    active: "bg-green-100 text-green-800",
    // Pending: "bg-yellow-100 text-yellow-800",
    inactive: "bg-red-100 text-red-800",
  };

  return (
    <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>
  );
};

// --- Modales ---

function AddVoiceModal() {
  const { hideModal } = useModal();
  const [voiceName, setVoiceName] = useState<string>("");
  const [selectedGender, setSelectedGender] = useState<Option | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<Option | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<Option | null>(null);

  const handleSave = () => {
    console.log("Guardando:", {
      name: voiceName,
      gender: selectedGender,
      provider: selectedProvider,
      status: selectedStatus,
    });
    hideModal();
  };

  const genderOptions: Option[] = [
    { value: "male", label: "Masculino" },
    { value: "female", label: "Femenino" },
  ];
  const providerOptions: Option[] = [
    { value: "google", label: "Google" },
    { value: "elevenlabs", label: "ElevenLabs" },
  ];
  const statusOptions: Option[] = [
    { value: "Active", label: "Activo" },
    { value: "Pending", label: "Pendiente" },
    { value: "Inactive", label: "Inactivo" },
  ];

  const handleGenderSelect = (option: Option) => setSelectedGender(option);
  const handleProviderSelect = (option: Option) => setSelectedProvider(option);
  const handleStatusSelect = (option: Option) => setSelectedStatus(option);

  return (
    <div className="p-6 bg-white rounded-lg shadow-xl w-full max-w-md">
      <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
        Agregar nueva voz
      </h2>
      <div className="space-y-5">
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700">
            Nombre
          </label>
          <input
            type="text"
            placeholder="Ej: Arnold"
            value={voiceName}
            onChange={(e) => setVoiceName(e.target.value)}
            className="px-3 py-2 text-gray-800 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700">
            Género
          </label>
          <Dropdown
            options={genderOptions}
            onSelect={handleGenderSelect}
            placeholder="Elige un género"
            value={selectedGender}
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700">
            Proveedor
          </label>
          <Dropdown
            options={providerOptions}
            onSelect={handleProviderSelect}
            placeholder="Elige un proveedor"
            value={selectedProvider}
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700">
            Estado
          </label>
          <Dropdown
            options={statusOptions}
            onSelect={handleStatusSelect}
            placeholder="Elige un estado"
            value={selectedStatus}
          />
        </div>
      </div>
      <div className="flex justify-center pt-8">
        <button
          onClick={handleSave}
          className="px-5 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Guardar
        </button>
      </div>
    </div>
  );
}

function EditVoiceModal({ voice }: { voice: IVoice }) {
  const { hideModal } = useModal();

  const genderOptions: Option[] = [
    { value: "male", label: "Masculino" },
    { value: "female", label: "Femenino" },
  ];
  const providerOptions: Option[] = [
    { value: "google", label: "Google" },
    { value: "elevenlabs", label: "ElevenLabs" },
  ];
  const statusOptions: Option[] = [
    { value: "Active", label: "Activo" },
    { value: "Pending", label: "Pendiente" },
    { value: "Inactive", label: "Inactivo" },
  ];

  const findOption = (options: Option[], value: string) =>
    options.find(
      (opt) =>
        opt.label.toLowerCase() === value.toLowerCase() ||
        opt.value.toLowerCase() === value.toLowerCase()
    ) || null;

  const [voiceName, setVoiceName] = useState<string>(voice.name);
  const [selectedGender, setSelectedGender] = useState<Option | null>(
    findOption(genderOptions, voice.gender)
  );
  const [selectedProvider, setSelectedProvider] = useState<Option | null>(
    findOption(providerOptions, voice.provider)
  );
  const [selectedStatus, setSelectedStatus] = useState<Option | null>(
    findOption(statusOptions, voice.status)
  );

  const handleGenderSelect = (option: Option) => setSelectedGender(option);
  const handleProviderSelect = (option: Option) => setSelectedProvider(option);
  const handleStatusSelect = (option: Option) => setSelectedStatus(option);

  const handleUpdate = () => {
    console.log("Actualizando:", {
      id: voice.id,
      name: voiceName,
      gender: selectedGender,
      provider: selectedProvider,
      status: selectedStatus,
    });
    hideModal();
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-xl w-full max-w-md">
      <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
        Editar voz: {voice.name}
      </h2>
      <div className="space-y-5">
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700">
            Nombre
          </label>
          <input
            type="text"
            value={voiceName}
            onChange={(e) => setVoiceName(e.target.value)}
            className="px-3 py-2 text-gray-800 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700">
            Género
          </label>
          <Dropdown
            options={genderOptions}
            onSelect={handleGenderSelect}
            placeholder="Elige un género"
            value={selectedGender}
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700">
            Proveedor
          </label>
          <Dropdown
            options={providerOptions}
            onSelect={handleProviderSelect}
            placeholder="Elige un proveedor"
            value={selectedProvider}
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700">
            Estado
          </label>
          <Dropdown
            options={statusOptions}
            onSelect={handleStatusSelect}
            placeholder="Elige un estado"
            value={selectedStatus}
          />
        </div>
      </div>
      <div className="flex justify-center pt-8">
        <button
          onClick={handleUpdate}
          className="px-5 py-2 font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Actualizar
        </button>
      </div>
    </div>
  );
}

// --- Componente Principal ---

export default function VoiceManager() {
  const { showModal } = useModal();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVoices, setSelectedVoices] = useState<string[]>([]);

  const handleSelectAll = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allVoiceIds = mockVoices.map((voice) => voice.id);
      setSelectedVoices(allVoiceIds);
    } else {
      setSelectedVoices([]);
    }
  };

  const handleSelectOne = (e: ChangeEvent<HTMLInputElement>, id: string) => {
    if (e.target.checked) {
      setSelectedVoices((prev) => [...prev, id]);
    } else {
      setSelectedVoices((prev) => prev.filter((voiceId) => voiceId !== id));
    }
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
          Control de Voces
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
                  placeholder="Buscar voz..."
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
              onClick={() => showModal(<AddVoiceModal />)}
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
              <span>Agregar Voz</span>
            </button>
          </div>

          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-slate-100">
              <tr>
                <th scope="col" className="px-6 py-2 text-left">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      onChange={handleSelectAll}
                      checked={
                        selectedVoices.length === mockVoices.length &&
                        mockVoices.length > 0
                      }
                    />
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-2 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider"
                >
                  Voz
                </th>
                <th
                  scope="col"
                  className="px-6 py-2 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider"
                >
                  Proveedor
                </th>
                <th
                  scope="col"
                  className="px-6 py-2 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider"
                >
                  Género
                </th>
                <th
                  scope="col"
                  className="px-6 py-2 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider"
                >
                  Estado
                </th>
                <th
                  scope="col"
                  className="px-6 py-2 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider pr-8"
                >
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockVoices.map((voice) => (
                <tr
                  key={voice.id}
                  className={
                    selectedVoices.includes(voice.id) ? "bg-blue-50" : ""
                  }
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      checked={selectedVoices.includes(voice.id)}
                      onChange={(e) => handleSelectOne(e, voice.id)}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full font-bold">
                        {getInitials(voice.name)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {voice.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {voice.provider}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                    {voice.gender}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={voice.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right pr-8">
                    <div className="flex items-center justify-end space-x-4">
                      <button
                        onClick={() =>
                          showModal(<EditVoiceModal voice={voice} />)
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
  );
}
