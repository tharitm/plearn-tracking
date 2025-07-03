import { create } from "zustand"
import { persist } from "zustand/middleware"

interface UserProfile {
  id: string
  firstName: string
  email: string | null
  avatar?: string
  phone?: string
  address?: string
}

interface UserState {
  profile: UserProfile | null
  setProfile: (profile: UserProfile) => void
  updateProfile: (updates: Partial<UserProfile>) => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      profile: null,
      setProfile: (profile) => set({ profile }),
      updateProfile: (updates) =>
        set((state) => ({
          profile: state.profile ? { ...state.profile, ...updates } : null,
        })),
    }),
    {
      name: "user-profile-storage",
    },
  ),
)
