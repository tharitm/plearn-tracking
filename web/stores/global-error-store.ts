import { create } from 'zustand';

interface GlobalErrorState {
  error: string | null;
  isOpen: boolean;
  setError: (message: string) => void;
  clearError: () => void;
  openError: () => void;
  closeError: () => void;
}

export const useGlobalErrorStore = create<GlobalErrorState>((set) => ({
  error: null,
  isOpen: false,
  setError: (message: string) => set({ error: message, isOpen: true }),
  clearError: () => set({ error: null, isOpen: false }),
  openError: () => set({ isOpen: true }),
  closeError: () => set({ isOpen: false }),
}));
