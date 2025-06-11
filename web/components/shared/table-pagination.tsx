"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { PaginationState } from "@/lib/types"

interface TablePaginationProps {
  total: number
  pagination: PaginationState
  onPageChange: (pageIndex: number) => void
  onPageSizeChange: (pageSize: number) => void
  pageSizeOptions?: number[]
  className?: string
}

export function TablePagination({
  total,
  pagination,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50],
  className,
}: TablePaginationProps) {
  const totalPages = total > 0 ? Math.ceil(total / pagination.pageSize) : 0
  if (total === 0) return null
  const currentPage = pagination.pageIndex + 1

  return (
    <div className={"flex flex-col sm:flex-row items-center justify-between gap-4 " + (className ?? "")}>
      <div className="text-sm text-gray-600">
        แสดง {pagination.pageIndex * pagination.pageSize + 1} ถึง{' '}
        {Math.min((pagination.pageIndex + 1) * pagination.pageSize, total)} จาก {total} รายการ
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm">แสดงต่อหน้า:</span>
          <Select value={pagination.pageSize.toString()} onValueChange={(val) => onPageSizeChange(Number(val))}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={size.toString()}>{size}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1 || totalPages === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <span className="text-sm">
            หน้า {currentPage} จาก {totalPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
