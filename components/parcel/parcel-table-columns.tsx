import React from "react"; // For JSX in getSortIcon
import { type ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, ArrowUp, ArrowDown, Loader2, FilePenLine } from "lucide-react"; // Import FilePenLine
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/ui/status-badge";
import type { Parcel } from "@/lib/types";

const statusOptions: Parcel["status"][] = [
  "pending",
  "shipped",
  "delivered",
  "cancelled",
];

export const getSortIcon = (isSorted: false | "asc" | "desc") => {
  if (isSorted === "asc") return <ArrowUp className="ml-2 h-4 w-4" />;
  if (isSorted === "desc") return <ArrowDown className="ml-2 h-4 w-4" />;
  return <ArrowUpDown className="ml-2 h-4 w-4" />;
};

interface GetParcelTableColumnsProps {
  setSelectedParcel: (parcel: Parcel) => void;
  onStatusChange?: (parcelId: string, newStatus: Parcel["status"]) => void;
  onEdit?: (parcel: Parcel) => void;
  updatingStatusForId?: string | null; // Add new optional prop
}

// Function to generate parcel column definitions
export const getParcelTableColumns = ({
  setSelectedParcel,
  onStatusChange,
  onEdit,
  updatingStatusForId, // Destructure new prop
}: GetParcelTableColumnsProps): ColumnDef<Parcel>[] => {
  const baseColumns: ColumnDef<Parcel>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          disabled={!row.getCanSelect()}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
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
      cell: ({ row }) => {
        const isUpdating = row.original.id === updatingStatusForId;
        return (
          <Select
            value={row.getValue("status")}
            onValueChange={(newStatus) =>
              onStatusChange!(row.original.id, newStatus as Parcel["status"])
            }
            disabled={isUpdating} // Disable Select when updating
          >
            <SelectTrigger className="w-auto border-none p-0 focus:ring-0 data-[disabled]:opacity-100 data-[disabled]:cursor-wait">
              {isUpdating ? (
                <div className="flex items-center px-3 py-1"> {/* Adjusted padding */}
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </div>
              ) : (
                <SelectValue
                  placeholder={<StatusBadge status={row.getValue("status")} type="parcel" />}
                />
              )}
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map(statusOption => (
                <SelectItem key={statusOption} value={statusOption}>
                  <StatusBadge status={statusOption} type="parcel" />
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      }
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
      cell: ({ row }) => {
        const volume = row.getValue<number | undefined | null>("volume");
        if (typeof volume === "number" && !isNaN(volume)) {
          return volume.toFixed(2);
        }
        return "-"; // Or "N/A"
      },
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
        return methodMap[row.getValue("deliveryMethod") as string];
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
  baseColumns.push({
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <Button variant="outline" size="sm" onClick={() => onEdit!(row.original)}>
        <FilePenLine className="mr-2 h-4 w-4" /> Edit
      </Button>
    ),
  });
  return baseColumns;
};
