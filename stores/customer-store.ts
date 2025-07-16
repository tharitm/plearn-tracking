import { create } from "zustand";
import { Customer, CustomerQuery, PaginationState } from "@/lib/types";
import { fetchCustomers, deleteCustomer } from "@/services/customerService";

interface CustomerState {
  customers: Customer[];
  total: number;
  isLoading: boolean;
  error: string | null;
  filters: CustomerQuery;
  pagination: PaginationState;
  selectedCustomer: Customer | null;
  setSelectedCustomer: (customer: Customer | null) => void;
  fetchCustomers: () => Promise<void>;
  deleteCustomer: (customerId: number) => Promise<void>;
  setFilters: (filters: Partial<CustomerQuery>) => void;
  setPagination: (pagination: Partial<PaginationState>) => void;
  resetFilters: () => void;
}

const defaultPagination: PaginationState = {
  pageIndex: 0,
  pageSize: 10,
};

const defaultFilters: CustomerQuery = {
  search: undefined,
};

export const useCustomerStore = create<CustomerState>((set, get) => ({
  customers: [],
  total: 0,
  isLoading: false,
  error: null,
  filters: defaultFilters,
  pagination: defaultPagination,
  selectedCustomer: null,

  setSelectedCustomer: (customer) => set({ selectedCustomer: customer }),

  fetchCustomers: async () => {
    const { filters, pagination } = get();
    set({ isLoading: true, error: null });

    try {
      const response = await fetchCustomers({
        ...filters,
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
      });

      set({
        customers: response.users,
        total: response.total,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to fetch customers",
        isLoading: false,
      });
    }
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      pagination: { ...state.pagination, pageIndex: 0 }, // Reset to first page on filter change
    }));
    get().fetchCustomers();
  },

  setPagination: (newPagination) => {
    set((state) => ({
      pagination: { ...state.pagination, ...newPagination },
    }));
    get().fetchCustomers();
  },

  resetFilters: () => {
    set({
      filters: defaultFilters,
      pagination: defaultPagination,
    });
    get().fetchCustomers();
  },

  deleteCustomer: async (customerId: number) => {
    set({ isLoading: true, error: null });

    try {
      await deleteCustomer(customerId);
      // Refresh the customer list after deletion
      await get().fetchCustomers();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to delete customer",
        isLoading: false,
      });
      throw error; // Re-throw to handle in UI
    }
  },
}));

