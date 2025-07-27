"use client";

import Dropdown, { Option } from "@/presentation/components/ui/Dropdown";
import { useModal } from "@/core/hooks/useModal";
import { useState } from "react";
import { IVoice } from "@/core/types/voices"; // Asumiendo que este tipo está definido en tu proyecto

const mockVoices: IVoice[] = [
  {
    id: "1",
    name: "Joanna Banana",
    gender: "female",
    provider: "Google",
    language: "en-US",
  },
  {
    id: "2",
    name: "Arnold",
    gender: "male",
    provider: "ElevenLabs",
    language: "en-UK",
  },
];

function AddVoiceModal() {
  const { hideModal } = useModal();
  const [voiceName, setVoiceName] = useState<string>("");
  const [selectedVoice, setSelectedVoice] = useState<Option | null>(null);
  const [selectedGender, setSelectedGender] = useState<Option | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<Option | null>(null); // Nuevo estado

  const handleSave = () => {
    console.log("Guardando:", {
      name: voiceName,
      voice: selectedVoice,
      gender: selectedGender,
      provider: selectedProvider, // Se incluye en el guardado
    });
    hideModal();
  };

  const voiceOptions: Option[] = [
    { value: "anna", label: "Anna" },
    { value: "luca", label: "Luca" },
    { value: "fernando", label: "Fernando" },
    { value: "usuga", label: "Usuga" },
  ];

  const genderOptions: Option[] = [
    { value: "male", label: "Masculino" },
    { value: "female", label: "Femenino" },
    { value: "other", label: "Otro" },
  ];

  // Nuevas opciones para el proveedor
  const providerOptions: Option[] = [
    { value: "google", label: "Google" },
    { value: "elevenlabs", label: "ElevenLabs" },
    { value: "other", label: "Otro" },
  ];

  const handleVoiceSelect = (option: Option) => {
    setSelectedVoice(option);
  };

  const handleGenderSelect = (option: Option) => {
    setSelectedGender(option);
  };

  // Nueva función para manejar la selección del proveedor
  const handleProviderSelect = (option: Option) => {
    setSelectedProvider(option);
  };

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
          <label className="mb-1 text-sm font-medium text-gray-700">Voz</label>
          <Dropdown
            options={voiceOptions}
            onSelect={handleVoiceSelect}
            placeholder="Elige una voz"
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
          />
        </div>

        {/* Nuevo Dropdown para el Proveedor */}
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700">
            Proveedor
          </label>
          <Dropdown
            options={providerOptions}
            onSelect={handleProviderSelect}
            placeholder="Elige un proveedor"
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
    { value: "other", label: "Otro" },
  ];
  const providerOptions: Option[] = [
    { value: "google", label: "Google" },
    { value: "elevenlabs", label: "ElevenLabs" },
    { value: "other", label: "Otro" },
  ];

  const findOption = (options: Option[], value: string) => {
    return (
      options.find(
        (opt) =>
          opt.label.toLowerCase() === value.toLowerCase() ||
          opt.value.toLowerCase() === value.toLowerCase()
      ) || null
    );
  };

  const [voiceName, setVoiceName] = useState<string>(voice.name);
  const [selectedGender, setSelectedGender] = useState<Option | null>(
    findOption(genderOptions, voice.gender)
  );
  const [selectedProvider, setSelectedProvider] = useState<Option | null>(
    findOption(providerOptions, voice.provider)
  );

  const handleGenderSelect = (option: Option) => setSelectedGender(option);
  const handleProviderSelect = (option: Option) => setSelectedProvider(option);

  const handleUpdate = () => {
    console.log("Actualizando:", {
      id: voice.id,
      name: voiceName,
      gender: selectedGender,
      provider: selectedProvider,
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

export default function VoiceManager() {
  const { showModal } = useModal();

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Control de Voces
      </h2>

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded-md mb-6 shadow hover:bg-blue-700"
        onClick={() => showModal(<AddVoiceModal />)}
      >
        Agregar voz
      </button>

      <div className="space-y-4">
        {mockVoices.map((voice) => (
          <div
            key={voice.id}
            className="border p-4 rounded-lg shadow-sm bg-white flex justify-between items-center"
          >
            <div>
              <p className="font-semibold text-gray-800">{voice.name}</p>
              <p className="text-sm text-gray-500">
                {voice.provider} · {voice.language}
              </p>
            </div>
            <div className="space-x-4">
              <button
                className="text-sm font-medium text-blue-600 hover:underline"
                onClick={() => showModal(<EditVoiceModal voice={voice} />)}
              >
                Editar
              </button>
              <button className="text-sm font-medium text-red-600 hover:underline">
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
