"use client"

import { type Table } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface ParcelPaginationProps<TData> {
  table: Table<TData>
  totalItems: number
}

export function ParcelPagination<TData>({ table, totalItems }: ParcelPaginationProps<TData>) {
  const { pageIndex, pageSize } = table.getState().pagination
  const totalPages = table.getPageCount()
  const currentPage = pageIndex + 1

  // Calculate the range of items being shown
  const firstItem = pageIndex * pageSize + 1
  // For the last item, consider if it's the last page and totalItems
  const lastItemOnPage = (pageIndex + 1) * pageSize
  const lastItem = Math.min(lastItemOnPage, totalItems)

  // If totalItems is 0 and table might not have data (e.g. initial load),
  // or if table has no rows after filtering but totalItems might still be from a previous state.
  // Prefer totalItems for the "No data" check if it's reliable.
  if (totalItems === 0) {
    // Optionally, could check table.getRowModel().rows.length === 0 as well,
    // but totalItems should be the source of truth for whether *any* data exists globally.
    return null
  }


  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
      <div className="text-sm text-gray-600">
        แสดง {firstItem} ถึง {lastItem} จาก {totalItems} รายการ
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm">แสดงต่อหน้า:</span>
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
            }}
          >
            <SelectTrigger className="w-20">
              <SelectValue placeholder={pageSize} />
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
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <span className="text-sm">
            หน้า {currentPage} จาก {totalPages > 0 ? totalPages : 1}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
