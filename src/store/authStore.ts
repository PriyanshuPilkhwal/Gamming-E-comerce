import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type User = {
  name: string;
  email: string;
}

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
}

type AuthActions = {
  login: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
)
