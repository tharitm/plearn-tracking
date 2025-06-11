"use client"

import { flexRender, Table as TanStackTable } from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

interface DataTableProps<TData> {
  table: TanStackTable<TData>
  noDataMessage?: React.ReactNode
  className?: string
  compact?: boolean
}

export function DataTable<TData>({ table, noDataMessage, className, compact = false }: DataTableProps<TData>) {
  const hasRows = table.getRowModel().rows.length > 0

  return (
    <div className="rounded-md  bg-white">
      <Table
        className={cn(
          className ?? "min-w-[1200px]",
          "divide-y-0 [&_th]:border-0 [&_td]:border-0",
          compact &&
          "[&_th]:h-10 [&_th]:px-3 [&_td]:px-3 [&_td]:py-2 text-sm"
        )}
      >
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="bg-gray-50">
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {hasRows ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
                {noDataMessage ?? "ไม่พบข้อมูล"}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
