"use client";

import { useCustomerStore } from "@/stores/customer-store";
import { TablePagination } from "@/components/shared/table-pagination";

export function CustomerPagination() {
  const { total, pagination, setPagination } = useCustomerStore();

  return (
    <TablePagination
      total={total}
      pagination={pagination}
      onPageChange={(pageIndex) => setPagination({ pageIndex })}
      onPageSizeChange={(size) => setPagination({ pageIndex: 0, pageSize: size })}
      pageSizeOptions={[10, 20, 30, 40, 50]}
      className="px-2"
    />
  );
}
