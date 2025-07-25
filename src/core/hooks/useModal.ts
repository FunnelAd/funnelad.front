"use client";

import { useContext } from "react";
import { ModalContext, IModalContext } from "@/core/contexts/ModalContext";

export const useModal = (): IModalContext => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal debe ser usado dentro de un ModalProvider");
  }
  return context;
};
