"use client"

import { useEffect } from "react"
import { useParcelStore } from "@/stores/parcel-store"
import { useAuthStore } from "@/stores/auth-store"
import type { ParcelListResponse } from "@/lib/types"

export function useParcels() {
  const { user } = useAuthStore()
  const { parcels, total, loading, filters, pagination, setParcels, setLoading, setSelectedParcel } = useParcelStore()

  const fetchParcels = async () => {
    if (!user) return

    setLoading(true)
    try {
      // Filter out empty values
      const filterParams = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== "" && value !== undefined),
      )

      const params = new URLSearchParams({
        page: (pagination.pageIndex + 1).toString(),
        pageSize: pagination.pageSize.toString(),
        ...filterParams,
      })

      // Add customerCode filter for customer role
      if (user.role === "customer" && user.customerCode) {
        params.append("customerCode", user.customerCode)
      }

      const response = await fetch(`/api/parcel?${params}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result: ParcelListResponse = await response.json()
      setParcels(result.parcels, result.total)
    } catch (error) {
      console.error("Failed to fetch parcels:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchParcels()
  }, [filters, pagination, user])

  return {
    parcels,
    total,
    loading,
    refetch: fetchParcels,
    setSelectedParcel
  }
}
