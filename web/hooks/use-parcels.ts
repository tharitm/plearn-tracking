"use client"

import { useEffect, useCallback } from "react"; // Added useCallback
import { useParcelStore } from "@/stores/parcel-store";
import { useAuthStore } from "@/stores/auth-store";
import type { ParcelListResponse, ParcelFilters } from "@/lib/types"; // ParcelFilters might be useful
import { fetchParcels as fetchParcelsService } from "@/services/parcelService"; // Import the new service

export function useParcels() {
  const { user } = useAuthStore();
  const {
    parcels,
    total,
    loading,
    filters, // This is ParcelFilters from the store
    pagination, // This is PaginationState { pageIndex, pageSize }
    setParcels,
    setLoading,
    setSelectedParcel,
    setError // Assuming an setError exists in the store
  } = useParcelStore();

  // The actual function that calls the service
  const loadParcels = useCallback(async () => {
    if (!user) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const serviceFilters: ParcelFilters & { page?: number; pageSize?: number; customerCode?: string } = {
        ...filters, // Spread the filters from the store (status, paymentStatus, trackingNo, dateFrom, dateTo, search)
        page: pagination.pageIndex + 1, // Convert 0-based pageIndex to 1-based page
        pageSize: pagination.pageSize,
      };

      // Add customerCode filter for customer role, directly into the serviceFilters object
      if (user.role === "customer" && user.customerCode) {
        serviceFilters.customerCode = user.customerCode;
      }

      // Call the new service function
      const result: ParcelListResponse = await fetchParcelsService(serviceFilters);
      setParcels(result.parcels, result.total);

    } catch (error) {
      console.error("Failed to fetch parcels:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      setError(errorMessage); // Set error state in the store
      // Optionally, setParcels to empty array on error or keep stale data
      // setParcels([], 0);
    } finally {
      setLoading(false);
    }
  }, [user, filters, pagination, setLoading, setParcels, setError]); // Dependencies for useCallback

  // useEffect to trigger loadParcels when dependencies change
  useEffect(() => {
    loadParcels();
  }, [loadParcels]); // Dependency is the memoized loadParcels function

  return {
    parcels,
    total,
    loading,
    error: useParcelStore(state => state.error), // Expose error from store
    refetch: loadParcels, // Expose the memoized loadParcels as refetch
    setSelectedParcel,
    // Expose filters and pagination setters if components need to modify them directly
    // For example: setFilters: useParcelStore(state => state.setFilters)
  };
}
