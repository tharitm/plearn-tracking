"use client"

import { Badge } from "@/components/ui/badge"
import { Package, Truck, CheckCircle, XCircle, Clock, CreditCard, AlertCircle, Warehouse } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  status: string | null
  type: "parcel" | "payment"
  className?: string
}

export function StatusBadge({ status, type, className }: StatusBadgeProps) {
  if (type === "parcel") {
    const statusConfig = {
      "": {
        label: "ไม่มีสถานะ",
        icon: Package,
        className: "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200",
      },
      arrived_cn_warehouse: {
        label: "ถึงโกดังจีน",
        icon: Package,
        className: "bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200",
      },
      container_closed: {
        label: "ปิดตู้แล้ว",
        icon: AlertCircle,
        className: "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200",
      },
      ready_to_ship_to_customer: {
        label: "สินค้าอยู่ระหว่างเดินทางมาไทย",
        icon: Truck,
        className: "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200",
      },
      arrived_th_warehouse: {
        label: "ถึงโกดังไทย",
        icon: Package,
        className: "bg-indigo-100 text-indigo-800 border-indigo-200 hover:bg-indigo-200",
      },
      shipped_to_customer: {
        label: "ลูกค้าเข้ารับสินค้าเรียบร้อย",
        icon: Truck,
        className: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200",
      },
      delivered_to_customer: {
        label: "จัดส่งสินค้าเรียบร้อย",
        icon: CheckCircle,
        className: "bg-green-100 text-green-800 border-green-200 hover:bg-green-200",
      },
      warehouse_pending: {
        label: "สินค้าค้างโกดัง",
        icon: Warehouse,
        className: "bg-red-100 text-red-800 border-red-200 hover:bg-red-200",
      },
    }

    const config = status ? (statusConfig[status as keyof typeof statusConfig] || {
      label: status,
      icon: Package,
      className: "bg-gray-100 text-gray-800 border-gray-200",
    }) : {
      label: "ไม่มีสถานะ",
      icon: Package,
      className: "bg-gray-100 text-gray-800 border-gray-200",
    }

    const Icon = config.icon

    return (
      <Badge variant="outline" className={cn("flex items-center gap-1.5 px-2.5 py-1", config.className, className)}>
        <Icon className="h-3.5 w-3.5" />
        <span className="font-medium">{config.label}</span>
      </Badge>
    )
  }

  if (type === "payment") {
    const statusConfig = {
      unpaid: {
        label: "ยังไม่ชำระ",
        icon: AlertCircle,
        className: "bg-red-100 text-red-800 border-red-200 hover:bg-red-200",
      },
      paid: {
        label: "ชำระแล้ว",
        icon: CheckCircle,
        className: "bg-green-100 text-green-800 border-green-200 hover:bg-green-200",
      },
      partial: {
        label: "ชำระบางส่วน",
        icon: CreditCard,
        className: "bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200",
      },
    }

    const config = status ? (statusConfig[status as keyof typeof statusConfig] || {
      label: status,
      icon: CreditCard,
      className: "bg-gray-100 text-gray-800 border-gray-200",
    }) : {
      label: "ไม่มีสถานะ",
      icon: CreditCard,
      className: "bg-gray-100 text-gray-800 border-gray-200",
    }

    const Icon = config.icon

    return (
      <Badge variant="outline" className={cn("flex items-center gap-1.5 px-2.5 py-1", config.className, className)}>
        <Icon className="h-3.5 w-3.5" />
        <span className="font-medium">{config.label}</span>
      </Badge>
    )
  }

  return null
}
