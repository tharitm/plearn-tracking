"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table"
import { Package, TrendingUp, Clock, CheckCircle } from "lucide-react"

import { useAuthStore } from "@/stores/auth-store"
import type { Parcel } from "@/lib/types"
import type { Role } from "@/lib/column-configs"

import { getParcelTableColumns } from "@/components/parcel/parcel-table-columns"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ParcelFilters } from "@/components/parcel/parcel-filters"
import { ParcelTable } from "@/components/parcel/parcel-table"
import { ParcelTableSkeleton } from "@/components/parcel/parcel-table-skeleton"
import { ParcelPagination } from "@/components/parcel/parcel-pagination"
import { ParcelDetailModal } from "@/components/parcel/parcel-detail-modal"
import { ParcelGalleryModal } from "@/components/parcel/parcel-gallery-modal"
import { StatCard } from "@/components/ui/stat-card"
import { useParcels } from "@/hooks/use-parcels"
import { useParcelStore } from "@/stores/parcel-store"

export default function CustomerDashboard() {
  const { user, isAuthenticated, isInitializing } = useAuthStore()
  const router = useRouter()

  const { loading, parcels = [], setFilters, resetFilters } = useParcels()

  // ดึงเฉพาะ method/state ที่ต้องการจาก zustand ให้ stable
  const setSelectedParcel = useParcelStore(state => state.setSelectedParcel)
  const galleryImages = useParcelStore(state => state.galleryImages)
  const closeGallery = useParcelStore(state => state.closeGallery)

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
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  useEffect(() => {
    if (isInitializing) {
      return;
    }

    if (isAuthenticated) {
      if (user?.role !== "customer") {
        router.push("/admin");
        return;
      }
    } else {
      router.push("/login");
      return;
    }
  }, [isAuthenticated, user, router, isInitializing]);

  if (isInitializing) {
    return null;
  }

  if (!isAuthenticated || (user && user.role !== "customer")) {
    return null;
  }

  // Calculate stats from the store's parcels
  const totalParcels = parcels.length;
  const pendingParcels = parcels.filter((p) => p.status === "pending").length;
  const shippedParcels = parcels.filter((p) => p.status === "shipped").length;
  const deliveredParcels = parcels.filter((p) => p.status === "delivered").length;

  const breadcrumbs = [{ label: "Dashboard" }];

  const handleSearch = (filters: any) => {
    setFilters(filters);
  };

  const handleReset = () => {
    resetFilters();
  };

  return (
    <DashboardLayout breadcrumbs={breadcrumbs} tableInstance={table}>
      <div className="space-y-6 sm:space-y-8">
        {/* Header Section */}
        <div className="stagger-item bg-white rounded-3xl p-3 shadow-soft-xl border border-gray-100/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-blue-50 rounded-2xl shadow-soft-sm">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl sm:text-heading font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1 sm:mb-2">
                Plearn Tracking
              </h1>
              <p className="text-sm sm:text-subtitle text-gray-600 font-normal">
                จัดการและติดตามพัสดุของคุณ
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
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
          <ParcelFilters onSearch={handleSearch} onReset={handleReset} />
        </div>

        {/* Table Section */}
        <div className="stagger-item">
          {loading ? (
            <div className="space-y-4 sm:space-y-6">
              <div className="glass-effect rounded-2xl overflow-hidden shadow-material-4">
                <ParcelTableSkeleton />
              </div>
              <ParcelPagination />
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
