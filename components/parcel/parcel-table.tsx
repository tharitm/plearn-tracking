"use client"

import { useMemo } from "react"
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  type ColumnDef,
  type SortingState,
  flexRender,
} from "@tanstack/react-table"
import { useState } from "react"
import { useParcelStore } from "@/stores/parcel-store"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/ui/status-badge"
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import type { Parcel } from "@/lib/types"

interface ParcelTableProps {
  showPaymentStatus?: boolean
}

export function ParcelTable({ showPaymentStatus = true }: ParcelTableProps) {
  const { parcels, setSelectedParcel } = useParcelStore()
  const [sorting, setSorting] = useState<SortingState>([])

  const getSortIcon = (isSorted: false | "asc" | "desc") => {
    if (isSorted === "asc") return <ArrowUp className="ml-2 h-4 w-4" />
    if (isSorted === "desc") return <ArrowDown className="ml-2 h-4 w-4" />
    return <ArrowUpDown className="ml-2 h-4 w-4" />
  }

  const columns = useMemo<ColumnDef<Parcel>[]>(() => {
    const baseColumns: ColumnDef<Parcel>[] = [
      {
        accessorKey: "parcelRef",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold hover:bg-transparent"
          >
            เลขที่รับพัสดุ
            {getSortIcon(column.getIsSorted())}
          </Button>
        ),
        cell: ({ row }) => (
          <Button
            variant="link"
            className="h-auto p-0 font-medium text-blue-600"
            onClick={() => setSelectedParcel(row.original)}
          >
            {row.getValue("parcelRef")}
          </Button>
        ),
      },
      {
        accessorKey: "receiveDate",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold hover:bg-transparent"
          >
            วันที่รับ
            {getSortIcon(column.getIsSorted())}
          </Button>
        ),
        cell: ({ row }) => new Date(row.getValue("receiveDate")).toLocaleDateString("th-TH"),
      },
      {
        accessorKey: "customerCode",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold hover:bg-transparent"
          >
            รหัสลูกค้า
            {getSortIcon(column.getIsSorted())}
          </Button>
        ),
      },
      {
        accessorKey: "shipment",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold hover:bg-transparent"
          >
            Shipment
            {getSortIcon(column.getIsSorted())}
          </Button>
        ),
      },
      {
        accessorKey: "estimate",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold hover:bg-transparent"
          >
            ประมาณการ
            {getSortIcon(column.getIsSorted())}
          </Button>
        ),
        cell: ({ row }) => `฿${row.getValue<number>("estimate").toLocaleString()}`,
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold hover:bg-transparent"
          >
            สถานะ
            {getSortIcon(column.getIsSorted())}
          </Button>
        ),
        cell: ({ row }) => <StatusBadge status={row.getValue("status")} type="parcel" />,
      },
      {
        accessorKey: "cnTracking",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold hover:bg-transparent"
          >
            TRACKING จีน
            {getSortIcon(column.getIsSorted())}
          </Button>
        ),
      },
      {
        accessorKey: "volume",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold hover:bg-transparent"
          >
            ปริมาณ (CBM)
            {getSortIcon(column.getIsSorted())}
          </Button>
        ),
        cell: ({ row }) => row.getValue<number>("volume").toFixed(2),
      },
      {
        accessorKey: "weight",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold hover:bg-transparent"
          >
            น้ำหนัก (KG)
            {getSortIcon(column.getIsSorted())}
          </Button>
        ),
        cell: ({ row }) => row.getValue<number>("weight").toFixed(2),
      },
      {
        accessorKey: "freight",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold hover:bg-transparent"
          >
            ค่าขนส่ง
            {getSortIcon(column.getIsSorted())}
          </Button>
        ),
        cell: ({ row }) => `฿${row.getValue<number>("freight").toLocaleString()}`,
      },
      {
        accessorKey: "deliveryMethod",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold hover:bg-transparent"
          >
            วิธีการจัดส่ง
            {getSortIcon(column.getIsSorted())}
          </Button>
        ),
        cell: ({ row }) => {
          const methodMap: Record<string, string> = {
            pickup: "รับที่โกดัง",
            delivery: "จัดส่งถึงบ้าน",
            express: "Express",
            economy: "Economy",
          }
          return methodMap[row.getValue("deliveryMethod")] || row.getValue("deliveryMethod")
        },
      },
      {
        accessorKey: "thTracking",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold hover:bg-transparent"
          >
            TRACKING ไทย
            {getSortIcon(column.getIsSorted())}
          </Button>
        ),
        cell: ({ row }) => row.getValue("thTracking") || "-",
      },
    ]

    if (showPaymentStatus) {
      baseColumns.push({
        accessorKey: "paymentStatus",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold hover:bg-transparent"
          >
            สถานะชำระเงิน
            {getSortIcon(column.getIsSorted())}
          </Button>
        ),
        cell: ({ row }) => <StatusBadge status={row.getValue("paymentStatus")} type="payment" />,
      })
    }

    return baseColumns
  }, [showPaymentStatus, setSelectedParcel])

  const table = useReactTable({
    data: parcels,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  })

  return (
    <div className="rounded-md border bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1200px]">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b bg-gray-50">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-900"
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {parcels.length === 0 && <div className="text-center py-8 text-gray-500 text-sm sm:text-base">ไม่พบข้อมูล</div>}
    </div>
  )
}
