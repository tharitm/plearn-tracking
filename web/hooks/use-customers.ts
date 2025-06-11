"use client";

import { useEffect, useCallback, useState } from "react";
import { useCustomerStore } from "@/stores/customer-store";
import * as customerService from "@/services/customerService";
import type { CustomerQuery, CreateCustomerPayload, UpdateCustomerPayload, Customer } from "@/lib/types";

export function useCustomers() {
  // Select actions from the store that the hook will use to update state
  const storeSetFetchedData = useCustomerStore((state) => state.setFetchedData);
  const storeSetFetchError = useCustomerStore((state) => state.setFetchError);
  const storeSetLoading = useCustomerStore((state) => state.setLoading);

  // Select states from the store that are needed for forming queries or dependencies
  const filters = useCustomerStore((state) => state.filters);
  const pagination = useCustomerStore((state) => state.pagination);

  // Select states to be returned by the hook
  const customers = useCustomerStore((state) => state.customers);
  const selectedCustomer = useCustomerStore((state) => state.selectedCustomer);
  const total = useCustomerStore((state) => state.total);
  const loading = useCustomerStore((state) => state.loading); // This is the general store loading state
  const error = useCustomerStore((state) => state.error);     // This is the general store error state

  // Actions to be exposed directly from the store (filter/pagination setters, CRUD)
  const setFilters = useCustomerStore((state) => state.setFilters);
  const setPagination = useCustomerStore((state) => state.setPagination);
  const resetFilters = useCustomerStore((state) => state.resetFilters);

  // CRUD actions from the store. These already call the service.
  // The hook will expose these and potentially manage refetching after they complete.
  const storeAddCustomer = useCustomerStore((state) => state.addCustomer);
  const storeUpdateCustomer = useCustomerStore((state) => state.updateCustomer);
  const storeDeleteCustomer = useCustomerStore((state) => state.deleteCustomer);
  const storeResetPassword = useCustomerStore((state) => state.resetPassword);
  const setSelectedCustomer = useCustomerStore((state) => state.setSelectedCustomer);


  // loadCustomers: Fetches data based on current store filters and pagination
  const loadCustomers = useCallback(async () => {
    storeSetLoading(true);
    storeSetFetchError(null); // Clear previous fetch error

    const query: CustomerQuery = {
      ...filters,
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
    };

    try {
      const result = await customerService.fetchCustomers(query);
      storeSetFetchedData(result); // This action now updates customers, total, pagination
    } catch (err: any) {
      // customerService functions are wrapped with withErrorHandling,
      // which updates globalErrorStore. Set local store error for UI.
      storeSetFetchError(err.message || "Failed to fetch customers");
    } finally {
      storeSetLoading(false);
    }
  }, [
    filters,
    pagination,
    storeSetLoading,
    storeSetFetchedData,
    storeSetFetchError
  ]); // Dependencies include objects from store. This is like useParcels.

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]); // useEffect depends on the memoized loadCustomers.

  // Enhanced CRUD operations exposed by the hook
  const addCustomer = async (data: CreateCustomerPayload): Promise<Customer | null> => {
    const newCustomer = await storeAddCustomer(data);
    if (newCustomer) {
      loadCustomers(); // Refetch list after successful addition
    }
    return newCustomer;
  };

  const updateCustomer = async (id: string, data: UpdateCustomerPayload): Promise<Customer | null> => {
    // storeUpdateCustomer is optimistic, so list might not need immediate refetch
    // unless backend returns data that differs significantly from optimistic update.
    // For consistency or if detailed server state is needed, can refetch:
    // const updated = await storeUpdateCustomer(id, data);
    // if (updated) loadCustomers();
    // return updated;
    return storeUpdateCustomer(id, data); // Current store action is optimistic
  };

  const deleteCustomer = async (id: string): Promise<boolean> => {
    const success = await storeDeleteCustomer(id);
    if (success) {
      loadCustomers(); // Refetch list after successful deletion
    }
    return success;
  };

  const resetCustomerPassword = async (id: string): Promise<boolean> => {
    // This action typically doesn't require a list refetch.
    return storeResetPassword(id);
  };


  return {
    // State
    customers,
    selectedCustomer,
    loading, // This is the store's loading state, shared by fetch & CRUD ops in store
    error,   // Store's error state
    pagination,
    total,
    filters,

    // Filter/Pagination actions
    setFilters,
    setPagination,
    resetFilters,

    // CRUD actions exposed by the hook
    addCustomer,      // Hook's version that refetches
    updateCustomer,   // Store's optimistic version
    deleteCustomer,   // Hook's version that refetches
    resetPassword: resetCustomerPassword,
    setSelectedCustomer,

    // Refetch action
    refetchCustomers: loadCustomers,
  };
}
