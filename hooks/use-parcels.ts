// hooks/use-parcels.ts
"use client"

import { useEffect, useCallback } from "react"
import { useAuthStore } from "@/stores/auth-store"
import { useParcelStore } from "@/stores/parcel-store"

export function useParcels() {
  const user = useAuthStore(state => state.user)
  const {
    parcels,
    total,
    loading,
    error,
    filters, // Keep filters for dependency array
    pagination, // Keep pagination for dependency array
    loadParcels: storeLoadParcels, // Action from the store
  } = useParcelStore(state => ({
    parcels: state.parcels,
    total: state.total,
    loading: state.loading,
    error: state.error,
    filters: state.filters,
    pagination: state.pagination,
    loadParcels: state.loadParcels,
  }))

  // The store's loadParcels action is already memoized by Zustand if defined directly in create()
  // We create a stable refetch function here that passes the current user.
  const refetch = useCallback(() => {
    storeLoadParcels(user)
  }, [storeLoadParcels, user])

  useEffect(() => {
    // Initial load and reload when filters, pagination, or user changes.
    // The store's loadParcels action handles its own loading/error state.
    storeLoadParcels(user)
  }, [
    user, // user object itself
    filters.status, // individual filter fields
    filters.search,
    filters.dateFrom,
    filters.dateTo,
    filters.paymentStatus,
    filters.trackingNo,
    pagination.pageIndex, // individual pagination fields
    pagination.pageSize,
    storeLoadParcels, // The action from the store
  ])

  return {
    parcels,
    total,
    loading,
    error,
    refetch, // Expose the refetch function
  }
}
