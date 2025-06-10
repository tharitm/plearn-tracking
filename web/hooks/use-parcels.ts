"use client"

import { useEffect, useCallback } from "react";
import { useParcelStore } from "@/stores/parcel-store";
import { useAuthStore } from "@/stores/auth-store";
import type { ParcelListResponse, ParcelFilters } from "@/lib/types";
// fetchParcelsService now refers to the wrapped version from parcelService.ts
import { fetchParcels as fetchParcelsService } from "@/services/parcelService";

export function useParcels() {
  const { user } = useAuthStore();
  const {
    // parcels, // No longer directly used from here if error sets them to empty
    // total,   // Same as above
    loading,
    filters,
    pagination,
    setParcels,
    setLoading,
    setSelectedParcel,
    setError, // Keep setError from useParcelStore for now, to clear previous specific errors
    error: parcelStoreError // Access error state for potential specific UI
  } = useParcelStore();

  const loadParcels = useCallback(async () => {
    if (!user) {
      // setParcels([], 0); // Optionally clear parcels if user logs out or is not present
      return;
    }

    setLoading(true);
    // Clear any previous parcel-specific error message before a new fetch attempt
    // The global error handler will display new API errors via toast.
    // This setError(null) is for the local useParcelStore error state.
    if (parcelStoreError) { // Only call setError if there's an existing error in parcelStore
        setError(null);
    }

    try {
      const serviceFilters: ParcelFilters & { page?: number; pageSize?: number; customerCode?: string } = {
        ...filters,
        page: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
      };

      if (user.role === "customer" && user.customerCode) {
        serviceFilters.customerCode = user.customerCode;
      }

      // The fetchParcelsService is already wrapped with error handling.
      // If it throws an error, the globalErrorStore will be updated, and a toast shown.
      // The error will also be re-thrown, so if we needed to catch it here for *specific*
      // UI changes in useParcels (beyond global toast), we could add a try-catch here.
      // For now, we assume the global toast is sufficient.
      const result: ParcelListResponse = await fetchParcelsService(serviceFilters);
      setParcels(result.parcels, result.total);

    } catch (error) {
      // This catch block will now only execute if fetchParcelsService re-throws an error
      // *and* we want to do something additional here. The global handler has already run.
      // For instance, if an error occurs, setParcels to empty or some default.
      console.error("Error in useParcels after API call (already handled globally):", error);
      // We might still want to set a local error state in useParcelStore if the UI needs
      // to react specifically to parcel loading failures, beyond the global toast.
      // const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      // setError(errorMessage); // This would update useParcelStore's error state.

      // Decide if parcels should be cleared on error
      // setParcels([], 0);
    } finally {
      setLoading(false);
    }
  }, [user, filters, pagination, setLoading, setParcels, setError, parcelStoreError]); // Added parcelStoreError

  useEffect(() => {
    loadParcels();
  }, [loadParcels]);

  return {
    parcels: useParcelStore(state => state.parcels), // Get fresh parcels state
    total: useParcelStore(state => state.total),     // Get fresh total state
    loading,
    error: parcelStoreError, // Expose parcel-store specific error
    refetch: loadParcels,
    setSelectedParcel,
  };
}
