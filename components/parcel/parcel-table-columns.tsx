import React, { useState } from "react";
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
import { ParcelGalleryModal } from "../parcel/parcel-gallery-modal";

const statusOptions: Parcel["status"][] = [
  "pending",                     // รอส่ง
  "arrived_cn_warehouse",        // สินค้าถึงโกดังจีน
  "container_closed",            // ตู้ปิดสินค้า
  "arrived_th_warehouse",        // สินค้าถึงโกดังไทย
  "ready_to_ship_to_customer",   // เตรียมส่งลูกค้า
  "shipped_to_customer",         // ส่งแล้ว
  "delivered_to_customer",       // ส่งถึงแล้ว
  "cancelled",                   // ยกเลิก
]

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
      accessorKey: "orderNo",
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
          {row.getValue("orderNo")}
        </Button>
      ),
    }),
    // images: () => ({
    //   id: "images",
    //   header: "รูปภาพ",
    //   cell: ({ row }) => {
    //     const parcel = row.original;
    //     const [isGalleryModalOpen, setGalleryModalOpen] = useState(false);
    //     const images = parcel.images ?? [];
    //     const thumb = images.length > 0 ? images[0] : "https://placehold.co/600x400";
    //     return (
    //       <>
    //         <img
    //           src={thumb}
    //           alt="thumbnail"
    //           className="h-24 w-24 cursor-pointer rounded object-cover"
    //           onClick={() => setGalleryModalOpen(true)}
    //         />
    //         <ParcelGalleryModal
    //           images={images}
    //           open={isGalleryModalOpen}
    //           onClose={() => setGalleryModalOpen(false)}
    //         />
    //       </>
    //     );
    //   },
    //   enableSorting: false,
    // }),
    receiveDate: () => ({
      accessorKey: "orderDate",
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
      cell: ({ row }) => new Date(row.getValue("orderDate")).toLocaleDateString("th-TH"),
    }),
    customerCode: () => ({
      accessorKey: "customerName",
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
      accessorKey: "transportation",
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
      // Display estimate as a string (YYYY-MM-DD) or reformat if needed
      cell: ({ row }) => row.getValue("estimate"),
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
              <SelectTrigger className="min-w-[110px] border-none p-0 focus:ring-0 data-[disabled]:opacity-100 data-[disabled]:cursor-wait">
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
      accessorKey: "tracking",
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
      accessorKey: "cbm",
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
        const volume = row.getValue<number | undefined | null>("cbm");
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
      accessorKey: "shippingCost",
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
      cell: ({ row }) => `฿${row.getValue<number>("shippingCost")}`,
    }),
    thTracking: () => ({
      accessorKey: "trackingTh",
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
      cell: ({ row }) => row.getValue("trackingTh") || "-",
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
