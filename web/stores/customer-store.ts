import { create } from "zustand";
import type {
  Customer,
  CustomerQuery,
  CreateCustomerPayload,
  UpdateCustomerPayload,
  PaginationState,
  CustomerListResponse,
  // UserStatus, // Not directly used in this file anymore
} from "@/lib/types";
import * as customerService from "@/services/customerService"; // Import the service

// Store Interface
interface CustomerState {
  customers: Customer[];
  selectedCustomer: Customer | null;
  loading: boolean;
  error: string | null;
  total: number;
  pagination: PaginationState;
  filters: Partial<CustomerQuery>;

  // Direct setters like in parcel-store
  setCustomers: (customers: Customer[], total: number) => void; // Added for consistency if needed, though fetchCustomers handles it
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Filter and pagination actions
  setFilters: (filters: Partial<CustomerQuery>) => void;
  setPagination: (pagination: Partial<PaginationState>) => void;
  resetFilters: () => void;

  // Data manipulation actions
  fetchCustomers: (queryParams?: CustomerQuery) => Promise<void>;
  addCustomer: (customerData: CreateCustomerPayload) => Promise<Customer | null>;
  updateCustomer: (customerId: string, customerData: UpdateCustomerPayload) => Promise<Customer | null>;
  deleteCustomer: (customerId: string) => Promise<boolean>;
  resetPassword: (customerId: string) => Promise<boolean>;
  setSelectedCustomer: (customer: Customer | null) => void;
}

// Initial states, similar to parcel-store
const initialFilters: Partial<CustomerQuery> = {
  name: "",
  email: "",
  status: undefined, // Or a default UserStatus like UserStatus.ACTIVE
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
  loading: false,
  error: null,
  total: 0,
  pagination: initialPagination,
  filters: initialFilters,

  // Direct setters
  setCustomers: (customers, total) => set({ customers, total, error: null, loading: false }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error, loading: false }),

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

  // Data fetching action (to be called by useCustomers hook)
  fetchCustomers: async (queryParams?: CustomerQuery) => {
    set({ loading: true });
    const state = get();
    const query: CustomerQuery = { // Ensure query is fully formed CustomerQuery
      ...state.filters,
      page: state.pagination.pageIndex + 1,
      limit: state.pagination.pageSize,
      ...queryParams,
    };

    try {
      // Use the imported service
      const result: CustomerListResponse = await customerService.fetchCustomers(query);
      set({
        customers: result.data,
        total: result.pagination.total,
        pagination: {
            pageIndex: result.pagination.page - 1,
            pageSize: result.pagination.limit
        },
        loading: false,
        error: null,
      });
    } catch (err: any) {
      // Service's withErrorHandling already updates globalErrorStore.
      // Set local error for components that might use it directly.
      set({ error: err.message, loading: false, customers: [], total: 0 });
    }
  },

  addCustomer: async (customerData: CreateCustomerPayload) => {
    set({ loading: true });
    try {
      const newCustomer = await customerService.addCustomer(customerData);
      set({ loading: false, error: null});
      await get().fetchCustomers(); // Refetch the current view
      return newCustomer;
    } catch (err: any) {
      set({ error: err.message, loading: false });
      return null;
    }
  },

  updateCustomer: async (customerId: string, customerData: UpdateCustomerPayload) => {
    set({ loading: true });
    try {
      const updatedCustomer = await customerService.updateCustomer(customerId, customerData);
      set((state) => ({
        customers: state.customers.map((c) => (c.id === customerId ? updatedCustomer : c)),
        selectedCustomer: state.selectedCustomer?.id === customerId ? updatedCustomer : state.selectedCustomer,
        loading: false,
        error: null,
      }));
      return updatedCustomer;
    } catch (err: any) {
      set({ error: err.message, loading: false });
      return null;
    }
  },

  deleteCustomer: async (customerId: string) => {
    set({ loading: true });
    try {
      await customerService.deleteCustomer(customerId);
      set({ loading: false, error: null});
      await get().fetchCustomers();
      return true;
    } catch (err: any) {
      set({ error: err.message, loading: false });
      return false;
    }
  },

  resetPassword: async (customerId: string) => {
    set({ loading: true });
    try {
      await customerService.resetPassword(customerId);
      set({ loading: false, error: null });
      // The service returns { success: boolean, message: string },
      // component calling this might use it for toast.
      return true;
    } catch (err: any) {
      set({ error: err.message, loading: false });
      return false;
    }
  },
}));
