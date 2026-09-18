'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ModalContextValue {
  isQuoteModalOpen: boolean;
  prefilledService: string;
  openQuoteModal: (serviceName?: string) => void;
  closeQuoteModal: () => void;
}

const ModalContext = createContext<ModalContextValue>({
  isQuoteModalOpen: false,
  prefilledService: '',
  openQuoteModal: () => {},
  closeQuoteModal: () => {}
});

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState<boolean>(false);
  const [prefilledService, setPrefilledService] = useState<string>('');

  const openQuoteModal = (serviceName: string = '') => {
    setPrefilledService(serviceName);
    setIsQuoteModalOpen(true);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
  };

  const closeQuoteModal = () => {
    setIsQuoteModalOpen(false);
    setPrefilledService('');
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  };

  return (
    <ModalContext.Provider
      value={{
        isQuoteModalOpen,
        prefilledService,
        openQuoteModal,
        closeQuoteModal
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  return useContext(ModalContext);
}
