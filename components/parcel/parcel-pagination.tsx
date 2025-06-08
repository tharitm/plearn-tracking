"use client"

import { type Table } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useParcelStore } from "@/stores/parcel-store"


export function ParcelPagination() {
  const { total, pagination, setPagination } = useParcelStore()

  const totalPages = Math.ceil(total / pagination.pageSize)
  const currentPage = pagination.pageIndex + 1

  const handlePageChange = (newPage: number) => {
    setPagination({ pageIndex: newPage - 1 })
  }

  const handlePageSizeChange = (newPageSize: string) => {
    setPagination({ pageIndex: 0, pageSize: Number.parseInt(newPageSize) })
  }

  if (total === 0) return null


  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
      <div className="text-sm text-gray-600">
        แสดง {pagination.pageIndex * pagination.pageSize + 1} ถึง{" "}
        {Math.min((pagination.pageIndex + 1) * pagination.pageSize, total)} จาก {total} รายการ
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm">แสดงต่อหน้า:</span>
          <Select value={pagination.pageSize.toString()} onValueChange={handlePageSizeChange}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 50].map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <span className="text-sm">
            หน้า {currentPage} จาก {totalPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
