"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/stores/auth-store"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ParcelFilters } from "@/components/parcel/parcel-filters"
import { ParcelTable } from "@/components/parcel/parcel-table"
import { ParcelPagination } from "@/components/parcel/parcel-pagination"
import { ParcelDetailModal } from "@/components/parcel/parcel-detail-modal"
import { ParcelForm } from "@/components/admin/parcel-form"
import { ExcelUpload } from "@/components/admin/excel-upload"
import { StatCard } from "@/components/ui/stat-card"
import { useParcels } from "@/hooks/use-parcels"
import { Button } from "@/components/ui/button"
import { Plus, Package, DollarSign, Users, TrendingUp } from "lucide-react"
import type { Parcel } from "@/lib/types"

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuthStore()
  const router = useRouter()
  const { loading, refetch, parcels } = useParcels()
  const [showParcelForm, setShowParcelForm] = useState(false)

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

  const handleAddParcel = async (data: any) => {
    try {
      const response = await fetch("/api/admin/parcel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        refetch()
        alert("เพิ่มรายการสินค้าสำเร็จ!")
      }
    } catch (error) {
      console.error("Failed to add parcel:", error)
      alert("เกิดข้อผิดพลาดในการเพิ่มรายการสินค้า")
    }
  }

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

  // Calculate stats
  const totalParcels = parcels.length
  const totalRevenue = parcels.reduce((sum, p) => sum + p.estimate, 0)
  const uniqueCustomers = new Set(parcels.map((p) => p.customerCode)).size
  const pendingParcels = parcels.filter((p) => p.status === "pending").length

  const breadcrumbs = [{ label: "Admin Dashboard" }]

  return (
    <DashboardLayout breadcrumbs={breadcrumbs}>
      <div className="space-y-6 sm:space-y-8">
        {/* Header Section */}
        <div className="stagger-item">
          <h1 className="text-xl sm:text-heading font-bold text-[#212121] mb-1 sm:mb-2">Admin Dashboard</h1>
          <p className="text-sm sm:text-subtitle text-gray-600 font-normal">จัดการข้อมูลพัสดุทั้งหมดในระบบ</p>
        </div>

        {/* Stats Grid - Mobile responsive */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <StatCard title="พัสดุทั้งหมด" value={totalParcels} subtitle="รายการ" icon={<Package />} variant="blue" />
          <StatCard
            title="รายได้รวม"
            value={`฿${totalRevenue.toLocaleString()}`}
            subtitle="บาท"
            icon={<DollarSign />}
            variant="pink"
          />
          <StatCard title="ลูกค้า" value={uniqueCustomers} subtitle="คน" icon={<Users />} variant="cyan" />
          <StatCard title="รอดำเนินการ" value={pendingParcels} subtitle="รายการ" icon={<TrendingUp />} variant="green" />
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
          <h2 className="text-lg sm:text-title font-semibold text-[#212121]">รายการพัสดุในคลัง</h2>
          <Button
            onClick={() => setShowParcelForm(true)}
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
              <p className="text-sm sm:text-subtitle text-gray-600 font-medium">กำลังโหลดข้อมูล...</p>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              <div className="glass-effect rounded-2xl overflow-hidden shadow-material-4">
                <ParcelTable showPaymentStatus={false} />
              </div>
              <ParcelPagination />
            </div>
          )}
        </div>

        <ParcelDetailModal />
        <ParcelForm open={showParcelForm} onClose={() => setShowParcelForm(false)} onSubmit={handleAddParcel} />
      </div>
    </DashboardLayout>
  )
}
