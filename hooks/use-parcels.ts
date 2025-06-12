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
    loading,
    filters,
    pagination,
    setParcels,
    setLoading,
    setSelectedParcel,
    setError,
    error: parcelStoreError
  } = useParcelStore();

  const loadParcels = useCallback(async () => {
    if (!user) {
      return;
    }

    setLoading(true);
    if (parcelStoreError) {
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
      const result: ParcelListResponse = await fetchParcelsService(serviceFilters);
      setParcels(result.parcels, result.total);

    } catch (error) {
      console.error("Error in useParcels after API call (already handled globally):", error);
    } finally {
      setLoading(false);
    }
  }, [user, filters, pagination, setLoading, setParcels, setError, parcelStoreError]);

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
