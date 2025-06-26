"use client"

import type { Table } from "@tanstack/react-table"
import { DataTable } from "@/components/shared/data-table"

interface ParcelTableProps<TData> {
  table: Table<TData>
}

export function ParcelTable<TData>({ table }: ParcelTableProps<TData>) {
  return <DataTable table={table} />
}
