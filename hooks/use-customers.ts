"use client";

import { useEffect, useCallback } from "react";
import { useCustomerStore } from "@/stores/customer-store";
import type { CustomerQuery } from "@/lib/types";

export function useCustomers() {
  const {
    isLoading,
    filters,
    pagination,
    error: customerStoreError,
    setSelectedCustomer,
    fetchCustomers,
  } = useCustomerStore();

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  return {
    customers: useCustomerStore((state) => state.customers),
    total: useCustomerStore((state) => state.total),
    isLoading,
    error: customerStoreError,
    refetch: fetchCustomers,
    setSelectedCustomer,
  };
}
