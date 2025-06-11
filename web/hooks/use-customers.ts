"use client";

import { useEffect, useCallback } from "react";
import { useCustomerStore } from "@/stores/customer-store";
import type { CustomerQuery } from "@/lib/types"; // Only CustomerQuery needed for loadCustomers params

export function useCustomers() {
  // Select actions and stable states from the store
  const storeFetchCustomers = useCustomerStore((state) => state.fetchCustomers);
  const setFilters = useCustomerStore((state) => state.setFilters);
  const setPagination = useCustomerStore((state) => state.setPagination);
  const resetFilters = useCustomerStore((state) => state.resetFilters);

  // Select states that are used as dependencies for loadCustomers or returned directly
  const filters = useCustomerStore((state) => state.filters);
  const pagination = useCustomerStore((state) => state.pagination);
  const loading = useCustomerStore((state) => state.loading);
  const error = useCustomerStore((state) => state.error);

  // Other actions to be exposed
  const addCustomer = useCustomerStore((state) => state.addCustomer);
  const updateCustomer = useCustomerStore((state) => state.updateCustomer);
  const deleteCustomer = useCustomerStore((state) => state.deleteCustomer);
  const resetPassword = useCustomerStore((state) => state.resetPassword);
  const setSelectedCustomer = useCustomerStore((state) => state.setSelectedCustomer);

  // Define loadCustomers, similar to loadParcels in useParcels
  // This function will be memoized and its dependencies carefully chosen.
  const loadCustomers = useCallback(async (queryParams?: CustomerQuery) => {
    // storeFetchCustomers already handles setting loading/error states
    // and uses current filters/pagination from store if queryParams is not overriding
    await storeFetchCustomers(queryParams);
  }, [storeFetchCustomers]); // storeFetchCustomers from Zustand is a stable reference

  // useEffect for initial load and when specific filter/pagination values change
  useEffect(() => {
    // This effect now depends on loadCustomers, which in turn depends on storeFetchCustomers.
    // The actual primitive values that trigger the fetch are implicitly handled by
    // how components call setFilters or setPagination, which then changes the 'filters'
    // or 'pagination' objects from the store, triggering a re-render of this hook.
    // The key is that loadCustomers itself doesn't change unless storeFetchCustomers changes (which it shouldn't).
    // The hook re-runs, `filters` or `pagination` objects are new, but `loadCustomers` is stable.
    // The call to `loadCustomers()` uses the latest `filters` and `pagination` from the store via `get()` inside `storeFetchCustomers`.

    // To make it react to changes in filters and pagination from the store,
    // as `useParcels` reacts to `filters` and `pagination` for its `loadParcels`
    // We need to include those specific primitive values that should trigger a reload in `loadCustomers`'s deps,
    // or make `loadCustomers` not take params and always use store state, and put primitives in useEffect's deps.

    // Let's refine loadCustomers and its dependencies to be more explicit like useParcels's loadParcels
    // For now, the previous store refactor made fetchCustomers use its internal state.
    // The hook's job is to call that when critical pieces change.
    loadCustomers();
  }, [
    loadCustomers, // This is stable
    // Now, explicitly add the primitive values from filters and pagination
    // that should trigger a data reload.
    filters.name,
    filters.email,
    filters.status,
    filters.sortBy,
    filters.sortOrder,
    pagination.pageIndex,
    pagination.pageSize,
  ]);

  return {
    // State selected for optimized re-renders
    customers: useCustomerStore((state) => state.customers),
    selectedCustomer: useCustomerStore((state) => state.selectedCustomer), // For consistency if selectedParcel is done this way
    total: useCustomerStore((state) => state.total),

    // Directly returned states
    loading,
    error,
    pagination, // Return the whole pagination object
    filters,    // Return the whole filters object

    // Actions from store
    addCustomer,
    updateCustomer,
    deleteCustomer,
    resetPassword,
    setSelectedCustomer,
    setPagination,
    setFilters,
    resetFilters,

    // Specific actions
    // refetchCustomers can be the loadCustomers if it's designed to be called externally.
    // Or, if loadCustomers is only for internal useEffect, refetchCustomers could be storeFetchCustomers directly.
    refetchCustomers: loadCustomers, // Expose loadCustomers as refetchCustomers
  };
}
