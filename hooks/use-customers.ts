"use client";

import { useEffect, useCallback } from "react";
import { useCustomerStore } from "@/stores/customer-store";
// No need to import customerService here anymore

export function useCustomers() {
  const {
    customers,
    total,
    loading,
    error,
    filters,      // For useEffect dependency array
    pagination,   // For useEffect dependency array
    loadCustomers: storeLoadCustomers, // Action from the store
    setSelectedCustomer, // Still useful to pass through
  } = useCustomerStore(state => ({
    customers: state.customers,
    total: state.total,
    loading: state.loading,
    error: state.error,
    filters: state.filters,
    pagination: state.pagination,
    loadCustomers: state.loadCustomers,
    setSelectedCustomer: state.setSelectedCustomer,
  }));

  // The store's loadCustomers action is memoized by Zustand
  // Create a stable refetch function
  const refetch = useCallback(() => {
    storeLoadCustomers();
  }, [storeLoadCustomers]);

  useEffect(() => {
    // Initial load and reload when filters or pagination change.
    storeLoadCustomers();
  }, [
    filters.name,
    filters.email,
    filters.status,
    filters.sortBy,
    filters.sortOrder,
    pagination.pageIndex,
    pagination.pageSize,
    storeLoadCustomers,
  ]);

  return {
    customers,
    total,
    loading,
    error,
    refetch,
    setSelectedCustomer, // Continue to expose this for convenience
  };
}
