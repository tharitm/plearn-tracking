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
import { Plus, Users, UserPlus, Filter, Search } from "lucide-react";

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
      <div className="space-y-6">
        {/* Header Section with SoftUI Design */}
        <div className="bg-white rounded-3xl p-3 shadow-soft-xl border border-gray-100/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-blue-50 rounded-2xl shadow-soft-sm">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-1">
                Customer Management
              </h1>
              <p className="text-sm text-gray-500 font-medium">
                จัดการข้อมูลลูกค้าในระบบ
              </p>
            </div>
          </div>
        </div>

        {/* Actions Section */}
        <div className="bg-white rounded-3xl p-5 shadow-soft-lg border border-gray-100/50">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-gray-700">รายชื่อลูกค้า</h2>
              <div className="px-3 py-1 bg-gray-100 rounded-full">
                <span className="text-xs font-medium text-gray-600">
                  {customers.length} คน
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full lg:w-auto">
              {/* Add User Button */}
              <Button
                onClick={handleOpenCreateModal}
                size="sm"
                className="h-9 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-soft-md hover:shadow-soft-lg transition-all duration-200 font-medium"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                <span className="text-sm">เพิ่มลูกค้า</span>
              </Button>
            </div>
          </div>

          {/* Table Section */}
          <div>
            {loading ? (
              <div className="p-2">
                <CustomerTableSkeleton />
              </div>
            ) : (
              <div>
                <div className="py-4 border-b border-gray-100">
                  <CustomerFilters />
                </div>
                <CustomerTable table={table} />
              </div>
            )}
          </div>
        </div>

        {/* Pagination */}
        <div className="px-4">
          <CustomerPagination />
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