"use client"

import { useParcelStore } from "@/stores/parcel-store"
import { TablePagination } from "@/components/shared/table-pagination"

export function ParcelPagination() {
  const { total = 0, pagination, setPagination } = useParcelStore()

  return (
    <TablePagination
      total={total}
      pagination={pagination}
      onPageChange={(page) => setPagination({ pageIndex: page - 1 })}
      onPageSizeChange={(size) => setPagination({ pageIndex: 0, pageSize: size })}
    />
  )
}
