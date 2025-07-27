import { createContext, ReactNode } from "react";

// Interfaz que define la estructura del valor del contexto
export interface IModalContext {
  isOpen: boolean;
  modalContent: ReactNode | null;
  showModal: (content: ReactNode) => void;
  hideModal: () => void;
}

// Creamos el contexto con un valor inicial nulo y la firma de la interfaz
export const ModalContext = createContext<IModalContext | null>(null);
