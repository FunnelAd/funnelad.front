"use client";

import React, { useState } from "react";

export function PromptForm({ initialData = null, onSave }) {
  const [type, setType] = useState(initialData?.type || "greeting");
  const [content, setContent] = useState(initialData?.content || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...initialData,
      id: initialData?.id || crypto.randomUUID(),
      type,
      content,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-semibold">
        {initialData ? "Editar Prompt" : "Nuevo Prompt"}
      </h2>

      <div>
        <label className="block text-sm font-medium text-gray-700">Tipo</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        >
          <option value="greeting">Saludo</option>
          <option value="fallback">Fallback</option>
          <option value="error">Error</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Contenido
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Guardar
        </button>
      </div>
    </form>
  );
}
