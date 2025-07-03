"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Customer } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, KeyRound, Edit3, User, Mail, Phone, Hash, Calendar, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { th } from "date-fns/locale";

export type CustomerTableActions = {
  onEdit: (customer: Customer) => void;
  onResetPassword: (customer: Customer) => void;
};

export const getCustomerColumns = ({ onEdit, onResetPassword }: CustomerTableActions): ColumnDef<Customer>[] => [
  {
    id: "index",
    header: "#",
    cell: ({ row }) => (
      <div className="text-sm text-gray-500 w-10">{row.index + 1}</div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "firstName",
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
          <div className="font-medium text-gray-800 text-sm">{row.getValue("firstName")}</div>
          {row.original.nickName && row.original.nickName !== "NULL" && (
            <div className="text-xs text-gray-500">{row.original.nickName}</div>
          )}
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
        <div className="text-sm text-gray-700 font-mono">{row.getValue("email") || "-"}</div>
      </div>
    ),
  },
  {
    accessorKey: "phone",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 hover:bg-gray-50 rounded-xl transition-all duration-200 text-gray-600 hover:text-gray-800"
        >
          <Phone className="mr-2 h-4 w-4" />
          <span className="text-sm font-medium">เบอร์โทร</span>
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="flex flex-col gap-1 py-1">
        <div className="text-sm text-gray-700">{row.getValue("phone")}</div>
        {row.original.phoneSub && (
          <div className="text-xs text-gray-500">{row.original.phoneSub}</div>
        )}
      </div>
    ),
  },
  {
    accessorKey: "customerCode",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 hover:bg-gray-50 rounded-xl transition-all duration-200 text-gray-600 hover:text-gray-800"
        >
          <Hash className="mr-2 h-4 w-4" />
          <span className="text-sm font-medium">รหัสลูกค้า</span>
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="flex items-center gap-3 py-1">
        <div className="text-sm font-mono text-gray-700">{row.getValue("customerCode")}</div>
      </div>
    ),
  },
  {
    accessorKey: "address",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 hover:bg-gray-50 rounded-xl transition-all duration-200 text-gray-600 hover:text-gray-800"
        >
          <MapPin className="mr-2 h-4 w-4" />
          <span className="text-sm font-medium">ที่อยู่</span>
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="flex items-center gap-3 py-1">
        <div className="text-sm text-gray-700 line-clamp-2">{row.getValue("address") || "-"}</div>
      </div>
    ),
  },
  {
    accessorKey: "createDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 hover:bg-gray-50 rounded-xl transition-all duration-200 text-gray-600 hover:text-gray-800"
        >
          <Calendar className="mr-2 h-4 w-4" />
          <span className="text-sm font-medium">วันที่สร้าง</span>
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("createDate"));
      return (
        <div className="flex items-center gap-3 py-1">
          <div className="text-sm text-gray-700">
            {format(date, "d MMM yyyy", { locale: th })}
          </div>
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