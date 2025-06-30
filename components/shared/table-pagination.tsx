"use client"

import { ChevronsLeft, ChevronsRight, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { PaginationState } from "@/lib/types"
import { cn } from "@/lib/utils"

interface TablePaginationProps {
  total: number
  pagination: PaginationState
  onPageChange: (pageIndex: number) => void
  onPageSizeChange: (pageSize: number) => void
  pageSizeOptions?: number[]
  className?: string
  maxPageButtons?: number
}

export function TablePagination({
  total,
  pagination,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50],
  className,
  maxPageButtons = 5,
}: TablePaginationProps) {
  const totalPages = total > 0 ? Math.ceil(total / pagination.pageSize) : 0
  if (total === 0) return null
  const currentPage = pagination.pageIndex + 1

  // Calculate the range of page numbers to show
  const getPageRange = () => {
    const range: number[] = []
    const halfMaxButtons = Math.floor(maxPageButtons / 2)
    let start = Math.max(1, currentPage - halfMaxButtons)
    let end = Math.min(totalPages, start + maxPageButtons - 1)

    // Adjust start if we're near the end
    if (end - start + 1 < maxPageButtons) {
      start = Math.max(1, end - maxPageButtons + 1)
    }

    for (let i = start; i <= end; i++) {
      range.push(i)
    }

    return range
  }

  const pageRange = getPageRange()

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

        <div className="flex items-center space-x-1">
          {/* First Page */}
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => onPageChange(0)}
            disabled={pagination.pageIndex === 0 || totalPages === 0}
            title="หน้าแรก"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>

          {/* Previous Page */}
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => onPageChange(pagination.pageIndex - 1)}
            disabled={pagination.pageIndex === 0 || totalPages === 0}
            title="หน้าก่อนหน้า"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Page Numbers */}
          <div className="flex items-center space-x-1">
            {pageRange[0] > 1 && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 px-0"
                  onClick={() => onPageChange(0)}
                >
                  1
                </Button>
                {pageRange[0] > 2 && (
                  <span className="px-1 text-gray-500">...</span>
                )}
              </>
            )}

            {pageRange.map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                className={cn(
                  "h-8 w-8 px-0",
                  currentPage === page && "bg-blue-500 text-white hover:bg-blue-600"
                )}
                onClick={() => onPageChange(page - 1)}
              >
                {page}
              </Button>
            ))}

            {pageRange[pageRange.length - 1] < totalPages && (
              <>
                {pageRange[pageRange.length - 1] < totalPages - 1 && (
                  <span className="px-1 text-gray-500">...</span>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 px-0"
                  onClick={() => onPageChange(totalPages - 1)}
                >
                  {totalPages}
                </Button>
              </>
            )}
          </div>

          {/* Next Page */}
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => onPageChange(pagination.pageIndex + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            title="หน้าถัดไป"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Last Page */}
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => onPageChange(totalPages - 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            title="หน้าสุดท้าย"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
