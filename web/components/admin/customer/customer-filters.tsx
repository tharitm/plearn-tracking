"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCustomers } from "@/hooks/use-customers";
import { useCustomerStore } from "@/stores/customer-store";
import { UserStatus } from "@/lib/types"; // Assuming UserStatus is defined here
import { Search, X } from "lucide-react";

interface CustomerFiltersProps {
  compact?: boolean
}

export function CustomerFilters({ compact = false }: CustomerFiltersProps) {
  const filters = useCustomerStore((state) => state.filters);
  const setFilters = useCustomerStore((state) => state.setFilters);
  const storeResetFilters = useCustomerStore((state) => state.resetFilters);

  const [localSearch, setLocalSearch] = useState(filters.name || filters.email || "");
  const [localStatus, setLocalStatus] = useState<UserStatus | "all">(filters.status || "all");

  useEffect(() => {
    // Sync local state if store filters change externally
    setLocalSearch(filters.name || filters.email || "");
    setLocalStatus(filters.status || "all");
  }, [filters]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearch(event.target.value);
  };

  const handleStatusChange = (value: string) => {
    setLocalStatus(value as UserStatus | "all");
  };

  const applyFilters = () => {
    const newFilters: Partial<typeof filters> = {
      name: localSearch, // Assuming backend handles combined search on name/email with 'name' param
      email: undefined, // Or you can have separate name and email filters
      status: localStatus === "all" ? undefined : localStatus,
    };
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    storeResetFilters(); // This resets filters in the store
    setLocalSearch("");   // Reset local state
    setLocalStatus("all"); // Reset local state
    // The useEffect in useCustomers will trigger a refetch due to filter change in store
  };


  const content = (
    <div className="flex flex-wrap gap-3 items-center">
      {/* Search Input */}
      <div className="w-full sm:w-64 md:w-72">
        <div className="relative">
          <Input
            placeholder="ค้นหา ชื่อ, อีเมล..."
            value={localSearch}
            onChange={handleSearchChange}
            className="h-9 pl-10 pr-4 bg-gray-50/80 border-0 rounded-xl text-sm placeholder:text-gray-400 focus:bg-white focus:shadow-soft-md focus:ring-2 focus:ring-blue-100 transition-all duration-300"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
      </div>

      {/* Status Select */}
      <div className="w-full sm:w-48">
        <Select value={localStatus} onValueChange={handleStatusChange}>
          <SelectTrigger className="h-9 bg-gray-50/80 border-0 rounded-md text-sm focus:bg-white focus:shadow-soft-md focus:ring-2 focus:ring-blue-100 transition-all duration-300">
            <SelectValue placeholder="สถานะทั้งหมด" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-0 shadow-soft-lg bg-white/95 backdrop-blur-sm">
            <SelectItem value="all" className="rounded-xl focus:bg-gray-50">
              สถานะทั้งหมด
            </SelectItem>
            <SelectItem value={UserStatus.ACTIVE} className="rounded-xl focus:bg-green-50">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                ใช้งานอยู่
              </div>
            </SelectItem>
            <SelectItem value={UserStatus.INACTIVE} className="rounded-xl focus:bg-red-50">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                ไม่ใช้งาน
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 ml-auto">
        <Button
          onClick={applyFilters}
          size="sm"
          className="h-9 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-soft-sm hover:shadow-soft-md transition-all duration-300 font-medium border-0"
        >
          <Search className="h-4 w-4 mr-2" />
          <span className="text-sm">ค้นหา</span>
        </Button>

        <Button
          variant="outline"
          onClick={handleResetFilters}
          size="sm"
          className="h-9 px-3 bg-gray-50/80 hover:bg-gray-100 border-0 rounded-2xl shadow-soft-sm hover:shadow-soft-md transition-all duration-300"
        >
          <X className="h-4 w-4 text-gray-500" />
        </Button>
      </div>
    </div>
  )

  if (compact) {
    return (
      <div className="p-4 bg-white/50 backdrop-blur-sm border-b border-gray-100/50">
        {content}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-3xl shadow-soft-lg borderoverflow-hidden">
      {content}
    </div>
  )
}
