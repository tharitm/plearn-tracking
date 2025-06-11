"use client";

import * as React from "react";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { useCustomerStore } from "@/stores/customer-store"; // Import the store
import { useCustomers } from "@/hooks/use-customers";
import * as customerService from "@/services/customerService"; // Import the service
import type { Customer, CreateCustomerPayload, UpdateCustomerPayload, CustomerQuery } from "@/lib/types";

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
  console.log('==== Admin User Management Page ====')
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  const {
    customers,
    loading,
  } = useCustomers();

  const storeSetFilters = useCustomerStore((state) => state.setFilters);
  const storeUpdateCustomerOptimistic = useCustomerStore((state) => state.updateCustomer);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [customerForPasswordReset, setCustomerForPasswordReset] = useState<Customer | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [isSubmitting, setIsSubmitting] = useState(false); // Local loading state for CRUD actions


  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    if (user?.role !== "admin") {
      router.push("/dashboard");
      return;
    }
  }, [isAuthenticated, user, router]);

  const columns = useMemo(() => getCustomerColumns({
    onEdit: (customer) => {
      setEditingCustomer(customer);
      setIsFormModalOpen(true);
    },
    onResetPassword: (customer) => {
      setCustomerForPasswordReset(customer);
      setIsResetPasswordModalOpen(true);
    },
  }), [customers]);

  const table = useReactTable({
    data: customers,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
  });

  const handleOpenCreateModal = () => {
    setEditingCustomer(null);
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = async (data: CreateCustomerPayload | UpdateCustomerPayload) => {
    setIsSubmitting(true);
    try {
      if (editingCustomer) {
        const updatedCustomer = await customerService.updateCustomer(editingCustomer.id, data as UpdateCustomerPayload);
        if (updatedCustomer) {
          storeUpdateCustomerOptimistic(updatedCustomer); // Optimistic update in store
          showToast("Customer updated successfully!", "success");
          setIsFormModalOpen(false);
          setEditingCustomer(null);
        }
      } else {
        const newCustomer = await customerService.addCustomer(data as CreateCustomerPayload);
        if (newCustomer) {
          showToast("Customer created successfully!", "success");
          setIsFormModalOpen(false);
        }
      }
    } catch (err: any) {
      console.error("Form submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordResetConfirm = async () => {
    if (customerForPasswordReset) {
      setIsSubmitting(true);
      try {
        await customerService.resetPassword(customerForPasswordReset.id);
        showToast(`Password reset for ${customerForPasswordReset.name} initiated.`, "success");
      } catch (err: any) {
        console.error("Password reset error:", err);
      } finally {
        setIsSubmitting(false);
        setIsResetPasswordModalOpen(false);
        setCustomerForPasswordReset(null);
      }
    }
  };

  const breadcrumbs = [{ label: "Admin", href: "/admin" }, { label: "Customers" }];

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
            {/* <CustomerFilters /> */}
          </div>

          {/* Table and Pagination */}
          {loading ? (
            <>
              <CustomerTableSkeleton />
            </>
          ) : (
            <>
              <CustomerTable table={table} />
              <div className="mt-4">
                <CustomerPagination />
              </div>
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
