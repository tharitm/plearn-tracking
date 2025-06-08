import { create } from "zustand"
import type { Parcel, ParcelFilters, PaginationState } from "@/lib/types"

interface ParcelState {
  parcels: Parcel[]
  total: number
  loading: boolean
  filters: ParcelFilters
  pagination: PaginationState
  selectedParcel: Parcel | null

  setParcels: (parcels: Parcel[], total: number) => void
  setLoading: (loading: boolean) => void
  setFilters: (filters: Partial<ParcelFilters>) => void
  setPagination: (pagination: Partial<PaginationState>) => void
  setSelectedParcel: (parcel: Parcel | null) => void
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

  setParcels: (parcels, total) => set({ parcels, total }),
  setLoading: (loading) => set({ loading }),
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
