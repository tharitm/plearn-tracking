"use client"

import { useEffect, useMemo, useState } from "react" // Added useMemo, useState
import { useRouter } from "next/navigation"
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  type ColumnDef,
  type SortingState,
  flexRender, // Though flexRender is used in ParcelTable, good to have if we need it here
} from "@tanstack/react-table"
import { ArrowUpDown, ArrowUp, ArrowDown, Package, TrendingUp, Clock, CheckCircle } from "lucide-react" // Added table icons

import { useAuthStore } from "@/stores/auth-store"
import { useParcelStore } from "@/stores/parcel-store" // For parcels data and setSelectedParcel
import type { Parcel } from "@/lib/types" // For column definition
import { Button } from "@/components/ui/button" // For column headers
import { StatusBadge } from "@/components/ui/status-badge" // For column cells

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
  // const { loading, parcels } = useParcels() // Data now from parcelStore
  const { parcels, loading, setSelectedParcel } = useParcelStore() // Use parcelStore for data and actions

  const [sorting, setSorting] = useState<SortingState>([])

  // Helper for sort icons, moved from parcel-table
  const getSortIcon = (isSorted: false | "asc" | "desc") => {
    if (isSorted === "asc") return <ArrowUp className="ml-2 h-4 w-4" />
    if (isSorted === "desc") return <ArrowDown className="ml-2 h-4 w-4" />
    return <ArrowUpDown className="ml-2 h-4 w-4" />
  }

  // Columns definition, moved from parcel-table
  const columns = useMemo<ColumnDef<Parcel>[]>(() => {
    const baseColumns: ColumnDef<Parcel>[] = [
      {
        accessorKey: "parcelRef",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold hover:bg-transparent"
          >
            เลขที่รับพัสดุ
            {getSortIcon(column.getIsSorted())}
          </Button>
        ),
        cell: ({ row }) => (
          <Button
            variant="link"
            className="h-auto p-0 font-medium text-blue-600"
            onClick={() => setSelectedParcel(row.original)}
          >
            {row.getValue("parcelRef")}
          </Button>
        ),
      },
      {
        accessorKey: "receiveDate",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold hover:bg-transparent"
          >
            วันที่รับ
            {getSortIcon(column.getIsSorted())}
          </Button>
        ),
        cell: ({ row }) => new Date(row.getValue("receiveDate")).toLocaleDateString("th-TH"),
      },
      {
        accessorKey: "customerCode",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold hover:bg-transparent"
          >
            รหัสลูกค้า
            {getSortIcon(column.getIsSorted())}
          </Button>
        ),
      },
      {
        accessorKey: "shipment",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold hover:bg-transparent"
          >
            Shipment
            {getSortIcon(column.getIsSorted())}
          </Button>
        ),
      },
      {
        accessorKey: "estimate",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold hover:bg-transparent"
          >
            ประมาณการ
            {getSortIcon(column.getIsSorted())}
          </Button>
        ),
        cell: ({ row }) => `฿${row.getValue<number>("estimate").toLocaleString()}`,
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold hover:bg-transparent"
          >
            สถานะ
            {getSortIcon(column.getIsSorted())}
          </Button>
        ),
        cell: ({ row }) => <StatusBadge status={row.getValue("status")} type="parcel" />,
      },
      {
        accessorKey: "cnTracking",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold hover:bg-transparent"
          >
            TRACKING จีน
            {getSortIcon(column.getIsSorted())}
          </Button>
        ),
      },
      {
        accessorKey: "volume",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold hover:bg-transparent"
          >
            ปริมาณ (CBM)
            {getSortIcon(column.getIsSorted())}
          </Button>
        ),
        cell: ({ row }) => row.getValue<number>("volume").toFixed(2),
      },
      {
        accessorKey: "weight",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold hover:bg-transparent"
          >
            น้ำหนัก (KG)
            {getSortIcon(column.getIsSorted())}
          </Button>
        ),
        cell: ({ row }) => row.getValue<number>("weight").toFixed(2),
      },
      {
        accessorKey: "freight",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold hover:bg-transparent"
          >
            ค่าขนส่ง
            {getSortIcon(column.getIsSorted())}
          </Button>
        ),
        cell: ({ row }) => `฿${row.getValue<number>("freight").toLocaleString()}`,
      },
      {
        accessorKey: "deliveryMethod",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold hover:bg-transparent"
          >
            วิธีการจัดส่ง
            {getSortIcon(column.getIsSorted())}
          </Button>
        ),
        cell: ({ row }) => {
          const methodMap: Record<string, string> = {
            pickup: "รับที่โกดัง",
            delivery: "จัดส่งถึงบ้าน",
            express: "Express",
            economy: "Economy",
          }
          return methodMap[row.getValue("deliveryMethod")] || row.getValue("deliveryMethod")
        },
      },
      {
        accessorKey: "thTracking",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold hover:bg-transparent"
          >
            TRACKING ไทย
            {getSortIcon(column.getIsSorted())}
          </Button>
        ),
        cell: ({ row }) => row.getValue("thTracking") || "-",
      },
    ];

    // showPaymentStatus was true for customer dashboard
    baseColumns.push({
      accessorKey: "paymentStatus",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold hover:bg-transparent"
        >
          สถานะชำระเงิน
          {getSortIcon(column.getIsSorted())}
        </Button>
      ),
      cell: ({ row }) => <StatusBadge status={row.getValue("paymentStatus")} type="payment" />,
    });
    return baseColumns;
  }, [setSelectedParcel]); // getSortIcon is stable, so only setSelectedParcel is a dependency

  const table = useReactTable({
    data: parcels, // Data from useParcelStore
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
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
                {/* Pass table instance to ParcelTable */}
                <ParcelTable table={table} />
              </div>
              <ParcelPagination /> {/* This might need table instance too if it controls table pagination state */}
            </div>
          )}
        </div>

        <ParcelDetailModal />
      </div>
    </DashboardLayout>
  );
}
