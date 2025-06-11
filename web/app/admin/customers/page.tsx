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

  const storeUpdateCustomerOptimistic = useCustomerStore((state) => state.updateCustomer);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [customerForPasswordReset, setCustomerForPasswordReset] = useState<Customer | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [isSubmitting, setIsSubmitting] = useState(false); // Local loading state for CRUD actions

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
      <div className="space-y-5 sm:space-y-6">
        <div className="stagger-item">
          <h1
            className="text-xl sm:text-heading font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1 sm:mb-2"
          >
            Customer Management
          </h1>
          <p className="text-sm sm:text-subtitle text-gray-600 font-normal">
            จัดการข้อมูลลูกค้าในระบบ
          </p>
        </div>

        <div className="stagger-item flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-lg sm:text-title font-semibold text-[#212121]">รายชื่อลูกค้า</h2>
          <Button
            onClick={handleOpenCreateModal}
            className="ripple bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium px-4 sm:px-5 py-2 rounded-lg shadow-material-4 transition-all duration-300 hover:shadow-material-8 touch-target w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            <span className="text-sm">Add New User</span>
          </Button>
        </div>

        <div className="stagger-item">
          {loading ? (
            <div className="space-y-3 sm:space-y-4">
              <div className="glass-effect rounded-2xl overflow-hidden shadow-material-4">
                <CustomerTableSkeleton />
              </div>
              <CustomerPagination />
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              <div className="glass-effect rounded-2xl overflow-hidden shadow-material-4">
                <CustomerFilters />
                <CustomerTable table={table} />
              </div>
              <CustomerPagination />
            </div>
          )}
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
      </div>
    </DashboardLayout>
  );
}
