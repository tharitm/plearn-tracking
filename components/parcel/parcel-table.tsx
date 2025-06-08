"use client"

import { useMemo, useEffect } from "react"
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  type ColumnDef,
  type SortingState,
  flexRender,
  type RowSelectionState,
  type VisibilityState,
} from "@tanstack/react-table"
import { useState, useEffect as useReactEffect } from "react" // Renamed to avoid conflict
import { useParcelStore } from "@/stores/parcel-store"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { StatusBadge } from "@/components/ui/status-badge"
import { ArrowUpDown, ArrowUp, ArrowDown, MoreHorizontalIcon, PencilIcon } from "lucide-react"
import type { Parcel } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

interface ParcelTableProps {
  showPaymentStatus?: boolean
  onSelectionChange?: (selectedRows: Parcel[]) => void
  refetchParcels?: () => void;
}

export function ParcelTable({ showPaymentStatus = true, onSelectionChange, refetchParcels }: ParcelTableProps) {
  const { parcels, setSelectedParcel } = useParcelStore()
  const { toast } = useToast()
  const [sorting, setSorting] = useState<SortingState>([])
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [updatingRow, setUpdatingRow] = useState<string | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingParcel, setEditingParcel] = useState<Parcel | null>(null);
  const [editFormData, setEditFormData] = useState({ customerCode: "", weight: "", volume: "" });

  const parcelStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];

  const handleStatusUpdate = async (parcelId: string, newStatus: string) => {
    setUpdatingRow(parcelId);
    try {
      const response = await fetch(`/api/admin/parcel/${parcelId}/update-status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const responseData = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: `Parcel ${parcelId} status updated to ${newStatus}.`,
        });
        if (refetchParcels) {
          refetchParcels();
        }
      } else {
        toast({
          title: "Error",
          description: `Failed to update status: ${responseData.message || "Unknown error"}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `An unexpected error occurred: ${(error as Error).message}`,
        variant: "destructive",
      });
    } finally {
      setUpdatingRow(null);
    }
  };

  // Load column visibility from localStorage on mount
  useReactEffect(() => {
    const savedVisibility = localStorage.getItem("parcelTableColumnVisibility")
    if (savedVisibility) {
      try {
        const parsedVisibility = JSON.parse(savedVisibility)
        setColumnVisibility(parsedVisibility)
      } catch (error) {
        console.error("Error parsing column visibility from localStorage:", error)
      }
    }
  }, [])

  // Save column visibility to localStorage when it changes
  useReactEffect(() => {
    if (Object.keys(columnVisibility).length > 0) {
      localStorage.setItem("parcelTableColumnVisibility", JSON.stringify(columnVisibility))
    }
  }, [columnVisibility])

  // Populate form when editingParcel changes
  useReactEffect(() => {
    if (editingParcel) {
      setEditFormData({
        customerCode: editingParcel.customerCode,
        weight: String(editingParcel.weight),
        volume: String(editingParcel.volume),
      });
    }
  }, [editingParcel]);

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    if (!editingParcel) return;

    const { id: parcelId } = editingParcel;
    const updatePayload = {
      customerCode: editFormData.customerCode,
      weight: parseFloat(editFormData.weight),
      volume: parseFloat(editFormData.volume),
    };

    // Basic validation
    if (isNaN(updatePayload.weight) || isNaN(updatePayload.volume)) {
      toast({
        title: "Invalid Input",
        description: "Weight and Volume must be valid numbers.",
        variant: "destructive",
      });
      return;
    }

    console.log("Saving changes for parcel:", parcelId, updatePayload);
    // TODO: Implement API call to update parcel details, e.g., PATCH /api/admin/parcel/${parcelId}

    // Simulate API call success for now
    toast({
      title: "Changes Saved (Simulated)",
      description: `Details for parcel ${parcelId} updated.`,
    });

    setIsEditDialogOpen(false);
    if (refetchParcels) {
      refetchParcels();
    }
  };

  const handleEditClick = (parcel: Parcel) => {
    setEditingParcel(parcel);
    setIsEditDialogOpen(true);
  };

  const getSortIcon = (isSorted: false | "asc" | "desc") => {
    if (isSorted === "asc") return <ArrowUp className="ml-2 h-4 w-4" />
    if (isSorted === "desc") return <ArrowDown className="ml-2 h-4 w-4" />
    return <ArrowUpDown className="ml-2 h-4 w-4" />
  }

  const columns = useMemo<ColumnDef<Parcel>[]>(() => {
    const baseColumns: ColumnDef<Parcel>[] = [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllRowsSelected() || (table.getIsSomeRowsSelected() && "indeterminate")}
            onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
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
        meta: { columnName: "ประมาณการ" },
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
          const parcel = row.original
          const isLoading = updatingRow === parcel.id;

          return (
            <Select
              value={parcel.status}
              onValueChange={newStatus => handleStatusUpdate(parcel.id, newStatus)}
              disabled={isLoading}
            >
              <SelectTrigger className="w-[150px]">
                {isLoading ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div> : null}
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {parcelStatuses.map(status => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )
        },
        meta: { columnName: "สถานะ" },
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
          }
          return methodMap[row.getValue("deliveryMethod")] || row.getValue("deliveryMethod")
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
    ]

    if (showPaymentStatus) {
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
      })
    }

    return baseColumns
  }, [showPaymentStatus, setSelectedParcel, updatingRow]) // Added updatingRow dependency for cell re-render

  // Add actions column
  const actionColumn: ColumnDef<Parcel> = {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleEditClick(row.original)}
        >
          <PencilIcon className="h-4 w-4 mr-2" /> Edit
        </Button>
      )
    },
  }

  const table = useReactTable({
    data: parcels,
    columns: [...columns, actionColumn], // Appended actionColumn here
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    enableHiding: true,
    state: {
      sorting,
      rowSelection,
      columnVisibility,
    },
  })

  useReactEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(table.getSelectedRowModel().flatRows.map(row => row.original))
    }
  }, [rowSelection, onSelectionChange, table])

  // Helper to get a string representation for column headers
  const getColumnHeaderString = (column: any) => {
    if (typeof column.columnDef.header === 'string') {
      return column.columnDef.header;
    }
    // For complex headers (like those with sort buttons), use column.id or a meta field
    // For this implementation, we'll prefer a meta field if available, otherwise id.
    return column.columnDef.meta?.columnName || column.id;
  };

  return (
    <div>
      <div className="flex items-center py-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              <MoreHorizontalIcon className="mr-2 h-4 w-4" /> Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {table
              .getAllLeafColumns()
              .filter(column => column.getCanHide() && column.id !== 'select') // Exclude select column
              .map(column => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={value => column.toggleVisibility(!!value)}
                  >
                    {getColumnHeaderString(column)}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px]">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b bg-gray-50">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-900"
                    >
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-b hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-3 sm:px-4 py-3 text-xs sm:text-sm">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {parcels.length === 0 && <div className="text-center py-8 text-gray-500 text-sm sm:text-base">ไม่พบข้อมูล</div>}
      </div>

      {editingParcel && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Parcel: {editingParcel.parcelRef}</DialogTitle>
              <DialogDescription>
                Make changes to the parcel details below. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <form id="parcel-edit-form" onSubmit={(e) => { e.preventDefault(); handleSaveChanges(); }}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="customerCode" className="text-right">
                    รหัสลูกค้า
                  </Label>
                  <Input
                    id="customerCode"
                    name="customerCode"
                    value={editFormData.customerCode}
                    onChange={handleEditFormChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="weight" className="text-right">
                    น้ำหนัก (KG)
                  </Label>
                  <Input
                    id="weight"
                    name="weight"
                    type="number"
                    value={editFormData.weight}
                    onChange={handleEditFormChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="volume" className="text-right">
                    ปริมาณ (CBM)
                  </Label>
                  <Input
                    id="volume"
                    name="volume"
                    type="number"
                    value={editFormData.volume}
                    onChange={handleEditFormChange}
                    className="col-span-3"
                  />
                </div>
              </div>
            </form>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" form="parcel-edit-form">Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
