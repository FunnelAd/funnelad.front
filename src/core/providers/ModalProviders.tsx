"use client";

import React, { useState, useMemo, useCallback, ReactNode } from "react";
import { ModalContext, IModalContext } from "@/core/contexts/ModalContext";

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState<ReactNode | null>(null);

  const showModal = useCallback((content: ReactNode) => {
    setModalContent(content);
    setIsOpen(true);
  }, []);

  const hideModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  const value = useMemo<IModalContext>(
    () => ({
      isOpen,
      modalContent,
      showModal,
      hideModal,
    }),
    [isOpen, modalContent, showModal, hideModal]
  );

  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
}
