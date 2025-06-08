"use client"

import type * as React from "react"
import { useAuthStore } from "@/stores/auth-store"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Package, LayoutDashboard, Users, FileText, Settings, BarChart3, Truck, Archive } from "lucide-react"

const customerMenuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "ติดตามพัสดุ",
    url: "/dashboard/tracking",
    icon: Package,
  },
  {
    title: "ประวัติการสั่งซื้อ",
    url: "/dashboard/orders",
    icon: FileText,
  },
]

const adminMenuItems = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "จัดการพัสดุ",
    url: "/admin/parcels",
    icon: Package,
  },
  {
    title: "จัดการลูกค้า",
    url: "/admin/customers",
    icon: Users,
  },
  {
    title: "รายงาน",
    url: "/admin/reports",
    icon: BarChart3,
  },
  {
    title: "การขนส่ง",
    url: "/admin/shipping",
    icon: Truck,
  },
  {
    title: "คลังสินค้า",
    url: "/admin/warehouse",
    icon: Archive,
  },
]

const settingsItems = [
  {
    title: "ตั้งค่าระบบ",
    url: "/settings",
    icon: Settings,
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuthStore()
  const pathname = usePathname()

  const menuItems = user?.role === "admin" ? adminMenuItems : customerMenuItems

  return (
    <Sidebar
      {...props}
      className="border-r bg-white/95 backdrop-blur-md shadow-lg"
      style={{
        background: "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)",
      }}
    >
      <SidebarHeader className="p-4 sm:p-6 border-b border-white/80 bg-gradient-to-r from-blue-50/80 to-purple-50/80">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
            <Package className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
          </div>
          <div>
            <h1 className="text-base sm:text-title font-bold text-[#212121]">Parcel System</h1>
            <p className="text-xs sm:text-caption text-gray-500 font-normal">
              {user?.role === "admin" ? "Admin Panel" : "Customer Portal"}
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-3 sm:p-4 bg-white">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm sm:text-body font-semibold text-[#212121] mb-2 sm:mb-3">
            เมนูหลัก
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 sm:space-y-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    className="ripple h-10 sm:h-12 rounded-xl font-medium transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 data-[active=true]:bg-gradient-to-r data-[active=true]:from-blue-600 data-[active=true]:to-purple-600 data-[active=true]:text-white data-[active=true]:shadow-lg touch-target"
                  >
                    <a href={item.url} className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4">
                      <item.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="text-sm sm:text-body">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-6 sm:mt-8">
          <SidebarGroupLabel className="text-sm sm:text-body font-semibold text-[#212121] mb-2 sm:mb-3">
            ตั้งค่า
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 sm:space-y-2">
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    className="ripple h-10 sm:h-12 rounded-xl font-medium transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 data-[active=true]:bg-gradient-to-r data-[active=true]:from-blue-600 data-[active=true]:to-purple-600 data-[active=true]:text-white data-[active=true]:shadow-lg touch-target"
                  >
                    <a href={item.url} className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4">
                      <item.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="text-sm sm:text-body">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}