import { create } from "zustand";
import { persist } from "zustand/middleware";
import { login as loginService, logout as logoutService, User } from "@/services/authService";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitializing: boolean;
  error: string | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  _setIsInitializing: (isInitializing: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isInitializing: true,
      error: null,
      token: null,
      _setIsInitializing: (isInitializing) => set({ isInitializing }),

      checkAuth: async () => {
        const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
        if (!token) {
          set({
            user: null,
            isAuthenticated: false,
            token: null,
            isInitializing: false
          });
          return;
        }

        try {
          // ทำการ validate token กับ backend ถ้าจำเป็น
          // const response = await fetch('/api/validate-token');
          // if (!response.ok) throw new Error('Invalid token');

          set({
            isAuthenticated: true,
            token,
            isInitializing: false
          });
        } catch (error) {
          set({
            user: null,
            isAuthenticated: false,
            token: null,
            isInitializing: false
          });
          document.cookie = 'token=; path=/; max-age=0';
        }
      },

      login: async (username, password) => {
        set({ isLoading: true, error: null });
        try {
          const userData = await loginService(username, password);
          const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];

          if (!token) {
            throw new Error('No token received after login');
          }

          set({
            user: userData,
            isAuthenticated: true,
            isLoading: false,
            token
          });
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : "Login failed";
          set({
            error: errorMessage,
            isAuthenticated: false,
            isLoading: false,
            user: null,
            token: null
          });
          throw err;
        }
      },

      logout: async () => {
        document.cookie = 'token=; path=/; max-age=0';
        set({ isLoading: true, error: null });
        try {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
            token: null
          });
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : "Logout failed";
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: errorMessage,
            token: null
          });
        }
      },
    }),
    {
      name: "auth-storage",
      onRehydrateStorage: () => {
        return async (state, error) => {
          if (error) {
            console.error("Failed to rehydrate auth state:", error);
            useAuthStore.setState({ isInitializing: false });
            return;
          }

          // เรียก checkAuth หลังจาก rehydrate เพื่อตรวจสอบ token
          if (state) {
            await state.checkAuth();
          }
        };
      },
    }
  )
);

// Initial call to set isInitializing to false if not using persist or if persist fails early
if (typeof window !== 'undefined') {
  setTimeout(() => {
    const state = useAuthStore.getState();
    if (state.isInitializing) {
      state.checkAuth();
    }
  }, 0);
}
