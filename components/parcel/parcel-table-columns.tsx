import React, { useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, ArrowUp, ArrowDown, Loader2, FilePenLine, Trash2 } from "lucide-react";
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
import { useParcelStore } from "@/stores/parcel-store";

const statusOptions: Parcel["status"][] = [
  "arrived_cn_warehouse",        // สินค้าถึงโกดังจีน
  "container_closed",            // ปิดตู้แล้ว
  "ready_to_ship_to_customer",   // เตรียมส่งลูกค้า
  "arrived_th_warehouse",        // ถึงโกดังไทย
  "shipped_to_customer",         // ส่งแล้ว
  "delivered_to_customer",       // ส่งถึงแล้ว
  "warehouse_pending",           // สินค้าค้างโกดัง
]

export const getSortIcon = (isSorted: false | "asc" | "desc") => {
  if (isSorted === "asc") return <ArrowUp className="ml-2 h-4 w-4" />;
  if (isSorted === "desc") return <ArrowDown className="ml-2 h-4 w-4" />;
  return <ArrowUpDown className="ml-2 h-4 w-4" />;
};

// Add onDelete to the props
interface GetParcelTableColumnsProps {
  userRole: Role;
  setSelectedParcel: (parcel: Parcel) => void;
  onStatusChange?: (parcelId: string, newStatus: Parcel["status"]) => void;
  onEdit?: (parcel: Parcel) => void;
  onDelete?: (parcel: Parcel) => void;
  updatingStatusForId?: string | null;
}

export const getParcelTableColumns = ({
  userRole,
  setSelectedParcel,
  onStatusChange,
  onEdit,
  onDelete,
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
    images: () => ({
      id: "images",
      header: "รูปภาพ",
      cell: ({ row }) => {
        const parcel = row.original;
        const images = parcel.images ?? [];
        const thumb = images.length > 0 ? images[0] : "https://www.themgroup.co.uk/wp-content/uploads/2020/12/landscape-placeholder-e1608289113759.png";
        const setGalleryImages = useParcelStore(state => state.setGalleryImages);

        return (
          <div className="relative w-16 aspect-square">
            <img
              src={thumb}
              alt="thumbnail"
              className="absolute inset-0 w-full h-full object-cover rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
              onClick={() => setGalleryImages(images)}
            />
          </div>
        );
      },
      enableSorting: false,
    }),
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
      cell: ({ row }) => {
        const value = row.getValue<string | null>("orderDate")
        if (!value) return "-"
        return <div className="min-w-[110px]">{new Date(value).toISOString().split('T')[0]}</div>
      },
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
    cabinetCode: () => ({
      accessorKey: "cabinetCode",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold hover:bg-transparent"
        >
          รหัสตู้
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
      cell: ({ row }) => {
        const value = row.getValue<string | null>("estimate")
        if (!value) return "-"
        return <div className="min-w-[110px]">{new Date(value).toISOString().split('T')[0]}</div>
      },
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
              value={parcelStatus || ""}
              onValueChange={(newStatus) => {
                if (onStatusChange) {
                  onStatusChange(row.original.id, newStatus as Parcel["status"]);
                }
              }}
              disabled={isUpdating || !onStatusChange}
            >
              <SelectTrigger className="min-w-[180px] border-none p-0 focus:ring-0 data-[disabled]:opacity-100 data-[disabled]:cursor-wait">
                {isUpdating ? (
                  <div className="flex items-center px-3 py-1">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </div>
                ) : (
                  <SelectValue placeholder={<div className="text-gray-500">กรุณาเลือกสถานะ</div>} />
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
        return (
          <div className={userRole === "customer" ? "min-w-[120px]" : "min-w-[180px]"}>
            <StatusBadge status={parcelStatus} type="parcel" />
          </div>
        );
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
    description: () => ({
      accessorKey: "description",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold hover:bg-transparent"
        >
          รายละเอียด
          {getSortIcon(column.getIsSorted())}
        </Button>
      ),
      cell: ({ row }) => row.getValue("description") || "-",
    }),
    pack: () => ({
      accessorKey: "pack",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold hover:bg-transparent"
        >
          Pack
          {getSortIcon(column.getIsSorted())}
        </Button>
      ),
      cell: ({ row }) => row.getValue("pack") || "-",
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
      cell: ({ row }) => {
        const value = row.getValue<number | null>("weight")
        return value != null ? value.toFixed(2) : "-"
      },
    }),
    length: () => ({
      accessorKey: "length",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold hover:bg-transparent"
        >
          ความยาว (CM)
          {getSortIcon(column.getIsSorted())}
        </Button>
      ),
      cell: ({ row }) => row.getValue("length") || "-",
    }),
    width: () => ({
      accessorKey: "width",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold hover:bg-transparent"
        >
          ความกว้าง (CM)
          {getSortIcon(column.getIsSorted())}
        </Button>
      ),
      cell: ({ row }) => row.getValue("width") || "-",
    }),
    height: () => ({
      accessorKey: "height",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold hover:bg-transparent"
        >
          ความสูง (CM)
          {getSortIcon(column.getIsSorted())}
        </Button>
      ),
      cell: ({ row }) => row.getValue("height") || "-",
    }),
    volume: () => ({
      accessorKey: "cbm",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold hover:bg-transparent"
        >
          ปริมาตร (CBM)
          {getSortIcon(column.getIsSorted())}
        </Button>
      ),
      cell: ({ row }) => {
        const volume = row.getValue<number | undefined | null>("cbm");
        if (typeof volume === "number" && !isNaN(volume)) {
          return volume.toFixed(4); // Changed from 2 to 4 decimal places
        }
        return "-";
      },
    }),
    shippingRate: () => ({
      accessorKey: "shippingRates",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold hover:bg-transparent"
        >
          เรทค่าขนส่ง
          {getSortIcon(column.getIsSorted())}
        </Button>
      ),
      cell: ({ row }) => {
        const value = row.getValue<number | null>("shippingRates")
        return value != null ? `฿${value.toLocaleString()}` : "-"
      },
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
      cell: ({ row }) => {
        const value = row.getValue<number | null>("shippingCost")
        return value != null ? `฿${value.toLocaleString()}` : "-"
      },
    }),
    // thTracking: () => ({
    //   accessorKey: "trackingTh",
    //   header: ({ column }) => (
    //     <Button
    //       variant="ghost"
    //       onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //       className="h-auto p-0 font-semibold hover:bg-transparent"
    //     >
    //       TRACKING ไทย
    //       {getSortIcon(column.getIsSorted())}
    //     </Button>
    //   ),
    //   cell: ({ row }) => row.getValue("trackingTh") || "-",
    // }),
    // paymentStatus: () => ({
    //   accessorKey: "paymentStatus",
    //   header: ({ column }) => (
    //     <Button
    //       variant="ghost"
    //       onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //       className="h-auto p-0 font-semibold hover:bg-transparent"
    //     >
    //       สถานะชำระเงิน
    //       {getSortIcon(column.getIsSorted())}
    //     </Button>
    //   ),
    //   cell: ({ row }) => <StatusBadge status={row.getValue("paymentStatus")} type="payment" />,
    // }),
    actions: () => ({
      id: "actions",
      header: "จัดการ",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (onEdit) {
                onEdit(row.original);
              }
            }}
            disabled={!onEdit}
          >
            <FilePenLine className="mr-2 h-4 w-4" /> Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              if (onDelete) {
                onDelete(row.original);
              }
            }}
            disabled={!onDelete}
          >
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </Button>
        </div>
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

  // Ensure columns are in the correct order
  const columnOrder = [
    "select",
    "parcelRef",
    "images",
    "receiveDate",
    "customerCode",
    "shipment",
    "cabinetCode", // Add cabinetCode after shipment
    "estimate",
    "status",
    "cnTracking",
    "length",
    "width",
    "height",
    "volume",
    "weight",
    "shippingRate",
    "freight",
    "deliveryMethod",
    "thTracking",
    "paymentStatus",
    "actions",
  ];

  return columns;
};
