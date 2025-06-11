"use client";

import type { Table as TanstackTable } from "@tanstack/react-table";
import { DataTable } from "@/components/shared/data-table";

interface DataTableProps<TData> {
  table: TanstackTable<TData>;
}

export function CustomerTable<TData>({ table }: DataTableProps<TData>) {
  return <DataTable table={table} noDataMessage="No customers found." />;
}
