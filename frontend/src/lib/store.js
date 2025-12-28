import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useAppStore = create(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      role: null,
      setUser: (user, token, role) => set({ user, token, role }),
      clearUser: () => set({ user: null, token: null, role: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
