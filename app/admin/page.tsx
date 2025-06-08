"use client"

import { useEffect, useState, useMemo, useCallback } from "react" // Added useMemo and useCallback
import { useRouter } from "next/navigation"
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  type ColumnDef,
  type SortingState,
  type RowSelectionState, // Added for row selection
} from "@tanstack/react-table"

import { useAuthStore } from "@/stores/auth-store"
import { useParcelStore } from "@/stores/parcel-store"
import { useParcels } from "@/hooks/use-parcels"
import { getParcelTableColumns } from "@/components/parcel/parcel-table-columns"
import type { Parcel } from "@/lib/types"
import { ColumnVisibilityDropdown } from "@/components/ui/ColumnVisibilityDropdown"
import { showToast } from '@/lib/toast-utils'; // Import showToast

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ParcelFilters } from "@/components/parcel/parcel-filters"
import { ParcelTable } from "@/components/parcel/parcel-table"
import { ParcelPagination } from "@/components/parcel/parcel-pagination"
import { ParcelDetailModal } from "@/components/parcel/parcel-detail-modal"
import { ParcelForm } from "@/components/admin/parcel-form"
import { ExcelUpload } from "@/components/admin/excel-upload"
import { StatCard } from "@/components/ui/stat-card"
import { Button } from "@/components/ui/button"
import { Plus, Package, DollarSign, Users, TrendingUp, PackageCheck } from "lucide-react" // Added PackageCheck

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuthStore()
  const router = useRouter()

  // Data from useParcels, setSelectedParcel from useParcelStore
  const { loading, refetch, parcels } = useParcels()
  const { setSelectedParcel } = useParcelStore()

  const [showParcelForm, setShowParcelForm] = useState(false)
  const [sorting, setSorting] = useState<SortingState>([])
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [editingParcel, setEditingParcel] = useState<Parcel | null>(null)
  const [updatingStatusForId, setUpdatingStatusForId] = useState<string | null>(null); // New state

  const handleStatusChange = useCallback(async (parcelId: string, newStatus: Parcel["status"]) => {
    setUpdatingStatusForId(parcelId); // Set loading state
    try {
      console.log("Attempting to update status for parcel:", parcelId, "to", newStatus);
      const response = await fetch(`/api/admin/parcel/${parcelId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        refetch();
        showToast(`พัสดุ ${parcelId} อัปเดตสถานะเป็น ${newStatus} แล้ว`, "success");
      } else {
        const errorData = await response.json().catch(() => ({ message: "Failed to parse error response" }));
        showToast(`ไม่สามารถอัปเดตสถานะพัสดุ ${parcelId}`, "error", { description: errorData.message || response.statusText });
      }
    } catch (error) {
      console.error("Failed to update status:", error);
      showToast(`เกิดข้อผิดพลาดในการอัปเดตสถานะพัสดุ ${parcelId}`, "error");
    } finally {
      setUpdatingStatusForId(null); // Clear loading state
    }
  }, [refetch]);

  const handleEdit = useCallback((parcel: Parcel) => {
    setEditingParcel(parcel);
    setShowParcelForm(true);
  }, []);

  // Unified form submission (add/edit)
  const handleFormSubmit = async (data: Omit<Parcel, 'id' | 'status' | 'paymentStatus' | 'createdAt' | 'updatedAt'> & { receiveDate: string }) => {
    const url = editingParcel ? `/api/admin/parcel/${editingParcel.id}` : "/api/admin/parcel";
    const method = editingParcel ? "PUT" : "POST";

    // Construct payload, ensuring numeric fields are numbers if necessary from form data
    // ParcelForm already uses valueAsNumber for these, but good to be mindful
    const payload = {
      ...data,
      // Convert receiveDate string from form to Date object or ISO string if API expects it
      // For now, assuming API can handle string or it's processed in API route
      // If API expects Date: receiveDate: new Date(data.receiveDate),
      // If API expects specific string format, ensure it here.
      // The current API placeholder for PUT [id]/route.ts just logs the body.
    };

    try {
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        refetch();
        if (editingParcel) {
          showToast("อัปเดตข้อมูลพัสดุสำเร็จ!", "success");
        } else {
          showToast("เพิ่มรายการสินค้าสำเร็จ!", "success");
        }
        setShowParcelForm(false);
        setEditingParcel(null);
      } else {
        const errorData = await response.json().catch(() => ({ message: "Failed to parse error response" }));
        showToast("เกิดข้อผิดพลาด", "error", { description: errorData.message || response.statusText });
      }
    } catch (error) {
      console.error("Failed to submit parcel form:", error);
      showToast("เกิดข้อผิดพลาดที่ไม่คาดคิด", "error");
    }
  };

  // Get columns from the shared function
  const columns = useMemo<ColumnDef<Parcel>[]>(
    () => getParcelTableColumns({
      setSelectedParcel,
      onStatusChange: handleStatusChange,
      onEdit: handleEdit,
      updatingStatusForId, // Pass new state
    }),
    [setSelectedParcel, handleStatusChange, handleEdit, updatingStatusForId] // Add to dependencies
  );

  const table = useReactTable({
    data: parcels,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    enableRowSelection: true, // Enabled row selection
    onRowSelectionChange: setRowSelection, // Added row selection handler
    getRowId: (row) => row.id, // Added getRowId
    state: {
      sorting,
      rowSelection, // Added rowSelection to state
    },
  });


  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    if (user?.role !== "admin") {
      router.push("/dashboard")
      return
    }
  }, [isAuthenticated, user, router])

  // handleAddParcel is now part of handleFormSubmit
  // const handleAddParcel = async (data: any) => { ... }

  const handleExcelImport = async (data: Partial<Parcel>[]) => {
    try {
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parcels: data }),
      })

      if (response.ok) {
        refetch()
      }
    } catch (error) {
      console.error("Failed to import Excel data:", error)
      throw error
    }
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return null
  }

  const totalParcels = parcels.length
  const totalRevenue = parcels.reduce((sum, p) => sum + p.estimate, 0)
  const uniqueCustomers = new Set(parcels.map((p) => p.customerCode)).size
  const pendingParcels = parcels.filter((p) => p.status === "pending").length

  const breadcrumbs = [{ label: "Admin Dashboard" }]

  const handleBulkDeliver = async () => {
    const selectedIds = table.getSelectedRowModel().flatRows.map(row => row.original.id);
    if (selectedIds.length === 0) {
      showToast("กรุณาเลือกพัสดุที่ต้องการดำเนินการ", "info");
      return;
    }

    try {
      const response = await fetch(`/api/admin/parcel/bulk-deliver`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds }),
      });

      if (response.ok) {
        refetch();
        showToast("พัสดุที่เลือกถูกอัปเดตสถานะเป็น 'delivered' เรียบร้อยแล้ว", "success");
        setRowSelection({}); // Clear selection
      } else {
        const errorData = await response.json().catch(() => ({ message: "Failed to parse error response" }));
        showToast("ไม่สามารถอัปเดตสถานะพัสดุที่เลือก", "error", { description: errorData.message || response.statusText });
      }
    } catch (error) {
      console.error("Failed to mark parcels as delivered:", error);
      showToast("เกิดข้อผิดพลาดในการอัปเดตสถานะพัสดุที่เลือก", "error");
    }
  };

  return (
    <DashboardLayout breadcrumbs={breadcrumbs} tableInstance={table}>
      <div className="space-y-6 sm:space-y-8">
        {/* Header Section */}
        <div className="stagger-item">
          <h1 className="text-xl sm:text-heading font-bold text-[#212121] mb-1 sm:mb-2">
            Admin Dashboard
          </h1>
          <p className="text-sm sm:text-subtitle text-gray-600 font-normal">
            จัดการข้อมูลพัสดุทั้งหมดในระบบ
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
            title="รายได้รวม"
            value={`฿${totalRevenue.toLocaleString()}`}
            subtitle="บาท"
            icon={<DollarSign />}
            variant="pink"
          />
          <StatCard
            title="ลูกค้า"
            value={uniqueCustomers}
            subtitle="คน"
            icon={<Users />}
            variant="cyan"
          />
          <StatCard
            title="รอดำเนินการ"
            value={pendingParcels}
            subtitle="รายการ"
            icon={<TrendingUp />}
            variant="green"
          />
        </div>

        {/* Excel Upload Section */}
        <div className="stagger-item">
          <ExcelUpload onImport={handleExcelImport} />
        </div>

        {/* Filters Section */}
        <div className="stagger-item">
          <ParcelFilters />
        </div>

        {/* Action Header */}
        <div className="stagger-item flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-lg sm:text-title font-semibold text-[#212121]">
            รายการพัสดุในคลัง
          </h2>
          <Button
            onClick={() => {
              setEditingParcel(null); // Ensure form is in 'add' mode
              setShowParcelForm(true);
            }}
            className="ripple bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium px-4 sm:px-6 py-2 sm:py-3 rounded-xl shadow-material-4 transition-all duration-300 hover:shadow-material-8 touch-target w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            <span className="text-sm sm:text-base">เพิ่มรายการสินค้า</span>
          </Button>
        </div>

        {/* Table Section */}
        <div className="stagger-item">
          {loading ? (
            <div className="glass-effect rounded-2xl p-8 sm:p-12 text-center shadow-material-4">
              <div className="inline-block animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-4 border-blue-200 border-t-blue-600 mb-4"></div>
              <p className="text-sm sm:text-subtitle text-gray-600 font-medium">
                กำลังโหลดข้อมูล...
              </p>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {/* Action buttons above table */}
              <div className="flex flex-col sm:flex-row gap-2 items-center">
                <Button
                  onClick={handleBulkDeliver}
                  disabled={Object.keys(rowSelection).length === 0}
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  <PackageCheck className="mr-2 h-4 w-4" /> Mark All Delivered ({Object.keys(rowSelection).length})
                </Button>
                <ColumnVisibilityDropdown table={table} />
              </div>
              <div className="glass-effect rounded-2xl overflow-hidden shadow-material-4">
                <ParcelTable<Parcel> table={table} />
              </div>
              <ParcelPagination />
            </div>
          )}
        </div>

        <ParcelDetailModal />
        {showParcelForm && ( // Conditionally render ParcelForm to ensure useEffect in ParcelForm re-runs correctly on open
          <ParcelForm
            open={showParcelForm}
            onClose={() => {
              setShowParcelForm(false);
              setEditingParcel(null);
            }}
            onSubmit={handleFormSubmit}
            initialData={editingParcel || undefined}
            isEditMode={!!editingParcel}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
