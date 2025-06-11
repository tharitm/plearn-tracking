import { create } from "zustand";
import type {
  Customer,
  CustomerQuery,
  CreateCustomerPayload,
  UpdateCustomerPayload,
  PaginationState,
  CustomerListResponse,
} from "@/lib/types";
import * as customerService from "@/services/customerService";

// Store Interface
interface CustomerState {
  customers: Customer[];
  selectedCustomer: Customer | null;
  loading: boolean; // General loading for CRUD, list loading will be handled by hook or this setter
  error: string | null; // Error for CRUD operations, list error handled by setFetchError
  total: number;
  pagination: PaginationState;
  filters: Partial<CustomerQuery>;

  // Setters for data fetched by the hook
  setFetchedData: (data: CustomerListResponse) => void;
  setFetchError: (error: string | null) => void;

  // General loading setter (can be used by hook and CRUD actions)
  setLoading: (loading: boolean) => void;

  // Filter and pagination actions
  setFilters: (filters: Partial<CustomerQuery>) => void;
  setPagination: (pagination: Partial<PaginationState>) => void;
  resetFilters: () => void;

  // CRUD actions - these will still call the service and manage their specific loading/error
  addCustomer: (customerData: CreateCustomerPayload) => Promise<Customer | null>;
  updateCustomer: (customerId: string, customerData: UpdateCustomerPayload) => Promise<Customer | null>;
  deleteCustomer: (customerId: string) => Promise<boolean>;
  resetPassword: (customerId: string) => Promise<boolean>;
  setSelectedCustomer: (customer: Customer | null) => void;
}

const initialFilters: Partial<CustomerQuery> = {
  name: "",
  email: "",
  status: undefined,
  sortBy: "createdAt",
  sortOrder: "DESC",
};

const initialPagination: PaginationState = {
  pageIndex: 0,
  pageSize: 10,
};

export const useCustomerStore = create<CustomerState>((set, get) => ({
  customers: [],
  selectedCustomer: null,
  loading: false, // Initial loading state for the store
  error: null,
  total: 0,
  pagination: initialPagination,
  filters: initialFilters,

  // Setters for data fetched by the hook
  setFetchedData: (result) => set({
    customers: result.data,
    total: result.pagination.total,
    pagination: {
        pageIndex: result.pagination.page - 1, // Convert to 0-indexed
        pageSize: result.pagination.limit
    },
    error: null, // Clear previous fetch errors
    // loading: false, // loading state for fetch is managed by the hook calling setLoading
  }),
  setFetchError: (error) => set({
    error,
    customers: [], // Clear data on fetch error
    total: 0,
    // loading: false, // loading state for fetch is managed by the hook calling setLoading
  }),

  setLoading: (loading) => set({ loading }),

  // Filter and pagination actions
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      pagination: { ...state.pagination, pageIndex: 0 },
    })),
  setPagination: (newPagination) =>
    set((state) => ({
      pagination: { ...state.pagination, ...newPagination },
    })),
  resetFilters: () => set({ filters: initialFilters, pagination: initialPagination }),

  setSelectedCustomer: (customer) => set({ selectedCustomer: customer }),

  // CRUD actions: Call service, set own loading/error for the specific action.
  // List refresh is handled by the hook after these actions complete.
  addCustomer: async (customerData: CreateCustomerPayload) => {
    set({ loading: true, error: null });
    try {
      const newCustomer = await customerService.addCustomer(customerData);
      set({ loading: false });
      return newCustomer; // Return the new customer; hook will decide to refetch list.
    } catch (err: any) {
      set({ error: err.message, loading: false });
      return null;
    }
  },

  updateCustomer: async (customerId: string, customerData: UpdateCustomerPayload) => {
    set({ loading: true, error: null });
    try {
      const updatedCustomer = await customerService.updateCustomer(customerId, customerData);
      // Optimistic update in the store
      set((state) => ({
        customers: state.customers.map((c) => (c.id === customerId ? updatedCustomer : c)),
        selectedCustomer: state.selectedCustomer?.id === customerId ? updatedCustomer : state.selectedCustomer,
        loading: false,
      }));
      return updatedCustomer;
    } catch (err: any) {
      set({ error: err.message, loading: false });
      return null;
    }
  },

  deleteCustomer: async (customerId: string) => {
    set({ loading: true, error: null });
    try {
      await customerService.deleteCustomer(customerId);
      set({ loading: false });
      return true; // Return success; hook will decide to refetch list.
    } catch (err: any) {
      set({ error: err.message, loading: false });
      return false;
    }
  },

  resetPassword: async (customerId: string) => {
    set({ loading: true, error: null });
    try {
      await customerService.resetPassword(customerId);
      set({ loading: false });
      return true;
    } catch (err: any) {
      set({ error: err.message, loading: false });
      return false;
    }
  },
}));
