import { create } from "zustand";
import type {
  Customer,
  CustomerQuery,
  // CreateCustomerPayload, // No longer used directly in store actions
  // UpdateCustomerPayload, // No longer used directly in store actions
  PaginationState,
  // CustomerListResponse, // Data will be passed directly to setCustomers
} from "@/lib/types";
// No longer importing customerService here as async ops are removed

// Store Interface - mirroring ParcelState
interface CustomerState {
  customers: Customer[];
  total: number;
  loading: boolean;
  error: string | null;
  filters: Partial<CustomerQuery>;
  pagination: PaginationState;
  selectedCustomer: Customer | null;

  // Actions mirroring ParcelState
  setCustomers: (customers: Customer[], total: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: Partial<CustomerQuery>) => void;
  setPagination: (pagination: Partial<PaginationState>) => void;
  setSelectedCustomer: (customer: Customer | null) => void;
  resetFilters: () => void;
  updateCustomer: (customer: Customer) => void; // For optimistic/local updates
}

// Initial states, mirroring parcel-store
const initialFilters: Partial<CustomerQuery> = {
  name: "",
  email: "",
  status: undefined,
  sortBy: "createdAt", // Default sort for customers
  sortOrder: "DESC",
};

const initialPagination: PaginationState = {
  pageIndex: 0,
  pageSize: 10,
};

export const useCustomerStore = create<CustomerState>((set) => ({
  customers: [],
  total: 0,
  loading: false,
  error: null,
  filters: initialFilters,
  pagination: initialPagination,
  selectedCustomer: null,

  // Actions mirroring parcel-store
  setCustomers: (customers, total) => set({ customers, total }), // Only sets customers and total
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }), // Only sets error

  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      pagination: { ...state.pagination, pageIndex: 0 },
    })),
  setPagination: (newPagination) =>
    set((state) => ({
      pagination: { ...state.pagination, ...newPagination },
    })),
  setSelectedCustomer: (selectedCustomer) => set({ selectedCustomer }),
  resetFilters: () => set({ filters: initialFilters, pagination: initialPagination }),

  updateCustomer: (customer) =>
    set((state) => {
      const index = state.customers.findIndex((c) => c.id === customer.id);
      if (index !== -1) {
        const newCustomers = [...state.customers];
        newCustomers[index] = customer;
        return { customers: newCustomers };
      }
      return {}; // Return empty object if customer not found, no state change
    }),

  // Async CRUD actions (addCustomer, async updateCustomer, deleteCustomer, resetPassword) are removed.
  // The hook (use-customers.ts) will handle these by calling services and then using the setters above.
}));
