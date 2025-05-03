import { create } from 'zustand';

export type AlertDTO = {
  title: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number; // Duration in milliseconds
};

export const useAlertStore = create((set) => ({
  alert: {},
  setAlert: (alert: AlertDTO) => set({ alert }),
}));