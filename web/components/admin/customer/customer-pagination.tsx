"use client";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCustomers } from "@/hooks/use-customers"; // Using the hook

export function CustomerPagination() {
  const { total, pagination, setPagination } = useCustomers();

  const totalPages = total > 0 ? Math.ceil(total / pagination.pageSize) : 0;
  if (total === 0 && totalPages === 0) return null; // Don't render if no items and no pages

  const currentPage = pagination.pageIndex + 1;

  const handlePageChange = (newPageIndex: number) => {
    // Ensure newPageIndex is within valid bounds
    if (newPageIndex >= 0 && newPageIndex < totalPages) {
      setPagination({ pageIndex: newPageIndex });
    }
  };

  const handlePageSizeChange = (newPageSize: string) => {
    setPagination({ pageIndex: 0, pageSize: Number.parseInt(newPageSize) });
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 px-2">
      <div className="text-sm text-muted-foreground">
        Showing {pagination.pageIndex * pagination.pageSize + 1} to{" "}
        {Math.min((pagination.pageIndex + 1) * pagination.pageSize, total)} of {total} customers
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${pagination.pageSize}`}
            onValueChange={(value) => {
              handlePageSizeChange(value);
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-center text-sm font-medium">
          Page {currentPage} of {totalPages === 0 ? 1 : totalPages}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => handlePageChange(pagination.pageIndex - 1)}
            disabled={pagination.pageIndex === 0 || totalPages === 0}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => handlePageChange(pagination.pageIndex + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
