"use client";

import React from "react";
import { useModal } from "@/core/hooks/useModal";

export function GlobalModal() {
  const { isOpen, modalContent, hideModal } = useModal();

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center p-4"
      onClick={hideModal}
    >
      {/* Contenido del modal */}
      <div
        className="bg-white p-6 rounded-lg shadow-xl max-w-7xl max-h-[90vh] w-full overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Contenido dinámico que se inyecta */}
        <div className="mt-2">{modalContent}</div>
      </div>
    </div>
  );
}
