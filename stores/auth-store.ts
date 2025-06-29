import { create } from "zustand";
import { persist } from "zustand/middleware";
import { login as loginService, logout as logoutService, User } from "@/services/authService"; // Import User and logoutService

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean; // To track login/logout loading state
  error: string | null; // To store login/logout error messages
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>; // Logout can also be async
  checkAuth: () => void; // Action to check auth status, potentially from cookies
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      login: async (username, password) => {
        set({ isLoading: true, error: null });
        try {
          const userData = await loginService(username, password);
          set({ user: userData, isAuthenticated: true, isLoading: false });
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : "Login failed";
          set({ error: errorMessage, isAuthenticated: false, isLoading: false, user: null });
          throw err;
        }
      },
      logout: async () => {
        set({ isLoading: true, error: null });
        try {
          await logoutService(); // Call the logout service
          set({ user: null, isAuthenticated: false, isLoading: false, error: null });
          // Client-side redirect will be handled in the component or layout after logout action
        } catch (err) {
          // Even if server logout fails, we should clear client state
          const errorMessage = err instanceof Error ? err.message : "Logout failed";
          set({ user: null, isAuthenticated: false, isLoading: false, error: errorMessage });
          // Optionally re-throw if the caller needs to know about the error
          // throw err;
        }
      },
      checkAuth: () => {
        const { user } = get();
        if (user) {
          // Potentially add a call here to verify token with backend if it's been a while
          set({ isAuthenticated: true });
        } else {
          set({ isAuthenticated: false });
        }
      },
    }),
    {
      name: "auth-storage",
    }
  )
);

if (typeof window !== 'undefined') {
  useAuthStore.getState().checkAuth();
}
