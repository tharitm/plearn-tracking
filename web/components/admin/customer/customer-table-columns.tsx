"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Customer, UserStatus } from "@/lib/types"; // Assuming Customer and UserStatus are in types.ts
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

// Define a type for the props if you need to pass callbacks for actions
export type CustomerTableActions = {
  onEdit: (customer: Customer) => void;
  onResetPassword: (customer: Customer) => void;
};

export const getCustomerColumns = ({ onEdit, onResetPassword }: CustomerTableActions): ColumnDef<Customer>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.getValue("status") as UserStatus;
      let badgeVariant: "default" | "secondary" | "destructive" | "outline" = "default";
      let statusText = "Unknown";

      if (status === UserStatus.ACTIVE) {
        badgeVariant = "default"; // Typically green, default is often blue/purple
        statusText = "Active";
        // For a green badge, you might need a custom variant or inline style
        // Example: <Badge className="bg-green-500 text-white hover:bg-green-600">Active</Badge>
      } else if (status === UserStatus.INACTIVE) {
        badgeVariant = "secondary"; // Typically gray
        statusText = "Inactive";
      }

      // Placeholder for custom badge colors if needed:
      // Active: "bg-green-100 text-green-800 border-green-200"
      // Inactive: "bg-gray-100 text-gray-800 border-gray-200"
      // Active: uses #10B981 (success color)
      // Inactive: uses a gray color
      return (
        <Badge variant={badgeVariant} className={cn(
          "text-xs font-semibold", // Common badge styling
          status === UserStatus.ACTIVE
            ? "bg-[#10B981] hover:bg-[#0F9A6D] text-white border-transparent" // Success color
            : "bg-gray-200 hover:bg-gray-300 text-gray-800 border-transparent" // Gray for inactive
        )}>
          {statusText}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const customer = row.original;

      return (
        <div className="flex space-x-2">
          <Button
            variant="outline" // Changed to outline for less emphasis than destructive
            size="sm"
            className="border-yellow-500 text-yellow-700 hover:bg-yellow-50 hover:text-yellow-800" // Warning style
            onClick={() => onResetPassword(customer)}
          >
            Reset Password
          </Button>
          <Button
            variant="link"
            size="sm"
            onClick={() => onEdit(customer)}
          >
            Edit
          </Button>
        </div>
      );
    },
  },
];
