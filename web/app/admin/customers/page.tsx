"use client";

import * as React from "react";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { useCustomers } from "@/hooks/use-customers";
import type { Customer, CreateCustomerPayload, UpdateCustomerPayload } from "@/lib/types";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel, // For client-side pagination if needed, or server-side
  type SortingState,
} from "@tanstack/react-table";
import { getCustomerColumns } from "@/components/admin/customer/customer-table-columns";
import { CustomerTable } from "@/components/admin/customer/customer-table";
import { CustomerTableSkeleton } from "@/components/admin/customer/customer-table-skeleton";
import { CustomerPagination } from "@/components/admin/customer/customer-pagination";
import { CustomerFilters } from "@/components/admin/customer/customer-filters";
import { CustomerFormModal } from "@/components/admin/customer/customer-form-modal";
import { ResetPasswordModal } from "@/components/admin/customer/reset-password-modal";
import { showToast } from '@/lib/toast-utils';

export default function AdminCustomersPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  const {
    customers,
    loading,
    // error, // TODO: Handle error display, e.g., show a toast or message
    // total, // Available from useCustomers if needed directly
    // pagination, // Available from useCustomers if needed directly
    // filters, // Available from useCustomers if needed directly
    addCustomer,
    updateCustomer,
    deleteCustomer, // Although not directly used by a button on this page, it's part of the hook
    resetPassword,
    setSelectedCustomer, // Available but CustomerTable columns handle selection for actions
    // setPagination, // Handled by CustomerPagination component
    // setFilters, // Handled by CustomerFilters component
    refetchCustomers, // Available if manual refetch is needed
  } = useCustomers();

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [customerForPasswordReset, setCustomerForPasswordReset] = useState<Customer | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]); // Manage sorting state here

  // Authentication and Authorization Check
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    if (user?.role !== "admin") {
      router.push("/dashboard"); // Or a relevant non-admin page
      return;
    }
  }, [isAuthenticated, user, router]);

  // Column definitions
  const columns = useMemo(() => getCustomerColumns({
    onEdit: (customer) => {
      setEditingCustomer(customer);
      setIsFormModalOpen(true);
    },
    onResetPassword: (customer) => {
      setCustomerForPasswordReset(customer);
      setIsResetPasswordModalOpen(true);
    },
    // Add sorting state to dependencies if columns are dynamic based on it, though unlikely here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [customers]); // Depend on `customers` to ensure columns have access to fresh data for actions if needed.

  const table = useReactTable({
    data: customers,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    // Manual pagination since we fetch data page by page
    manualPagination: true,
    // If we were doing client-side pagination:
    // getPaginationRowModel: getPaginationRowModel(),
    // pageCount: Math.ceil(total / pagination.pageSize), // total and pagination from useCustomers
  });

  // Event Handlers
  const handleOpenCreateModal = () => {
    setEditingCustomer(null);
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = async (data: CreateCustomerPayload | UpdateCustomerPayload) => {
    try {
      let success = false;
      if (editingCustomer) {
        const updated = await updateCustomer(editingCustomer.id, data as UpdateCustomerPayload);
        if (updated) {
          showToast("Customer updated successfully!", "success");
          success = true;
        }
      } else {
        const created = await addCustomer(data as CreateCustomerPayload);
        if (created) {
          showToast("Customer created successfully!", "success");
          success = true;
        }
      }
      if (success) {
        setIsFormModalOpen(false);
        setEditingCustomer(null);
        // Data should refetch via useCustomers hook due to store changes
      } else {
         // Error toast is likely shown by the store/hook if add/updateCustomer handles it
         // If not, show a generic one here.
         // showToast("Operation failed.", "error");
      }
    } catch (err: any) {
      // This catch is for unexpected errors during the submission process itself
      showToast("An unexpected error occurred.", "error", { description: err.message });
    }
  };

  const handlePasswordResetConfirm = async () => {
    if (customerForPasswordReset) {
      const success = await resetPassword(customerForPasswordReset.id);
      if (success) {
        showToast(`Password reset for ${customerForPasswordReset.name} initiated.`, "success");
      } else {
        // Error toast likely shown by store/hook
        // showToast("Failed to initiate password reset.", "error");
      }
      setIsResetPasswordModalOpen(false);
      setCustomerForPasswordReset(null);
    }
  };

  // Breadcrumbs for DashboardLayout
  const breadcrumbs = [{ label: "Admin", href: "/admin" }, { label: "Customers" }];

  // Render null if not authenticated/authorized (useEffect handles redirect)
  if (!isAuthenticated || user?.role !== "admin") {
    return null;
  }

  return (
    <DashboardLayout breadcrumbs={breadcrumbs}>
      <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
        <div className="bg-card p-6 sm:p-8 rounded-xl shadow-md">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h1 className="text-2xl font-bold text-foreground mb-4 sm:mb-0">
              Customer Management
            </h1>
            <Button
              onClick={handleOpenCreateModal}
              style={{ backgroundColor: "#5B5FEE" }}
              className="text-white"
            >
              <Plus className="mr-2 h-4 w-4" /> Add New User
            </Button>
          </div>

          {/* Filters */}
          <div className="mb-6">
            <CustomerFilters />
          </div>

          {/* Table and Pagination */}
          {loading ? (
            <>
              <CustomerTableSkeleton />
              <div className="mt-4">
                {/* You might want a pagination skeleton or hide it during initial full load */}
                <CustomerPagination />
              </div>
            </>
          ) : (
            <>
              <CustomerTable table={table} />
              <CustomerPagination />
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      <CustomerFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingCustomer(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingCustomer}
      />
      <ResetPasswordModal
        isOpen={isResetPasswordModalOpen}
        onClose={() => {
          setIsResetPasswordModalOpen(false);
          setCustomerForPasswordReset(null);
        }}
        onConfirm={handlePasswordResetConfirm}
        customerName={customerForPasswordReset?.name}
      />
    </DashboardLayout>
  );
}
