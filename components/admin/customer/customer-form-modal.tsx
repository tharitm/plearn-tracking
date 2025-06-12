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

  const title = isEditMode ? "✏️ แก้ไขข้อมูลลูกค้า" : "➕ เพิ่มลูกค้าใหม่";
  const description = isEditMode
    ? "ปรับปรุงข้อมูลของลูกค้าที่มีอยู่"
    : "กรอกข้อมูลเพื่อสร้างลูกค้าใหม่";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px] soft-ui-modal">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="name">ชื่อ</Label>
              <Input id="name" {...register("name")} />
              {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="email">อีเมล</Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="phone">เบอร์โทร</Label>
              <Input id="phone" {...register("phone")} />
              {errors.phone && <p className="text-sm text-red-600">{errors.phone.message}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="customerCode">รหัสลูกค้า</Label>
              <Input id="customerCode" {...register("customerCode")} readOnly={isEditMode} />
              {errors.customerCode && <p className="text-sm text-red-600">{errors.customerCode.message}</p>}
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="address">ที่อยู่</Label>
            <Textarea id="address" {...register("address")} />
            {errors.address && <p className="text-sm text-red-600">{errors.address.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="role">บทบาทผู้ใช้</Label>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกบทบาท" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={UserRole.ADMIN}>ผู้ดูแล</SelectItem>
                      <SelectItem value={UserRole.CUSTOMER}>ลูกค้า</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.role && <p className="text-sm text-red-600">{errors.role.message}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="status" className="block mb-2">สถานะ</Label>
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
                <span>{watch("status") === UserStatus.ACTIVE ? "ใช้งาน" : "ไม่ใช้งาน"}</span>
              </div>
              {errors.status && <p className="text-sm text-red-600">{errors.status.message}</p>}
            </div>
          </div>

          {!isEditMode && (
            <div className="space-y-1">
              <Label htmlFor="password">รหัสผ่าน</Label>
              <Input id="password" type="password" {...register("password")} placeholder="จำเป็นสำหรับลูกค้าใหม่" />
              {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
            </div>
          )}

          <div className="flex justify-between pt-2">
            <DialogClose asChild>
              <Button type="button" variant="outline" className="hover:scale-105 transition-transform">
                ยกเลิก ×
              </Button>
            </DialogClose>
            <Button type="submit" className="hover:scale-105 transition-transform" style={{ backgroundColor: "#5B5FEE" }} disabled={!isDirty && !isValid && isEditMode}>
              ยืนยัน 💾
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
