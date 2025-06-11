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
  const { refetch } = useCustomers();
  const filters = useCustomerStore((state) => state.filters);
  const setFilters = useCustomerStore((state) => state.setFilters);
  const storeResetFilters = useCustomerStore((state) => state.resetFilters);

  // Local state to control input fields before triggering a search (debounced or on button click)
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
    <div className="flex flex-wrap gap-3 items-end">
          <div className="w-full sm:w-64 md:w-72">
            <Input
              placeholder="ค้นหา ชื่อ, อีเมล..."
              value={localSearch}
              onChange={handleSearchChange}
              className="h-10 sm:h-12 rounded-lg sm:rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200 touch-target"
              startIcon={<Search className="h-4 w-4 text-gray-400" />}
            />
          </div>
          <div className="w-full sm:w-48">
            <Select value={localStatus} onValueChange={handleStatusChange}>
              <SelectTrigger className="h-10 sm:h-12 rounded-lg sm:rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200 touch-target w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="rounded-lg sm:rounded-xl">
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value={UserStatus.ACTIVE}>Active</SelectItem>
                <SelectItem value={UserStatus.INACTIVE}>Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2 ml-auto">
            <Button
              onClick={applyFilters}
              className="ripple bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium px-4 sm:px-6 py-2 h-10 sm:h-12 rounded-lg sm:rounded-xl shadow-material-4 transition-all duration-300 hover:shadow-material-8 touch-target"
            >
              <Search className="h-4 w-4 mr-2" />
              <span className="text-sm sm:text-base">Search</span>
            </Button>
            <Button
              variant="outline"
              onClick={handleResetFilters}
              className="ripple border-gray-200 hover:bg-gray-50 font-medium px-4 h-10 sm:h-12 rounded-lg sm:rounded-xl transition-all duration-200 touch-target"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
  )

  if (compact) {
    return <div className="p-4 sm:p-6 border-b">{content}</div>
  }

  return (
    <Card className="glass-effect border-0 rounded-xl sm:rounded-2xl shadow-material-4 overflow-hidden">
      <CardContent className="p-4 sm:p-6">{content}</CardContent>
    </Card>
  )
}
