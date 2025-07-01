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
import type { Role } from "@/lib/column-configs"; // Import Role type
import { ColumnVisibilityDropdown } from "@/components/ui/ColumnVisibilityDropdown"
import { showToast } from '@/lib/toast-utils'; // Import showToast

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ParcelFilters } from "@/components/parcel/parcel-filters"
import { ParcelTable } from "@/components/parcel/parcel-table"
import { ParcelTableSkeleton } from "@/components/parcel/parcel-table-skeleton"; // Add this line
import { ParcelPagination } from "@/components/parcel/parcel-pagination"
import { ParcelDetailModal } from "@/components/parcel/parcel-detail-modal"
import { ParcelGalleryModal } from "@/components/parcel/parcel-gallery-modal"
import { ParcelForm, ParcelFormData } from "@/components/admin/parcel-form"
import { ExcelUpload } from "@/components/admin/excel-upload"
import { StatCard } from "@/components/ui/stat-card"
import { Button } from "@/components/ui/button"
import { Plus, Package, DollarSign, Users, TrendingUp, PackageCheck } from "lucide-react" // Added PackageCheck
import { deleteOrder, createOrders, type CreateOrderPayload } from "@/services/parcelService"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuthStore()

  const { loading, refetch, parcels = [], setFilters, resetFilters } = useParcels()

  // ดึงเฉพาะ method/state ที่ต้องการจาก zustand ให้ stable
  const setSelectedParcel = useParcelStore(state => state.setSelectedParcel)
  const updateParcel = useParcelStore(state => state.updateParcel)
  const galleryImages = useParcelStore(state => state.galleryImages)
  const closeGallery = useParcelStore(state => state.closeGallery)

  const [showParcelForm, setShowParcelForm] = useState(false)
  const [sorting, setSorting] = useState<SortingState>([])
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [editingParcel, setEditingParcel] = useState<Parcel | null>(null)
  const [updatingStatusForId, setUpdatingStatusForId] = useState<string | null>(null)
  const [deletingParcel, setDeletingParcel] = useState<Parcel | null>(null)

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
        const updatedParcel = await response.json();
        updateParcel(updatedParcel);
        showToast(`พัสดุ ${parcelId} อัปเดตสถานะเป็น ${newStatus} แล้ว`, "success");
      } else {
        const errorData = await response.json().catch(() => ({ message: "Failed to parse error response" }));
        showToast(`ไม่สามารถอัปเดตสถานะพัสดุ ${parcelId}`, "error", { description: errorData.message || response.statusText });
      }
    } catch (error) {
      console.error("Failed to update status:", error);
      showToast(`เกิดข้อผิดพลาดในการอัปเดตสถานะพัสดุ ${parcelId}`, "error");
    } finally {
      setUpdatingStatusForId(null);
    }
  }, [updateParcel]);

  const handleEdit = useCallback((parcel: Parcel) => {
    setEditingParcel(parcel);
    setShowParcelForm(true);
  }, []);

  const handleFormSubmit = async (data: ParcelFormData) => {
    setShowParcelForm(false);
    setEditingParcel(null);
  };

  // Add delete handler
  const handleDelete = useCallback(async (parcel: Parcel) => {
    setDeletingParcel(parcel);
  }, []);

  const confirmDelete = async () => {
    if (!deletingParcel) return;

    try {
      await deleteOrder(deletingParcel.id);
      showToast("ลบพัสดุสำเร็จ", "success");
      refetch();
    } catch (error) {
      console.error("Failed to delete parcel:", error);
      showToast("ไม่สามารถลบพัสดุได้", "error");
    } finally {
      setDeletingParcel(null);
    }
  };

  // Get columns from the shared function
  const columns = useMemo<ColumnDef<Parcel>[]>(() => {
    if (!user?.role) {
      return [];
    }
    return getParcelTableColumns({
      userRole: user.role as Role,
      setSelectedParcel,
      onStatusChange: handleStatusChange,
      onEdit: handleEdit,
      onDelete: handleDelete,
      updatingStatusForId,
    });
  }, [user?.role, setSelectedParcel, handleStatusChange, handleEdit, handleDelete, updatingStatusForId]);

  const table = useReactTable({
    data: parcels,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getRowId: (row) => row.id,
    state: {
      sorting,
      rowSelection,
    },
  });

  const handleExcelImport = async (data: CreateOrderPayload[]) => {
    try {
      await createOrders(data)
      refetch()
      showToast("นำเข้าข้อมูลสำเร็จ!", "success")
    } catch (error) {
      console.error("Failed to import Excel data:", error)
      showToast("เกิดข้อผิดพลาดในการนำเข้าข้อมูล", "error")
      throw error
    }
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return null
  }

  const totalParcels = parcels.length
  // const totalRevenue = parcels.reduce((sum, p) => sum + p.estimate, 0) // Removed due to p.estimate being a date string
  const uniqueCustomers = new Set(parcels.map((p) => p.customerName)).size
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

  const handleSearch = (filters: any) => {
    // Update store filters which will trigger API call via useParcels hook
    setFilters(filters);
  };

  const handleReset = () => {
    resetFilters();
  };

  return (
    <DashboardLayout breadcrumbs={breadcrumbs} tableInstance={table}>
      <div className="space-y-5 sm:space-y-6">
        {/* Header Section */}
        <div className="stagger-item bg-white rounded-3xl p-3 shadow-soft-xl border border-gray-100/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-blue-50 rounded-2xl shadow-soft-sm">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1
                className="text-xl sm:text-heading font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1 sm:mb-2"
              >
                Plearn Tracking
              </h1>
              <p className="text-sm sm:text-subtitle text-gray-600 font-normal">
                จัดการข้อมูลพัสดุทั้งหมดในระบบ
              </p>
            </div>
          </div>
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
        </div> */}

        {/* Excel Upload Section */}
        <div className="stagger-item">
          <ExcelUpload onImport={handleExcelImport} />
        </div>

        {/* Table Section */}
        <div className="stagger-item">
          {loading ? (
            <div className="space-y-3 sm:space-y-4">
              <div className="glass-effect rounded-2xl overflow-hidden shadow-material-4">
                <ParcelTableSkeleton />
              </div>
              <ParcelPagination />
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
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
                <Button
                  onClick={() => {
                    setEditingParcel(null)
                    setShowParcelForm(true)
                  }}
                  className="ripple bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium px-4 sm:px-5 py-2 rounded-lg shadow-material-4 transition-all duration-300 hover:shadow-material-8 touch-target w-full sm:w-auto"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  <span className="text-sm">เพิ่มรายการสินค้า</span>
                </Button>
              </div>
              <div className="glass-effect rounded-2xl overflow-hidden shadow-material-4">
                <ParcelFilters
                  compact
                  onSearch={handleSearch}
                  onReset={handleReset}
                />
                <ParcelTable<Parcel> table={table} />
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
        {showParcelForm && ( // Conditionally render ParcelForm to ensure useEffect in ParcelForm re-runs correctly on open
          <ParcelForm
            open={showParcelForm}
            onClose={() => {
              setShowParcelForm(false)
              setEditingParcel(null)
            }}
            onSubmit={handleFormSubmit}
            initialData={editingParcel || undefined}
            isEditMode={!!editingParcel}
            refetch={refetch}
          />
        )}

        <AlertDialog open={!!deletingParcel} onOpenChange={(open) => !open && setDeletingParcel(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>ยืนยันการลบพัสดุ</AlertDialogTitle>
              <AlertDialogDescription>
                คุณต้องการลบพัสดุ {deletingParcel?.orderNo || deletingParcel?.id} ใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                ลบพัสดุ
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
}
