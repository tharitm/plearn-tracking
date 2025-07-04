// useParcels.ts
"use client"

import { useEffect, useCallback } from "react"
import { useAuthStore } from "@/stores/auth-store"
import { useParcelStore } from "@/stores/parcel-store"
import { fetchParcels } from "@/services/parcelService"
import type { ParcelFilters, ParcelListResponse } from "@/lib/types"

export function useParcels() {
  // 1) ดึงเฉพาะค่าที่ต้อง subscribe โดยใช้ selector
  const user = useAuthStore(state => state.user)
  const filters = useParcelStore(state => state.filters)
  const pageIndex = useParcelStore(state => state.pagination.pageIndex)
  const pageSize = useParcelStore(state => state.pagination.pageSize)
  const parcels = useParcelStore(state => state.parcels)
  const total = useParcelStore(state => state.total)
  const loading = useParcelStore(state => state.loading)
  const error = useParcelStore(state => state.error)

  // 2) ดึง action แยกอีกที
  const setParcels = useParcelStore(state => state.setParcels)
  const setLoading = useParcelStore(state => state.setLoading)
  const setError = useParcelStore(state => state.setError)
  const setFilters = useParcelStore(state => state.setFilters)
  const resetFilters = useParcelStore(state => state.resetFilters)

  // 3) สร้าง loadParcels ที่มี deps เป็น primitives เท่านั้น
  const loadParcels = useCallback(async () => {
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      const serviceFilters: ParcelFilters & { page?: number; pageSize?: number; customerCode?: string } = {
        ...filters,
        page: pageIndex + 1, // API expects 1-based page number
        pageSize,
      }
      if (user.role === "customer") {
        serviceFilters.customerCode = user.customerCode
      }
      const result: ParcelListResponse = await fetchParcels(serviceFilters)
      setParcels(result.orders, result.total)
    } catch {
      // error handled by withErrorHandling
    } finally {
      setLoading(false)
    }
  }, [
    user?.role,
    user?.customerCode,
    filters.status,
    filters.search,
    filters.dateFrom,
    filters.dateTo,
    pageIndex,
    pageSize,
    setLoading,
    setParcels,
    setError,
  ])

  // 4) โหลดข้อมูลครั้งแรกเมื่อ user พร้อม
  useEffect(() => {
    if (user) {
      loadParcels()
    }
  }, [user]) // เปลี่ยนจาก [loadParcels] เป็น [user] เพื่อโหลดครั้งแรกเท่านั้น

  // Fetch parcels when filters or pagination changes
  useEffect(() => {
    loadParcels()
  }, [filters, pageIndex, pageSize])

  return {
    parcels,
    total,
    loading,
    error,
    refetch: loadParcels,
    setFilters,
    resetFilters
  }
}
