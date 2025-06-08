"use client"

import { useEffect, useMemo, useState } from "react" // Added useMemo, useState
import { useRouter } from "next/navigation"
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel, // Import for pagination
  type ColumnDef,
  type SortingState,
  type PaginationState, // Import for pagination state
  // flexRender, // Not directly used here anymore
} from "@tanstack/react-table"
// Icons like ArrowUpDown are now used in parcel-table-columns.tsx
import { Package, TrendingUp, Clock, CheckCircle } from "lucide-react"

import { useAuthStore } from "@/stores/auth-store"
import { useParcelStore } from "@/stores/parcel-store" // For parcels data, setSelectedParcel, and total
import type { Parcel } from "@/lib/types" // For column definition
// Button and StatusBadge are used within parcel-table-columns.tsx

// Import the new shared column definition function
import { getParcelTableColumns } from "@/components/parcel/parcel-table-columns"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ParcelFilters } from "@/components/parcel/parcel-filters"
import { ParcelTable } from "@/components/parcel/parcel-table"
import { ParcelPagination } from "@/components/parcel/parcel-pagination"
import { ParcelDetailModal } from "@/components/parcel/parcel-detail-modal"
import { StatCard } from "@/components/ui/stat-card"
// import { useParcels } from "@/hooks/use-parcels"; // Data will come from useParcelStore

export default function CustomerDashboard() {
  const { user, isAuthenticated } = useAuthStore()
  const router = useRouter()
  // Fetch total from useParcelStore as it was used by ParcelPagination previously
  const { parcels, loading, setSelectedParcel, total } = useParcelStore()

  const [sorting, setSorting] = useState<SortingState>([])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10, // Default page size
  })

  // Get columns from the shared function
  const columns = useMemo<ColumnDef<Parcel>[]>(
    () => getParcelTableColumns({ setSelectedParcel, showPaymentStatus: true }),
    [setSelectedParcel] // Dependency: re-create columns if setSelectedParcel changes identity
  );

  const table = useReactTable({
    data: parcels,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(), // Enable pagination
    onSortingChange: setSorting,
    onPaginationChange: setPagination, // Wire up pagination state
    state: {
      sorting,
      pagination, // Pass pagination state to table
    },
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    if (user?.role !== "customer") {
      router.push("/admin")
      return
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || user?.role !== "customer") {
    return null // Or a loading spinner, or a redirect message
  }

  // Calculate stats from the store's parcels
  const totalParcels = parcels.length;
  const pendingParcels = parcels.filter((p) => p.status === "pending").length;
  const shippedParcels = parcels.filter((p) => p.status === "shipped").length;
  const deliveredParcels = parcels.filter((p) => p.status === "delivered").length;

  const breadcrumbs = [{ label: "Dashboard" }];

  return (
    // Pass table instance to DashboardLayout
    <DashboardLayout breadcrumbs={breadcrumbs} tableInstance={table}>
      <div className="space-y-6 sm:space-y-8">
        {/* Header Section */}
        <div className="stagger-item">
          <h1 className="text-xl sm:text-heading font-bold text-[#212121] mb-1 sm:mb-2">
            Dashboard ลูกค้า
          </h1>
          <p className="text-sm sm:text-subtitle text-gray-600 font-normal">
            จัดการและติดตามพัสดุของคุณ
          </p>
        </div>

        {/* Stats Grid - Mobile responsive */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <StatCard
            title="พัสดุทั้งหมด"
            value={totalParcels}
            subtitle="รายการ"
            icon={<Package />}
            variant="blue"
          />
          <StatCard
            title="รอส่ง"
            value={pendingParcels}
            subtitle="รายการ"
            icon={<Clock />}
            variant="pink"
          />
          <StatCard
            title="ส่งแล้ว"
            value={shippedParcels}
            subtitle="รายการ"
            icon={<TrendingUp />}
            variant="cyan"
          />
          <StatCard
            title="ส่งถึงแล้ว"
            value={deliveredParcels}
            subtitle="รายการ"
            icon={<CheckCircle />}
            variant="green"
          />
        </div>

        {/* Filters Section */}
        <div className="stagger-item">
          <ParcelFilters />
        </div>

        {/* Table Section */}
        <div className="stagger-item">
          {loading ? ( // loading state from useParcelStore
            <div className="glass-effect rounded-2xl p-8 sm:p-12 text-center shadow-material-4">
              <div className="inline-block animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-4 border-blue-200 border-t-blue-600 mb-4"></div>
              <p className="text-sm sm:text-subtitle text-gray-600 font-medium">
                กำลังโหลดข้อมูล...
              </p>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              <div className="glass-effect rounded-2xl overflow-hidden shadow-material-4">
                <ParcelTable table={table} />
              </div>
              <ParcelPagination />
            </div>
          )}
        </div>

        <ParcelDetailModal />
      </div>
    </DashboardLayout>
  );
}
