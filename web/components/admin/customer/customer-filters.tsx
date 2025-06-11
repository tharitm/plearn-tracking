"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCustomers } from "@/hooks/use-customers";
import { useCustomerStore } from "@/stores/customer-store";
import { UserStatus } from "@/lib/types"; // Assuming UserStatus is defined here
import { Search, X } from "lucide-react";

export function CustomerFilters() {
  // useCustomers is still invoked so its effect will refetch when filters change
  const { refetchCustomers } = useCustomers();
  const { filters, setFilters, resetFilters: storeResetFilters } = useCustomerStore();

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
    // refetchCustomers will be called by the useEffect in useCustomers due to filters changing
    // Or, explicitly call it: refetchCustomers(newFilters);
  };

  const handleResetFilters = () => {
    storeResetFilters(); // This resets filters in the store
    setLocalSearch("");   // Reset local state
    setLocalStatus("all"); // Reset local state
    // The useEffect in useCustomers will trigger a refetch due to filter change in store
  };


  return (
    <div className="flex flex-col sm:flex-row gap-2 mb-4 p-4 border rounded-lg bg-card">
      <Input
        placeholder="ค้นหา ชื่อ, อีเมล..."
        value={localSearch}
        onChange={handleSearchChange}
        className="max-w-xs"
        startIcon={<Search className="text-muted-foreground" />}
      />
      <Select value={localStatus} onValueChange={handleStatusChange}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value={UserStatus.ACTIVE}>Active</SelectItem>
          <SelectItem value={UserStatus.INACTIVE}>Inactive</SelectItem>
        </SelectContent>
      </Select>
      <Button onClick={applyFilters} variant="secondary">
        <Search className="mr-2 h-4 w-4" /> Search
      </Button>
      <Button onClick={handleResetFilters} variant="outline">
        <X className="mr-2 h-4 w-4" /> Reset
      </Button>
    </div>
  );
}
