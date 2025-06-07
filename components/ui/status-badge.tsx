"use client"

import { Badge } from "@/components/ui/badge"
import { Package, Truck, CheckCircle, XCircle, Clock, CreditCard, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  status: string
  type: "parcel" | "payment"
  className?: string
}

export function StatusBadge({ status, type, className }: StatusBadgeProps) {
  if (type === "parcel") {
    const statusConfig = {
      pending: {
        label: "รอส่ง",
        icon: Clock,
        className: "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200",
      },
      shipped: {
        label: "ส่งแล้ว",
        icon: Truck,
        className: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200",
      },
      delivered: {
        label: "ส่งถึงแล้ว",
        icon: CheckCircle,
        className: "bg-green-100 text-green-800 border-green-200 hover:bg-green-200",
      },
      cancelled: {
        label: "ยกเลิก",
        icon: XCircle,
        className: "bg-red-100 text-red-800 border-red-200 hover:bg-red-200",
      },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || {
      label: status,
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

    const config = statusConfig[status as keyof typeof statusConfig] || {
      label: status,
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
