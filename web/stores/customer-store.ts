import { create } from "zustand";
import type {
  Customer,
  CustomerQuery,
  CreateCustomerPayload,
  UpdateCustomerPayload,
  PaginationState,
  ApiResponse,
  CustomerListResponse,
  UserStatus,
} from "@/lib/types";

// Helper function to construct query string
const buildQueryParams = (params: CustomerQuery): string => {
  const q = new URLSearchParams();
  if (params.page) q.append("page", params.page.toString());
  if (params.limit) q.append("limit", params.limit.toString());
  if (params.sortBy) q.append("sortBy", params.sortBy);
  if (params.sortOrder) q.append("sortOrder", params.sortOrder);
  if (params.name) q.append("name", params.name);
  if (params.email) q.append("email", params.email);
  if (params.status) q.append("status", params.status);
  return q.toString();
};

interface CustomerState {
  customers: Customer[];
  selectedCustomer: Customer | null;
  loading: boolean;
  error: string | null;
  total: number; // Total number of customers for pagination
  pagination: PaginationState;
  filters: Partial<CustomerQuery>; // For storing active filters

  fetchCustomers: (queryParams?: CustomerQuery) => Promise<void>;
  addCustomer: (customerData: CreateCustomerPayload) => Promise<Customer | null>;
  updateCustomer: (customerId: string, customerData: UpdateCustomerPayload) => Promise<Customer | null>;
  deleteCustomer: (customerId: string) => Promise<boolean>; // Returns true on success
  resetPassword: (customerId: string) => Promise<boolean>; // Returns true on success
  setSelectedCustomer: (customer: Customer | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setPagination: (pagination: Partial<PaginationState>) => void;
  setFilters: (filters: Partial<CustomerQuery>) => void;
  resetFilters: () => void;
}

const initialFilters: Partial<CustomerQuery> = {
  name: "",
  email: "",
  status: undefined, // Or UserStatus.ACTIVE if there's a default filter
  sortBy: "createdAt",
  sortOrder: "DESC",
};

const initialPagination: PaginationState = {
  pageIndex: 0, // Corresponds to 'page' 1 on backend
  pageSize: 10, // Corresponds to 'limit' on backend
};

export const useCustomerStore = create<CustomerState>((set, get) => ({
  customers: [],
  selectedCustomer: null,
  loading: false,
  error: null,
  total: 0,
  pagination: initialPagination,
  filters: initialFilters,

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error, loading: false }), // Also set loading to false on error
  setSelectedCustomer: (customer) => set({ selectedCustomer: customer }),

  setPagination: (newPagination) =>
    set((state) => {
      const updatedPagination = { ...state.pagination, ...newPagination };
      // Trigger fetchCustomers when pagination changes
      // state.fetchCustomers({ ...state.filters, page: updatedPagination.pageIndex + 1, limit: updatedPagination.pageSize });
      // The above line would cause an infinite loop because fetchCustomers calls setPagination.
      // Instead, components should call fetchCustomers after updating pagination.
      return { pagination: updatedPagination };
    }),

  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      // Reset to first page when filters change
      pagination: { ...state.pagination, pageIndex: 0 },
    })),

  resetFilters: () => set({ filters: initialFilters, pagination: initialPagination }),

  fetchCustomers: async (queryParams?: CustomerQuery) => {
    set({ loading: true, error: null });
    const state = get();
    const query = {
      ...state.filters,
      page: state.pagination.pageIndex + 1, // Backend is 1-indexed
      limit: state.pagination.pageSize,
      ...queryParams, // Allow overriding with specific queryParams
    };

    try {
      const queryString = buildQueryParams(query);
      const response = await fetch(`/api/users?${queryString}`);
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || `Failed to fetch customers: ${response.statusText}`);
      }
      const result: CustomerListResponse = await response.json(); // Backend returns { data: Customer[], pagination: {...} }

      set({
        customers: result.data,
        total: result.pagination.total,
        // Update pagination from response if needed, ensuring pageIndex is 0-indexed for UI
        pagination: { ...state.pagination, pageIndex: result.pagination.page - 1, pageSize: result.pagination.limit },
        loading: false,
      });
    } catch (err: any) {
      set({ error: err.message, loading: false, customers: [], total: 0 });
    }
  },

  addCustomer: async (customerData: CreateCustomerPayload) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customerData),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to add customer");
      }
      const newCustomer: Customer = await response.json(); // Assuming API returns the created customer
      set((state) => ({
        // customers: [...state.customers, newCustomer], // Or refetch
        loading: false,
      }));
      get().fetchCustomers(); // Refresh list
      return newCustomer;
    } catch (err: any) {
      set({ error: err.message, loading: false });
      return null;
    }
  },

  updateCustomer: async (customerId: string, customerData: UpdateCustomerPayload) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/users/${customerId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customerData),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to update customer");
      }
      const updatedCustomer: Customer = await response.json(); // Assuming API returns the updated customer
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
      const response = await fetch(`/api/users/${customerId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
         const errData = await response.json();
        throw new Error(errData.message || "Failed to delete customer");
      }
      // Soft delete, so we update the status or refetch
      set((state) => ({
        // customers: state.customers.filter((c) => c.id !== customerId), // Or update status
        loading: false,
      }));
      get().fetchCustomers(); // Refresh list to show updated status
      return true;
    } catch (err: any) {
      set({ error: err.message, loading: false });
      return false;
    }
  },

  resetPassword: async (customerId: string) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/users/${customerId}/reset-password`, {
        method: "POST",
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to reset password");
      }
      // const result = await response.json(); // Contains { success: true, message: '...' }
      set({ loading: false });
      // Potentially show success message from result.message
      return true;
    } catch (err: any) {
      set({ error: err.message, loading: false });
      return false;
    }
  },
}));
