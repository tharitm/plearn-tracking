import { create } from "zustand"
import type { Parcel, ParcelFilters, PaginationState, User, ParcelListResponse } from "@/lib/types"
import { fetchParcels } from "@/services/parcelService"
import { useAuthStore } from "@/stores/auth-store"

interface ParcelState {
  parcels: Parcel[]
  total: number
  loading: boolean
  error: string | null
  filters: ParcelFilters
  pagination: PaginationState
  selectedParcel: Parcel | null
  galleryImages: string[]

  setParcels: (parcels: Parcel[], total: number) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setFilters: (filters: Partial<ParcelFilters>) => void
  setPagination: (pagination: Partial<PaginationState>) => void
  setSelectedParcel: (parcel: Parcel | null) => void
  setGalleryImages: (images: string[]) => void
  closeGallery: () => void
  resetFilters: () => void
  updateParcel: (parcel: Parcel) => void
  loadParcels: (user: User | null) => Promise<void> // Added loadParcels action
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
  error: null,

  setParcels: (parcels, total) => set({ parcels, total }),
  setLoading: (loading) => set({ loading }),
  setError: (error: string | null) => set({ error }),
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

  loadParcels: async (user) => {
    if (!user) {
      set({ parcels: [], total: 0, loading: false }); // Clear parcels if no user
      return;
    }

    set({ loading: true, error: null });
    // Access other state properties using useParcelStore.getState()
    const { filters, pagination } = useParcelStore.getState();

    try {
      const serviceFilters: ParcelFilters & { page?: number; pageSize?: number; customerCode?: string } = {
        ...filters,
        page: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
      };
      if (user.role === "customer") {
        serviceFilters.customerCode = user.customerCode;
      }
      const result: ParcelListResponse = await fetchParcels(serviceFilters);
      set({ parcels: result.parcels, total: result.total, loading: false });
    } catch (e: any) {
      // Assuming error handled by withErrorHandling in service,
      // but store can also set its own error message if needed.
      // For now, rely on global error handling or service-level logging.
      // If specific error display in component is needed, set it here.
      set({ error: e?.message || "Failed to load parcels", loading: false, parcels: [], total: 0 });
    }
  },
}));
