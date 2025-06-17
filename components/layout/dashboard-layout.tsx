"use client"

import React from "react"

import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "./app-sidebar"
import { UserMenu } from "./user-menu"
import { ColumnVisibilityDropdown } from "@/components/ui/ColumnVisibilityDropdown" // Import the new component
import { type Table } from "@tanstack/react-table" // To type the tableInstance prop
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

interface DashboardLayoutProps<TData> {
  children: React.ReactNode
  breadcrumbs?: Array<{ label: string; href?: string }>
  tableInstance?: Table<TData>
}

export function DashboardLayout<TData>({
  children,
  breadcrumbs = [],
  tableInstance,
}: DashboardLayoutProps<TData>) {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset className="flex flex-col min-h-screen w-full min-w-0">
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md flex h-14 lg:h-16 shrink-0 items-center gap-2 border-b border-white/20 px-4 lg:px-6 shadow-sm">
          <SidebarTrigger className="-ml-1 ripple rounded-lg p-2 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 touch-target" />
          <Separator orientation="vertical" className="mr-2 h-4 bg-gray-300/50" />

          {breadcrumbs.length > 0 && (
            <Breadcrumb className="hidden sm:flex">
              <BreadcrumbList>
                {breadcrumbs.map((breadcrumb, index) => (
                  <React.Fragment key={index}>
                    <BreadcrumbItem className={index === 0 ? "hidden md:block" : ""}>
                      {breadcrumb.href ? (
                        <BreadcrumbLink
                          href={breadcrumb.href}
                          className="text-sm lg:text-base font-medium text-[#212121] hover:text-blue-600 transition-colors duration-200"
                        >
                          {breadcrumb.label}
                        </BreadcrumbLink>
                      ) : (
                        <BreadcrumbPage className="text-sm lg:text-base font-medium text-[#212121]">
                          {breadcrumb.label}
                        </BreadcrumbPage>
                      )}
                    </BreadcrumbItem>
                    {index < breadcrumbs.length - 1 && <BreadcrumbSeparator className="hidden md:block" />}
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          )}

          <div className="ml-auto flex items-center gap-2">
            <UserMenu />
          </div>
        </header>

        <main className="flex-1 flex flex-col gap-4 lg:gap-6 p-4 lg:p-6 bg-gradient-to-br from-gray-50/80 to-blue-50/30 min-h-0 overflow-auto">
          <div className="w-full max-w-full">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}