"use client"

import type React from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ReactNode
  variant: "blue" | "pink" | "cyan" | "green"
  className?: string
}

export function StatCard({ title, value, subtitle, icon, variant, className }: StatCardProps) {
  const gradientClasses = {
    blue: "gradient-card-blue",
    pink: "gradient-card-pink",
    cyan: "gradient-card-cyan",
    green: "gradient-card-green",
  }

  const textGradientClasses = {
    blue: "gradient-text-blue",
    pink: "gradient-text-pink",
    cyan: "gradient-text-cyan",
    green: "gradient-text-green",
  }

  return (
    <Card
      className={cn(
        "glass-effect hover-lift ripple stagger-item",
        "rounded-xl border-0 p-3 lg:p-4 min-h-[100px] lg:min-h-[120px]",
        "transition-all duration-300 hover:shadow-lg",
        gradientClasses[variant],
        className,
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 lg:pb-3 bg-white/30 rounded-lg -m-1 mb-2 p-2 lg:p-3">
        <h3 className="text-xs lg:text-sm font-medium text-[#212121] tracking-tight leading-tight line-clamp-2">
          {title}
        </h3>
        <div className="h-6 w-6 lg:h-8 lg:w-8 flex items-center justify-center flex-shrink-0">
          <div className="h-4 w-4 lg:h-5 lg:w-5 text-gray-600">{icon}</div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 p-1 lg:p-0">
        <div className={cn("text-xl lg:text-2xl font-bold tracking-tight mb-1", textGradientClasses[variant])}>
          {typeof value === "number" ? value.toLocaleString() : value}
        </div>
        {subtitle && <p className="text-xs lg:text-sm text-gray-500 font-normal">{subtitle}</p>}
      </CardContent>
    </Card>
  )
}
