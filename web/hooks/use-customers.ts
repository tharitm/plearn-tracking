"use client";

import { useEffect, useCallback } from "react";
import { useCustomerStore } from "@/stores/customer-store";
import * as customerService from "@/services/customerService"; // For fetchCustomers call
import type { CustomerQuery } from "@/lib/types";
// CreateCustomerPayload, UpdateCustomerPayload, Customer are not directly used by this hook anymore for CRUD.

export function useCustomers() {
  // Select actions and states from the store, similar to useParcels
  const {
    loading,
    filters,
    pagination,
    setCustomers,
    setLoading,
    setError,
    error: customerStoreError,
    setSelectedCustomer,
  } = useCustomerStore();

  // Mimic loadParcels structure for loadCustomers
  const loadCustomers = useCallback(async () => {
    // No user role check needed here as admin is assumed for customer management page

    setLoading(true);
    if (customerStoreError) {
      setError(null); // Clear previous store-specific error
    }

    try {
      const query: CustomerQuery = {
        ...filters,
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
      };

      // Call the customer service directly
      const result = await customerService.fetchCustomers(query);
      // Use the store's setter for fetched data
      setCustomers(result.data, result.pagination.total);
      // Note: setCustomers in the store also updates total and pagination from result.
      // The store's setFetchedData (now setCustomers) was:
      // setFetchedData: (result) => set({
      //   customers: result.data,
      //   total: result.pagination.total,
      //   pagination: {
      //       pageIndex: result.pagination.page - 1,
      //       pageSize: result.pagination.limit
      //   },
      //   error: null,
      // })
      // This means pagination state in store IS updated by setCustomers (via setFetchedData logic).
      // This differs slightly from useParcels where setParcels only sets parcels and total.
      // For closer alignment, setCustomers should only set customers and total.
      // And pagination state should be updated by the component via setPagination if API returns different page details.
      // However, the previous store refactor aimed to have setFetchedData update pagination.
      // Let's stick to the store's current setCustomers (renamed setFetchedData) behavior.
      // If it causes issues, it needs adjustment in the store.

    } catch (error) {
      // The service's withErrorHandling already updates globalErrorStore.
      // The store's setError might be called by the service wrapper or here if needed.
      // useParcels' catch block is minimal. This one will also be.
      console.error("Error in useCustomers' loadCustomers (already handled globally):", error);
      // If an error occurs, setCustomers / setError in the store should handle clearing data.
      // The store's setError in the previous step was:
      // setFetchError: (error) => set({ error, customers: [], total: 0, ... })
      // The service call is wrapped, so it throws. If fetchCustomers service fails,
      // it will throw, and this catch block will execute.
      // We should ensure store's error state is set.
      // The `withErrorHandling` in service calls `globalErrorStore.setError`.
      // If we also want to set local store error:
      // setError(error instanceof Error ? error.message : "An unknown error occurred");
      // For now, assume global error is primary, local might be set by service call failure if not caught by service's withErrorHandling.
      // The store's setError is used by the hook, so if service throws, this catch won't be hit by withErrorHandling.
      // This means this catch IS important if service itself re-throws.
      if (error instanceof Error) {
         setError(error.message); // Set local store error
      } else {
         setError("An unknown error occurred while fetching customers.");
      }
    } finally {
      setLoading(false);
    }
  }, [
    filters,
    pagination,
    setLoading,
    setCustomers,
    setError,
    customerStoreError
  ]);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]); // useEffect depends on the memoized loadCustomers

  return {
    customers: useCustomerStore((state) => state.customers),
    total: useCustomerStore((state) => state.total),
    loading,
    error: customerStoreError,
    refetch: loadCustomers,
    setSelectedCustomer,

    // Pagination and Filters state are also needed by components using the table
    // useParcels does not explicitly return these, implying components get them from useParcelStore directly.
    // For consistency, we will not return them here. Components should use useCustomerStore for them.
    // pagination: useCustomerStore((state) => state.pagination),
    // filters: useCustomerStore((state) => state.filters),
  };
}
