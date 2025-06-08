"use client"

import {
  type Table, // To type the table prop
  flexRender,
} from "@tanstack/react-table"
import { useParcelStore } from "@/stores/parcel-store"

interface ParcelTableProps<TData> {
  table: Table<TData>
}

export function ParcelTable<TData>({ table }: ParcelTableProps<TData>) {
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
