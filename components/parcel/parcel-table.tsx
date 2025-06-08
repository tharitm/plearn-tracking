"use client"

import { useMemo } from "react"
import {
  getCoreRowModel,
  getSortedRowModel,
  type ColumnDef, // Will be passed from parent
  type Table, // To type the table prop
  flexRender,
} from "@tanstack/react-table"
// import { useState } from "react" // sorting state will be managed by parent
import { useParcelStore } from "@/stores/parcel-store" // Still needed for setSelectedParcel
import { Button } from "@/components/ui/button"
// import { StatusBadge } from "@/components/ui/status-badge" // Will be part of columns definition
// import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react" // Will be part of columns definition
import type { Parcel } from "@/lib/types" // Still needed for setSelectedParcel if that stays

interface ParcelTableProps<TData> {
  // showPaymentStatus?: boolean // This will be handled by the columns definition passed in
  table: Table<TData> // Expect table instance as a prop
  // parcels: Parcel[] // Expect data to be fed into the table instance by parent
}

// Note: ParcelTable is now generic TData to align with Table<TData>
export function ParcelTable<TData>({ table }: ParcelTableProps<TData>) {
  // const { parcels, setSelectedParcel } = useParcelStore() // parcels come from table instance, setSelectedParcel might stay or be lifted
  const { setSelectedParcel } = useParcelStore() // Keep for now

  // const [sorting, setSorting] = useState<SortingState>([]) // Managed by parent

  // const getSortIcon = (isSorted: false | "asc" | "desc") => { ... } // Moved to parent

  // const columns = useMemo<ColumnDef<Parcel>[]>(() => { ... }, [showPaymentStatus, setSelectedParcel]) // Moved to parent

  // const table = useReactTable({ ... }) // Instance is now passed as a prop

  // Check if there are rows to display, otherwise show "No data" message
  const hasRows = table.getRowModel().rows && table.getRowModel().rows.length > 0

  return (
    <div className="rounded-md border bg-white">
      {hasRows ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px]">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b bg-gray-50">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-900"
                      style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-b hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-3 sm:px-4 py-3 text-xs sm:text-sm">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 text-sm sm:text-base">
          ไม่พบข้อมูล
        </div>
      )}
    </div>
  )
}
