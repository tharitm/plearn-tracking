"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Customer, UserRole, UserStatus, CreateCustomerPayload, UpdateCustomerPayload } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

const customerFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  customerCode: z.string().min(1, "Customer code is required"), // Usually auto-generated or non-editable in edit
  address: z.string().optional(),
  role: z.nativeEnum(UserRole),
  status: z.nativeEnum(UserStatus),
  password: z.string().min(8, "Password must be at least 8 characters").optional().or(z.literal('')), // Optional for edit
});

export type CustomerFormData = z.infer<typeof customerFormSchema>;

interface CustomerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCustomerPayload | UpdateCustomerPayload) => void;
  initialData?: Customer | null;
}

export function CustomerFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: CustomerFormModalProps) {
  const isEditMode = Boolean(initialData);

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors, isDirty, isValid },
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      customerCode: "",
      address: "",
      role: UserRole.CUSTOMER,
      status: UserStatus.ACTIVE,
      password: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (isEditMode && initialData) {
        reset({
          name: initialData.name,
          email: initialData.email,
          phone: initialData.phone,
          customerCode: initialData.customerCode,
          address: initialData.address || "",
          role: initialData.role,
          status: initialData.status,
          password: "", // Password should not be pre-filled for editing
        });
      } else {
        reset({ // Default for new customer
          name: "",
          email: "",
          phone: "",
          customerCode: "", // Consider how this is set for new customers
          address: "",
          role: UserRole.CUSTOMER,
          status: UserStatus.ACTIVE,
          password: "",
        });
      }
    }
  }, [isOpen, isEditMode, initialData, reset]);

  const handleFormSubmit = (data: CustomerFormData) => {
    const submissionData: CreateCustomerPayload | UpdateCustomerPayload = {
      ...data,
      password: data.password ? data.password : undefined,
    };
    if (!isEditMode && !data.password) {
    }
    onSubmit(submissionData);
  };

  const title = isEditMode ? "Edit Customer" : "Create New Customer";
  const description = isEditMode
    ? "Update the details of the existing customer."
    : "Fill in the form to create a new customer.";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...register("name")} />
              {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="phone">Tel</Label>
              <Input id="phone" {...register("phone")} />
              {errors.phone && <p className="text-sm text-red-600">{errors.phone.message}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="customerCode">Customer Code</Label>
              <Input id="customerCode" {...register("customerCode")} readOnly={isEditMode} />
              {errors.customerCode && <p className="text-sm text-red-600">{errors.customerCode.message}</p>}
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="address">Address</Label>
            <Textarea id="address" {...register("address")} />
            {errors.address && <p className="text-sm text-red-600">{errors.address.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="role">User Role</Label>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                      <SelectItem value={UserRole.CUSTOMER}>Customer</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.role && <p className="text-sm text-red-600">{errors.role.message}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="status" className="block mb-2">Status</Label>
              <div className="flex items-center space-x-2">
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      id="status"
                      checked={field.value === UserStatus.ACTIVE}
                      onCheckedChange={(checked) => field.onChange(checked ? UserStatus.ACTIVE : UserStatus.INACTIVE)}
                    />
                  )}
                />
                <span>{watch("status") === UserStatus.ACTIVE ? "Active" : "Inactive"}</span>
              </div>
              {errors.status && <p className="text-sm text-red-600">{errors.status.message}</p>}
            </div>
          </div>

          {!isEditMode && (
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" {...register("password")} placeholder="Required for new customer" />
              {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
            </div>
          )}

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" style={{ backgroundColor: "#5B5FEE" }} disabled={!isDirty && !isValid && isEditMode}>
              {isEditMode ? "Save Changes" : "Create Customer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
