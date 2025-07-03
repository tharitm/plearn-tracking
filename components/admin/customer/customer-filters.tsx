"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCustomers } from "@/hooks/use-customers";
import { useCustomerStore } from "@/stores/customer-store";
import { Search, X } from "lucide-react";

interface CustomerFiltersProps {
  compact?: boolean
}

export function CustomerFilters({ compact = false }: CustomerFiltersProps) {
  const filters = useCustomerStore((state) => state.filters);
  const setFilters = useCustomerStore((state) => state.setFilters);
  const storeResetFilters = useCustomerStore((state) => state.resetFilters);

  const [localSearch, setLocalSearch] = useState(filters.search || "");

  useEffect(() => {
    // Sync local state if store filters change externally
    setLocalSearch(filters.search || "");
  }, [filters]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearch(event.target.value);
  };

  const applyFilters = () => {
    const newFilters: Partial<typeof filters> = {
      search: localSearch,
    };
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    storeResetFilters(); // This resets filters in the store
    setLocalSearch("");   // Reset local state
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      applyFilters();
    }
  };

  const content = (
    <div className="flex flex-wrap gap-3 items-center">
      {/* Search Input */}
      <div className="flex-1 min-w-[240px]">
        <div className="relative">
          <Input
            placeholder="ค้นหาด้วย ชื่อ, อีเมล, รหัสลูกค้า..."
            value={localSearch}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            className="h-9 pl-10 pr-4 bg-gray-50/80 border-0 rounded-xl text-sm placeholder:text-gray-400 focus:bg-white focus:shadow-soft-md focus:ring-2 focus:ring-gray-100 transition-all duration-300"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          onClick={applyFilters}
          size="sm"
          className="h-9 px-4 bg-gray-800 hover:bg-gray-900 text-white rounded-xl shadow-soft-sm hover:shadow-soft-md transition-all duration-300 font-medium border-0"
        >
          <Search className="h-4 w-4 mr-2" />
          <span className="text-sm">ค้นหา</span>
        </Button>

        <Button
          variant="outline"
          onClick={handleResetFilters}
          size="sm"
          className="h-9 w-9 p-0 bg-gray-50/80 hover:bg-gray-100 border-0 rounded-xl shadow-soft-sm hover:shadow-soft-md transition-all duration-300"
        >
          <X className="h-4 w-4 text-gray-500" />
        </Button>
      </div>
    </div>
  )

  if (compact) {
    return (
      <div className="p-1 bg-white/50 backdrop-blur-sm ">
        {content}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-3xl shadow-soft-lg ">
      {content}
    </div>
  )
}
