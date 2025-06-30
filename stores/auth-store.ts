import { create } from "zustand";
import { persist } from "zustand/middleware";
import { login as loginService, logout as logoutService, User } from "@/services/authService"; // Import User and logoutService

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean; // To track login/logout loading state
  isInitializing: boolean; // To track initial auth check / rehydration
  error: string | null; // To store login/logout error messages
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>; // Logout can also be async
  _setIsInitializing: (isInitializing: boolean) => void; // Internal action
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isInitializing: true, // Start as true
      error: null,
      _setIsInitializing: (isInitializing) => set({ isInitializing }),
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
        document.cookie = 'token=; path=/; max-age=0';
        set({ isLoading: true, error: null });
        try {
          set({ user: null, isAuthenticated: false, isLoading: false, error: null });
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : "Logout failed";
          set({ user: null, isAuthenticated: false, isLoading: false, error: errorMessage });
        }
      },
      // checkAuth is effectively handled by persist rehydration and onRehydrateStorage
      // If a more active check is needed (e.g., validating token with backend), it can be added here
      // and called after rehydration.
    }),
    {
      name: "auth-storage", // name of the item in storage (must be unique)
      onRehydrateStorage: () => {
        return (state, error) => {
          if (state) {
            // Check if user is present after rehydration
            if (state.user) {
              state.isAuthenticated = true;
            } else {
              state.isAuthenticated = false;
            }
            state.isInitializing = false; // Rehydration/initial check is complete
          } else if (error) {
            console.error("Failed to rehydrate auth state:", error);
            // Potentially handle error, e.g. by forcing logout or showing an error message
            // For now, just mark as not initializing
            if (state) state.isInitializing = false;
            else useAuthStore.setState({ isInitializing: false }); // If state is undefined
          }
        };
      },
    }
  )
);

// Initial call to set isInitializing to false if not using persist or if persist fails early.
// However, onRehydrateStorage is generally preferred for this.
// We ensure isInitializing is set to false once, after the store is created and persist had a chance.
if (typeof window !== 'undefined') {
  // This timeout allows persist to potentially run onRehydrateStorage first.
  // If onRehydrateStorage runs, isInitializing will already be false.
  // If it doesn't run (e.g. no persisted state), this ensures it becomes false.
  setTimeout(() => {
    useAuthStore.getState()._setIsInitializing(false);
  }, 0);
}
