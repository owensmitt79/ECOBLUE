'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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

  // Safety cleanup: always restore scroll when this provider unmounts
  useEffect(() => {
    return () => {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = '';
      }
    };
  }, []);

  // Sync body overflow whenever modal state changes
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = isQuoteModalOpen ? 'hidden' : '';
    }
  }, [isQuoteModalOpen]);

  const openQuoteModal = (serviceName: string = '') => {
    setPrefilledService(serviceName);
    setIsQuoteModalOpen(true);
  };

  const closeQuoteModal = () => {
    setIsQuoteModalOpen(false);
    setPrefilledService('');
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
