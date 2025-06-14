import { create } from "zustand"
import type { Parcel, ParcelFilters, PaginationState } from "@/lib/types"

interface ParcelState {
  parcels: Parcel[]
  total: number
  loading: boolean
  error: string | null; // Added error state
  filters: ParcelFilters
  pagination: PaginationState
  selectedParcel: Parcel | null
  galleryImages: string[]

  setParcels: (parcels: Parcel[], total: number) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void; // Added setError action
  setFilters: (filters: Partial<ParcelFilters>) => void
  setPagination: (pagination: Partial<PaginationState>) => void
  setSelectedParcel: (parcel: Parcel | null) => void
  setGalleryImages: (images: string[]) => void
  closeGallery: () => void
  resetFilters: () => void
  updateParcel: (parcel: Parcel) => void
}

const initialFilters: ParcelFilters = {
  dateFrom: "",
  dateTo: "",
  trackingNo: "",
  status: "",
  paymentStatus: "",
  search: "",
}

const initialPagination: PaginationState = {
  pageIndex: 0,
  pageSize: 10,
}

export const useParcelStore = create<ParcelState>((set) => ({
  parcels: [],
  total: 0,
  loading: false,
  filters: initialFilters,
  pagination: initialPagination,
  selectedParcel: null,
  galleryImages: [],
  error: null, // Initialized error state

  setParcels: (parcels, total) => set({ parcels, total }),
  setLoading: (loading) => set({ loading }),
  setError: (error: string | null) => set({ error }), // Implemented setError action
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      pagination: { ...state.pagination, pageIndex: 0 },
    })),
  setPagination: (newPagination) =>
    set((state) => ({
      pagination: { ...state.pagination, ...newPagination },
    })),
  setSelectedParcel: (selectedParcel) => set({ selectedParcel }),
  setGalleryImages: (images) => set({ galleryImages: images }),
  closeGallery: () => set({ galleryImages: [] }),
  resetFilters: () => set({ filters: initialFilters, pagination: initialPagination }),
  updateParcel: (parcel) =>
    set((state) => {
      const index = state.parcels.findIndex((p) => p.id === parcel.id)
      if (index !== -1) {
        const newParcels = [...state.parcels]
        newParcels[index] = parcel
        return { parcels: newParcels }
      }
      return {}
    }),
}))
