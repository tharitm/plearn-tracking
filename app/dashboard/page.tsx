"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  type ColumnDef,
  type SortingState,
  type PaginationState, // Import PaginationState
} from "@tanstack/react-table"
import { Package, TrendingUp, Clock, CheckCircle } from "lucide-react"

import { useAuthStore } from "@/stores/auth-store"
import type { Parcel } from "@/lib/types"
import type { Role } from "@/lib/column-configs"; // Import Role type

import { getParcelTableColumns } from "@/components/parcel/parcel-table-columns"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ParcelFilters } from "@/components/parcel/parcel-filters"
import { ParcelTable } from "@/components/parcel/parcel-table"
import { ParcelTableSkeleton } from "@/components/parcel/parcel-table-skeleton"; // Add this line
import { ParcelPagination } from "@/components/parcel/parcel-pagination"
import { ParcelDetailModal } from "@/components/parcel/parcel-detail-modal"
import { ParcelGalleryModal } from "@/components/parcel/parcel-gallery-modal"
// import { StatCard } from "@/components/ui/stat-card" // StatCard is commented out, so import can be too
import { useParcels } from "@/hooks/use-parcels"
import { useParcelStore } from "@/stores/parcel-store"

export default function CustomerDashboard() {
  const { user, isAuthenticated } = useAuthStore()
  const router = useRouter()
  const { loading, parcels = [] } = useParcels()
  const {
    galleryImages,
    closeGallery,
    setSelectedParcel,
    pagination, // Get pagination state from store
    setPagination, // Get setPagination action from store
  } = useParcelStore()
  const [sorting, setSorting] = useState<SortingState>([])


  const columns = useMemo<ColumnDef<Parcel>[]>(() => {
    if (!user?.role) {
      return [];
    }
    return getParcelTableColumns({
      userRole: user.role as Role,
      setSelectedParcel,
    });
  }, [user?.role, setSelectedParcel]);

  const table = useReactTable({
    data: parcels,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    // Manual pagination because data is fetched externally
    manualPagination: true,
    // Pass the pagination state from the store
    onPaginationChange: setPagination, // Use the action from the store
    state: {
      sorting,
      pagination, // Pass pagination state from store
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
    return null
  }

  // Calculate stats from the store's parcels
  const totalParcels = parcels.length;
  const pendingParcels = parcels.filter((p) => p.status === "pending").length;
  const shippedParcels = parcels.filter((p) => p.status === "shipped").length;
  const deliveredParcels = parcels.filter((p) => p.status === "delivered").length;

  const breadcrumbs = [{ label: "Dashboard" }];

  return (
    <DashboardLayout breadcrumbs={breadcrumbs} tableInstance={table}>
      <div className="space-y-6 sm:space-y-8">
        {/* Header Section */}
        <div className="stagger-item">
          <h1 className="text-xl sm:text-heading font-bold text-[#212121] mb-1 sm:mb-2">
            Plearn Tracking
          </h1>
          <p className="text-sm sm:text-subtitle text-gray-600 font-normal">
            จัดการและติดตามพัสดุของคุณ
          </p>
        </div>

        {/* Stats Grid - Mobile responsive */}
        {/* <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
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
        </div> */}

        {/* Filters Section */}
        <div className="stagger-item">
          <ParcelFilters />
        </div>

        {/* Table Section */}
        <div className="stagger-item">
          {loading ? ( // loading state from useParcelStore
            <div className="space-y-4 sm:space-y-6">
              <div className="glass-effect rounded-2xl overflow-hidden shadow-material-4">
                <ParcelTableSkeleton />
              </div>
              <ParcelPagination /> {/* Consider if pagination should also have a skeleton or be hidden */}
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
        <ParcelGalleryModal
          images={galleryImages}
          open={galleryImages.length > 0}
          onClose={closeGallery}
        />
      </div>
    </DashboardLayout>
  );
}
