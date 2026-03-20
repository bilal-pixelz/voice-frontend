import { create } from 'zustand';

interface NotificationState {
  message: string | null;
  setMessage: (message: string | null) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  message: null,
  setMessage: (message) => set({ message }),
}));
