"use client"

import { useMemo } from "react"
import {
  type Table, // To type the table prop
  flexRender,
} from "@tanstack/react-table"

interface ParcelTableProps<TData> {
  table: Table<TData>
}

export function ParcelTable<TData>({ table }: ParcelTableProps<TData>) {
  const rowModel = useMemo(() => table.getRowModel(), [table]);
  const headerGroups = useMemo(() => table.getHeaderGroups(), [table]);
  const rows = rowModel.rows;
  const hasRows = rows.length > 0;

  return (
    <div className="rounded-md border bg-white">
      {hasRows ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px]">
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b bg-gray-50">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-900"
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
              {rows.map((row) => (
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
