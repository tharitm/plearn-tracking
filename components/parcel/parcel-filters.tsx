"use client"

import { useState } from "react"
import { useParcelStore } from "@/stores/parcel-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Search, RotateCcw } from "lucide-react"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import type { DateRange } from "react-day-picker"
import { ParcelStatus } from "@/lib/types"
import { StatusBadge } from "@/components/ui/status-badge"
import { useAuthStore } from "@/stores/auth-store"

interface ParcelFiltersProps {
  compact?: boolean;
  onSearch: (filters: any) => void; // Callback for search
  onReset: () => void; // Callback for reset
}

export function ParcelFilters({ compact = false, onSearch, onReset }: ParcelFiltersProps) {
  const { user } = useAuthStore()
  const isAdmin = user?.role === 'admin'
  const { filters } = useParcelStore()
  const [localFilters, setLocalFilters] = useState(filters)

  // Initialize date range from filters
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    if (filters.dateFrom && filters.dateTo) {
      return {
        from: new Date(filters.dateFrom),
        to: new Date(filters.dateTo),
      }
    }
    return undefined
  })

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range)
    if (range?.from) {
      const fromDate = range.from.toISOString().split("T")[0]
      const toDate = range.to ? range.to.toISOString().split("T")[0] : fromDate
      setLocalFilters({
        ...localFilters,
        dateFrom: fromDate,
        dateTo: toDate,
      })
    } else {
      setLocalFilters({
        ...localFilters,
        dateFrom: "",
        dateTo: "",
      })
    }
  }

  const handleSearch = () => {
    // Prepare API filters based on role
    const apiFilters = {
      ...localFilters,
      // For admin, search in multiple fields
      ...(isAdmin ? {
        customerName: localFilters.search, // Search in customer name
        trackingNo: localFilters.search,   // and tracking number
      } : {
        // For customer, search only in tracking number
        trackingNo: localFilters.search
      }),
      search: undefined // Remove search as it's not in API spec
    }
    onSearch(apiFilters)
  }

  const handleResetLocal = () => {
    const resetFilters = {
      dateFrom: "",
      dateTo: "",
      trackingNo: "",
      status: "",
      paymentStatus: "",
      search: "",
    }
    setLocalFilters(resetFilters)
    setDateRange(undefined)
    onReset()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const content = (
    <div className="flex flex-wrap gap-3 items-end">
      {/* Search Input - Reduced width */}
      <div className="w-full sm:w-64 md:w-72">
        <Input
          placeholder={isAdmin ? "ค้นหาด้วย รหัสลูกค้า, เลขพัสดุ..." : "ค้นหาเลขพัสดุ..."}
          value={localFilters.search || ""}
          onChange={(e) => setLocalFilters({ ...localFilters, search: e.target.value })}
          onKeyDown={handleKeyDown}
          className="h-10 sm:h-12 rounded-lg sm:rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200 touch-target"
          startIcon={<Search className="h-4 w-4 text-gray-400" />}
        />
      </div>

      {/* Date Range Picker */}
      <div className="w-full sm:w-64 md:w-72">
        <DateRangePicker dateRange={dateRange} onDateRangeChange={handleDateRangeChange} />
      </div>

      {/* Status Filter */}
      <div className="w-full sm:w-48">
        <Select
          value={localFilters.status || "all"}
          onValueChange={(value) => setLocalFilters({ ...localFilters, status: value === "all" ? "" : value })}
        >
          <SelectTrigger className="h-10 sm:h-12 rounded-lg sm:rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200 touch-target">
            <SelectValue placeholder="สถานะ" />
          </SelectTrigger>
          <SelectContent className="rounded-lg sm:rounded-xl">
            <SelectItem value="all">
              <div className="text-gray-600">ทั้งหมด</div>
            </SelectItem>
            {Object.values(ParcelStatus).map((status) => (
              <SelectItem key={status} value={status}>
                <StatusBadge status={status} type="parcel" />
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Payment Status Filter */}
      <div className="w-full sm:w-48">
        <Select
          value={localFilters.paymentStatus || "all"}
          onValueChange={(value) =>
            setLocalFilters({ ...localFilters, paymentStatus: value === "all" ? "" : value })
          }
        >
          <SelectTrigger className="h-10 sm:h-12 rounded-lg sm:rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200 touch-target">
            <SelectValue placeholder="สถานะการชำระเงิน" />
          </SelectTrigger>
          <SelectContent className="rounded-lg sm:rounded-xl">
            <SelectItem value="all">
              <div className="text-gray-600">ทั้งหมด</div>
            </SelectItem>
            <SelectItem value="unpaid">
              <StatusBadge status="unpaid" type="payment" />
            </SelectItem>
            <SelectItem value="paid">
              <StatusBadge status="paid" type="payment" />
            </SelectItem>
            <SelectItem value="partial">
              <StatusBadge status="partial" type="payment" />
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 ml-auto">
        <Button
          onClick={handleSearch}
          className="ripple bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium px-4 sm:px-6 py-2 h-10 sm:h-12 rounded-lg sm:rounded-xl shadow-material-4 transition-all duration-300 hover:shadow-material-8 touch-target"
        >
          <Search className="h-4 w-4 mr-2" />
          <span className="text-sm sm:text-base">ค้นหา</span>
        </Button>
        <Button
          variant="outline"
          onClick={handleResetLocal}
          className="ripple border-gray-200 hover:bg-gray-50 font-medium px-4 h-10 sm:h-12 rounded-lg sm:rounded-xl transition-all duration-200 touch-target"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )

  if (compact) {
    return <div className="p-4 sm:p-6 border-b">{content}</div>
  }

  return (
    <Card className="glass-effect border-0 rounded-xl sm:rounded-2xl shadow-material-4 overflow-hidden">
      <CardContent className="p-4 sm:p-6">{content}</CardContent>
    </Card>
  )
}
