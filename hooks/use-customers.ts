"use client";

import { useEffect, useCallback } from "react";
import { useCustomerStore } from "@/stores/customer-store";
import * as customerService from "@/services/customerService";
import type { CustomerQuery } from "@/lib/types";

export function useCustomers() {
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

  const loadCustomers = useCallback(async () => {

    setLoading(true);
    if (customerStoreError) {
      setError(null);
    }

    try {
      const query: CustomerQuery = {
        ...filters,
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
      };

      const result = await customerService.fetchCustomers(query);
      setCustomers(result.data, result.pagination.total);


    } catch (error) {
      console.error("Error in useCustomers' loadCustomers (already handled globally):", error);
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
  }, [loadCustomers]);

  return {
    customers: useCustomerStore((state) => state.customers),
    total: useCustomerStore((state) => state.total),
    loading,
    error: customerStoreError,
    refetch: loadCustomers,
    setSelectedCustomer,
  };
}
