import React from "react";
import { Table } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./dropdown-menu"; // Assuming this is the correct path
import { Button } from "./button"; // Assuming this is the correct path

interface ColumnVisibilityDropdownProps<TData> {
  table: Table<TData>;
  localStorageKey?: string; // Optional key for localStorage
}

export function ColumnVisibilityDropdown<TData>({
  table,
  localStorageKey = "columnVisibility", // Default localStorage key
}: ColumnVisibilityDropdownProps<TData>) {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  React.useEffect(() => {
    if (isMounted && typeof window !== "undefined" && localStorageKey) {
      const storedVisibility = localStorage.getItem(localStorageKey);
      if (storedVisibility) {
        try {
          const visibilityState = JSON.parse(storedVisibility) as Record<
            string,
            boolean
          >;
          table.setColumnVisibility(visibilityState);
        } catch (error) {
          console.error("Error parsing column visibility from localStorage:", error);
        }
      }
    }
  }, [isMounted, table, localStorageKey]);

  React.useEffect(() => {
    if (isMounted && typeof window !== "undefined" && localStorageKey) {
      const columnVisibility = table.getState().columnVisibility;
      localStorage.setItem(localStorageKey, JSON.stringify(columnVisibility));
    }
  }, [isMounted, table.getState().columnVisibility, localStorageKey, table]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="ml-auto">
          Columns
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {table
          .getAllLeafColumns()
          .filter(
            (column) =>
              typeof column.accessorFn !== "undefined" && column.getCanHide()
          )
          .map((column) => {
            // Prefer header, fallback to id
            const columnHeader =
              typeof column.columnDef.header === "string"
                ? column.columnDef.header
                : column.id;
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) =>
                  column.toggleVisibility(!!value)
                }
              >
                {columnHeader}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
