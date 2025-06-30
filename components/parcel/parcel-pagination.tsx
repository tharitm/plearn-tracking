"use client"

import { useParcelStore } from "@/stores/parcel-store"
import { TablePagination } from "@/components/shared/table-pagination"

export function ParcelPagination() {
  const { total = 0, pagination, setPagination } = useParcelStore()

  return (
    <TablePagination
      total={total}
      pagination={pagination}
      onPageChange={(pageIndex) => setPagination({ pageIndex })}
      onPageSizeChange={(size) => setPagination({ pageIndex: 0, pageSize: size })}
    />
  )
}
