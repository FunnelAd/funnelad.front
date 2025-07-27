// app/(dashboard)/voices/page.tsx
"use client";

import { useModal } from "@/core/hooks/useModal";

type Voice = {
  id: string;
  name: string;
  provider: "Google" | "ElevenLabs" | "Otro";
  language: string;
};

const mockVoices: Voice[] = [
  { id: "1", name: "Joanna Banana", provider: "Google", language: "en-US" },
  { id: "2", name: "Arnold", provider: "ElevenLabs", language: "en-UK" },
];

function AddVoiceModal() {
  const { hideModal } = useModal();

  const handleSave = () => {
    alert("Guardado");
    hideModal();
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-2">Agregar nueva voz</h2>
      <input
        type="text"
        placeholder="Nombre"
        className="border p-2 w-full mb-2"
      />
      <button
        onClick={handleSave}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Guardar
      </button>
    </div>
  );
}

function EditVoiceModal({ voice }: { voice: Voice }) {
  const { hideModal } = useModal();

  const handleUpdate = () => {
    alert(`Actualizado: ${voice.name}`);
    hideModal();
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-2">Editar voz: {voice.name}</h2>
      <input
        type="text"
        defaultValue={voice.name}
        className="border p-2 w-full mb-2"
      />
      <button
        onClick={handleUpdate}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Actualizar
      </button>
    </div>
  );
}

export default function VoiceManager() {
  const { showModal } = useModal();

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Control de Voces</h2>

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
        onClick={() => showModal(<AddVoiceModal />)}
      >
        Agregar voz
      </button>

      <div className="space-y-4">
        {mockVoices.map((voice) => (
          <div
            key={voice.id}
            className="border p-4 rounded shadow flex justify-between items-center"
          >
            <div>
              <p className="font-medium">{voice.name}</p>
              <p className="text-sm text-gray-500">
                {voice.provider} · {voice.language}
              </p>
            </div>
            <div className="space-x-2">
              <button
                className="text-sm text-blue-600 hover:underline"
                onClick={() => showModal(<EditVoiceModal voice={voice} />)}
              >
                Editar
              </button>
              <button className="text-sm text-red-600 hover:underline">
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
