import React from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, ArrowUp, ArrowDown, Loader2, FilePenLine } from "lucide-react";
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
import {
  type Role, // Import Role type
  isColumnVisible,
  isColumnEditable,
  ALL_COLUMN_IDS // Import ALL_COLUMN_IDS
} from "@/lib/column-configs"; // Import new configs

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

// Add userRole to the props
interface GetParcelTableColumnsProps {
  userRole: Role;
  setSelectedParcel: (parcel: Parcel) => void;
  onStatusChange?: (parcelId: string, newStatus: Parcel["status"]) => void;
  onEdit?: (parcel: Parcel) => void;
  updatingStatusForId?: string | null;
}

export const getParcelTableColumns = ({
  userRole,
  setSelectedParcel,
  onStatusChange,
  onEdit,
  updatingStatusForId,
}: GetParcelTableColumnsProps): ColumnDef<Parcel>[] => {
  const columns: ColumnDef<Parcel>[] = [];

  // Define all possible column configurations
  // This maps columnId to its ColumnDef generator function
  const columnDefinitions: Record<string, () => ColumnDef<Parcel>> = {
    select: () => ({
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
    }),
    parcelRef: () => ({
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
    }),
    receiveDate: () => ({
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
    }),
    customerCode: () => ({
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
    }),
    shipment: () => ({
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
    }),
    estimate: () => ({
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
    }),
    status: () => ({
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
        const parcelStatus = row.getValue<Parcel["status"]>("status");
        if (isColumnEditable(userRole, "status")) {
          const isUpdating = row.original.id === updatingStatusForId;
          return (
            <Select
              value={parcelStatus}
              onValueChange={(newStatus) => {
                if (onStatusChange) { // Ensure onStatusChange is provided
                  onStatusChange(row.original.id, newStatus as Parcel["status"]);
                }
              }}
              disabled={isUpdating || !onStatusChange}
            >
              <SelectTrigger className="w-auto border-none p-0 focus:ring-0 data-[disabled]:opacity-100 data-[disabled]:cursor-wait">
                {isUpdating ? (
                  <div className="flex items-center px-3 py-1">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </div>
                ) : (
                  <SelectValue
                    placeholder={<StatusBadge status={parcelStatus} type="parcel" />}
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
          );
        }
        return <StatusBadge status={parcelStatus} type="parcel" />;
      },
    }),
    cnTracking: () => ({
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
    }),
    volume: () => ({
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
        return "-";
      },
    }),
    weight: () => ({
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
    }),
    freight: () => ({
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
    }),
    deliveryMethod: () => ({
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
    }),
    thTracking: () => ({
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
    }),
    paymentStatus: () => ({
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
    }),
    actions: () => ({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button variant="outline" size="sm" onClick={() => {
          if (onEdit) { // Ensure onEdit is provided
            onEdit(row.original);
          }
        }}
          disabled={!onEdit} // Disable if onEdit is not provided
        >
          <FilePenLine className="mr-2 h-4 w-4" /> Edit
        </Button>
      ),
    }),
  };

  // Iterate over ALL_COLUMN_IDS to maintain a consistent order
  // or specific order defined by ALL_COLUMN_IDS
  ALL_COLUMN_IDS.forEach(columnId => {
    if (isColumnVisible(userRole, columnId) && columnDefinitions[columnId]) {
      columns.push(columnDefinitions[columnId]());
    }
  });

  return columns;
};
