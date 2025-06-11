import { create } from "zustand";
import type {
  Customer,
  CustomerQuery,
  CreateCustomerPayload,
  UpdateCustomerPayload,
  PaginationState,
  // ApiResponse, // Not directly used in store state setters if following parcel-store pattern
  CustomerListResponse,
  UserStatus,
} from "@/lib/types";

// This would ideally be in a customerService.ts
const fetchCustomersFromApi = async (query: CustomerQuery): Promise<CustomerListResponse> => {
  const q = new URLSearchParams();
  if (query.page) q.append("page", query.page.toString());
  if (query.limit) q.append("limit", query.limit.toString());
  if (query.sortBy) q.append("sortBy", query.sortBy);
  if (query.sortOrder) q.append("sortOrder", query.sortOrder);
  if (query.name) q.append("name", query.name);
  if (query.email) q.append("email", query.email);
  if (query.status) q.append("status", query.status);

  const response = await fetch(`/api/users?${q.toString()}`);
  if (!response.ok) {
    const errData = await response.json().catch(() => ({ message: "Unknown error" })); // Ensure errData has a message
    throw new Error(errData.message || `Failed to fetch customers: ${response.statusText}`);
  }
  return response.json();
};

// These would also be in customerService.ts
const addCustomerApi = async (customerData: CreateCustomerPayload): Promise<Customer> => {
  const response = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(customerData),
  });
  if (!response.ok) {
    const errData = await response.json().catch(() => ({ message: "Unknown error" }));
    throw new Error(errData.message || "Failed to add customer");
  }
  return response.json();
};

const updateCustomerApi = async (customerId: string, customerData: UpdateCustomerPayload): Promise<Customer> => {
  const response = await fetch(`/api/users/${customerId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(customerData),
  });
  if (!response.ok) {
    const errData = await response.json().catch(() => ({ message: "Unknown error" }));
    throw new Error(errData.message || "Failed to update customer");
  }
  return response.json();
};

const deleteCustomerApi = async (customerId: string): Promise<{success: boolean, message: string}> => {
    const response = await fetch(`/api/users/${customerId}`, {
        method: "DELETE",
    });
    if (!response.ok) {
        const errData = await response.json().catch(() => ({ message: "Unknown error" }));
        throw new Error(errData.message || "Failed to delete customer");
    }
    return response.json(); // Assuming backend returns {success: true, message: ""}
};

const resetPasswordApi = async (customerId: string): Promise<{success: boolean, message: string}> => {
    const response = await fetch(`/api/users/${customerId}/reset-password`, {
        method: "POST",
    });
    if (!response.ok) {
        const errData = await response.json().catch(() => ({ message: "Unknown error" }));
        throw new Error(errData.message || "Failed to reset password");
    }
    return response.json();
};


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
  setCustomers: (customers: Customer[], total: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Filter and pagination actions
  setFilters: (filters: Partial<CustomerQuery>) => void;
  setPagination: (pagination: Partial<PaginationState>) => void;
  resetFilters: () => void;

  // Data manipulation actions
  fetchCustomers: (queryParams?: CustomerQuery) => Promise<void>; // Kept for now, called by hook
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
  loading: false,
  error: null,
  total: 0,
  pagination: initialPagination,
  filters: initialFilters,

  // Direct setters
  setCustomers: (customers, total) => set({ customers, total, error: null }), // Clear error on successful data set
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error, loading: false }), // Ensure loading is false on error

  // Filter and pagination actions - aligned with parcel-store
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      pagination: { ...state.pagination, pageIndex: 0 }, // Reset to first page
    })),
  setPagination: (newPagination) =>
    set((state) => ({
      pagination: { ...state.pagination, ...newPagination },
    })),
  resetFilters: () => set({ filters: initialFilters, pagination: initialPagination }),

  setSelectedCustomer: (customer) => set({ selectedCustomer: customer }),

  // Data fetching action (to be called by useCustomers hook)
  fetchCustomers: async (queryParams?: CustomerQuery) => {
    set({ loading: true }); // No need to set error: null here, setError or setCustomers will handle it
    const state = get();
    const query = {
      ...state.filters,
      page: state.pagination.pageIndex + 1, // Backend is 1-indexed
      limit: state.pagination.pageSize,
      ...queryParams,
    };

    try {
      const result = await fetchCustomersFromApi(query);
      set({
        customers: result.data,
        total: result.pagination.total,
        // Update pagination from response, ensuring pageIndex is 0-indexed for UI
        // This was a source of potential infinite loop if not handled carefully by the caller (useCustomers hook)
        pagination: {
            pageIndex: result.pagination.page - 1,
            pageSize: result.pagination.limit
        },
        loading: false,
        error: null, // Clear error on successful fetch
      });
    } catch (err: any) {
      set({ error: err.message, loading: false, customers: [], total: 0 }); // Clear data on error
    }
  },

  addCustomer: async (customerData: CreateCustomerPayload) => {
    set({ loading: true });
    try {
      const newCustomer = await addCustomerApi(customerData);
      // Instead of local update, refetch to ensure data consistency (simpler for now)
      // set((state) => ({ customers: [...state.customers, newCustomer], total: state.total + 1 }));
      set({ loading: false, error: null}); // Clear error on success
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
      const updatedCustomer = await updateCustomerApi(customerId, customerData);
      // Optimistic update:
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
      await deleteCustomerApi(customerId);
      // Refetch to update list after soft delete
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
      await resetPasswordApi(customerId);
      set({ loading: false, error: null });
      return true;
    } catch (err: any) {
      set({ error: err.message, loading: false });
      return false;
    }
  },
}));
