import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { User } from "@/lib/types"

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (user: User) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user) => {
        if (user.role === "customer" && !user.customerCode) {
          user.customerCode = "C001"
        }
        set({ user, isAuthenticated: true })
      },
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: "auth-storage",
    },
  ),
)
