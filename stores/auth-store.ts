import { create } from "zustand";
import { persist } from "zustand/middleware";
import { login as loginService, logout as logoutService, User } from "@/services/authService";
import { useParcelStore } from "./parcel-store";

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

// Helper function to get token from cookies
const getTokenFromCookie = () => {
  // Debug logging
  console.log('All cookies:', document.cookie);

  if (!document.cookie) {
    console.log('No cookies found');
    return null;
  }

  const cookies = document.cookie.split(';').map(c => c.trim());
  console.log('Split cookies:', cookies);

  const tokenCookie = cookies.find(cookie => cookie.startsWith('token='));
  console.log('Found token cookie:', tokenCookie);

  if (!tokenCookie) {
    console.log('No token cookie found');
    return null;
  }

  const token = tokenCookie.split('=')[1];
  console.log('Extracted token:', token);
  return token;
};

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
        const token = getTokenFromCookie();
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
          document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        }
      },

      login: async (username, password) => {
        set({ isLoading: true, error: null });
        try {
          const userData = await loginService(username, password);

          // Use the helper function to get token
          const token = getTokenFromCookie();
          console.log('Token after login:', token);

          if (!token) {
            console.error('Login successful but no token found in cookies');
            throw new Error('No token received after login');
          }

          set({
            user: userData,
            isAuthenticated: true,
            isLoading: false,
            token
          });

          useParcelStore.getState().resetFilters();
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
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        set({ isLoading: true, error: null });
        try {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
            token: null
          });

          useParcelStore.getState().resetFilters();
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
