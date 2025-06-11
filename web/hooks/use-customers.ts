"use client";

import { useEffect, useCallback } from "react";
import { useCustomerStore } from "@/stores/customer-store";
import type { CustomerQuery, CreateCustomerPayload, UpdateCustomerPayload, Customer, PaginationState } from "@/lib/types";

export function useCustomers() {
  const {
    customers,
    selectedCustomer,
    loading,
    error,
    pagination,
    total,
    filters,
    fetchCustomers: storeFetchCustomers,
    addCustomer: storeAddCustomer,
    updateCustomer: storeUpdateCustomer,
    deleteCustomer: storeDeleteCustomer,
    resetPassword: storeResetPassword,
    setSelectedCustomer: storeSetSelectedCustomer,
    setLoading: storeSetLoading,
    setError: storeSetError,
    setPagination: storeSetPagination,
    setFilters: storeSetFilters,
    resetFilters: storeResetFilters,
  } = useCustomerStore();

  // Callback for refetching, potentially with new or modified query parameters
  const refetchCustomers = useCallback(async (queryParams?: CustomerQuery) => {
    // queryParams passed here will override existing filters/pagination from store for this fetch call
    await storeFetchCustomers(queryParams);
  }, [storeFetchCustomers]);

  // useEffect for initial load or when primary dependencies like filters/pagination change
  // This is similar to useParcels. Components might also trigger this.
  // The store's fetchCustomers already uses current filters and pagination from state.
  useEffect(() => {
    // Initial fetch when the hook is mounted or when filters/pagination (from store) change.
    // The store's fetchCustomers combines its internal filters/pagination with any direct queryParams.
    // So, calling it without arguments uses the store's current state.
    storeFetchCustomers();
  }, [storeFetchCustomers, filters, pagination.pageIndex, pagination.pageSize]); // Dependencies ensure fetch on change

  return {
    // State
    customers,
    selectedCustomer,
    loading,
    error,
    pagination,
    total,
    filters,

    // Actions from store
    addCustomer: storeAddCustomer,
    updateCustomer: storeUpdateCustomer,
    deleteCustomer: storeDeleteCustomer,
    resetPassword: storeResetPassword,
    setSelectedCustomer: storeSetSelectedCustomer,
    setPagination: storeSetPagination,
    setFilters: storeSetFilters,
    resetFilters: storeResetFilters,

    // Specific actions
    refetchCustomers,

    // Raw store actions if needed, though usually covered by above
    // _storeSetLoading: storeSetLoading, // Example if direct access to setters is needed
    // _storeSetError: storeSetError,     // Example
  };
}
