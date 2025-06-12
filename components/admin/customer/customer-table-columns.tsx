"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Customer, UserStatus } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, KeyRound, Edit3, User, Mail, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

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
          className="h-8 px-2 hover:bg-gray-50 rounded-xl transition-all duration-200 text-gray-600 hover:text-gray-800"
        >
          <User className="mr-2 h-4 w-4" />
          <span className="text-sm font-medium">ชื่อ</span>
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="flex items-center gap-3 py-1">
        <div>
          <div className="font-medium text-gray-800 text-sm">{row.getValue("name")}</div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 hover:bg-gray-50 rounded-xl transition-all duration-200 text-gray-600 hover:text-gray-800"
        >
          <Mail className="mr-2 h-4 w-4" />
          <span className="text-sm font-medium">อีเมล</span>
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="flex items-center gap-3 py-1">
        <div className="text-sm text-gray-700 font-mono">{row.getValue("email")}</div>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-4 px-2 hover:bg-gray-50 rounded-xl transition-all duration-200 text-gray-600 hover:text-gray-800"
        >
          <Activity className="mr-2 h-2 w-2" />
          <span className="text-sm font-medium">สถานะ</span>
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.getValue("status") as UserStatus;
      const isActive = status === UserStatus.ACTIVE;

      return (
        <div className="flex items-center gap-3 py-1">
          <div className={cn(
            "w-4 h-4 rounded-full flex items-center justify-center",
            isActive ? "bg-emerald-100" : "bg-gray-100"
          )}>
            <div className={cn(
              "w-2 h-2 rounded-full",
              isActive ? "bg-emerald-500" : "bg-gray-400"
            )} />
          </div>
          <Badge
            className={cn(
              "text-xs font-medium px-3 py-1 rounded-full border-0 shadow-soft-sm",
              isActive
                ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                : "bg-gray-50 text-gray-600 hover:bg-gray-100"
            )}
          >
            {isActive ? "ใช้งานอยู่" : "ไม่ใช้งาน"}
          </Badge>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => (
      <div className="text-sm font-medium text-gray-600 px-2">การจัดการ</div>
    ),
    cell: ({ row }) => {
      const customer = row.original;

      return (
        <div className="flex items-center gap-2 py-1">
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 bg-amber-50 border-0 hover:bg-amber-100 rounded-xl shadow-soft-sm hover:shadow-soft-md transition-all duration-200"
            onClick={() => onResetPassword(customer)}
          >
            <KeyRound className="h-4 w-4 text-amber-600" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 bg-blue-50 border-0 hover:bg-blue-100 rounded-xl shadow-soft-sm hover:shadow-soft-md transition-all duration-200"
            onClick={() => onEdit(customer)}
          >
            <Edit3 className="h-4 w-4 text-blue-600" />
          </Button>
        </div>
      );
    },
  },
];