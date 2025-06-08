import React from "react"; // For JSX in getSortIcon
import { type ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import type { Parcel } from "@/lib/types";

// Helper for sort icons
export const getSortIcon = (isSorted: false | "asc" | "desc") => {
  if (isSorted === "asc") return <ArrowUp className="ml-2 h-4 w-4" />;
  if (isSorted === "desc") return <ArrowDown className="ml-2 h-4 w-4" />;
  return <ArrowUpDown className="ml-2 h-4 w-4" />;
};

interface GetParcelTableColumnsProps {
  setSelectedParcel: (parcel: Parcel) => void;
}

// Function to generate parcel column definitions
export const getParcelTableColumns = ({
  setSelectedParcel,
}: GetParcelTableColumnsProps): ColumnDef<Parcel>[] => {
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
        };
        return methodMap[row.getValue("deliveryMethod")] || row.getValue("deliveryMethod");
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
  ];
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
  });
  return baseColumns;
};
