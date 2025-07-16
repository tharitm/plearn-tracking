"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Customer, UserRole, UserStatus, CreateCustomerPayload, UpdateCustomerPayload } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

// Base schema for shared fields
const baseCustomerSchema = z.object({
  email: z.string().email("อีเมลไม่ถูกต้อง").or(z.literal("")).optional().nullable(),
  firstName: z.string().min(1, "ชื่อจำเป็นต้องกรอก"),
  nickName: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  phoneSub: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  cardNumber: z.string().optional().nullable(),
  picture: z.string().optional().nullable(),
  strPassword: z.string().optional().nullable(),
  textPrice: z.string().optional().nullable(),
  priceEk: z.union([
    z.number(),
    z.string().transform((val) => val === "" ? 0 : Number(val))
  ]).optional().default(0),
  priceSea: z.union([
    z.number(),
    z.string().transform((val) => val === "" ? 0 : Number(val))
  ]).optional().default(0),
  customerCode: z.string().length(4, "รหัสลูกค้าต้องมี 4 ตัวอักษร").optional().nullable(),
});

// Create schema adds required password
const createCustomerSchema = baseCustomerSchema.extend({
  password: z.string().min(4, "รหัสผ่านต้องมีอย่างน้อย 4 ตัวอักษร"),
});

// Edit schema is just the base schema
const editCustomerSchema = baseCustomerSchema;

export type CustomerFormData = z.infer<typeof createCustomerSchema>;

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
    formState: { errors, isDirty, isValid },
    getValues,
  } = useForm<CustomerFormData>({
    resolver: zodResolver(isEditMode ? editCustomerSchema : createCustomerSchema),
    defaultValues: {
      email: null,
      password: "",
      firstName: "",
      nickName: null,
      phone: null,
      phoneSub: null,
      customerCode: null,
      address: null,
      cardNumber: null,
      picture: null,
      strPassword: null,
      textPrice: null,
      priceEk: 0,
      priceSea: 0,
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (isOpen) {
      if (isEditMode && initialData) {
        reset({
          firstName: initialData.firstName,
          nickName: initialData.nickName,
          email: initialData.email,
          phone: initialData.phone,
          phoneSub: initialData.phoneSub,
          customerCode: initialData.customerCode,
          address: initialData.address,
          cardNumber: initialData.cardNumber,
          picture: initialData.picture,
          priceEk: initialData.priceEk || 0,
          priceSea: initialData.priceSea || 0,
          textPrice: initialData.textPrice,
        }, {
          keepDefaultValues: true,
        });
      } else {
        reset({
          firstName: "",
          nickName: null,
          email: null,
          password: "",
          phone: null,
          phoneSub: null,
          customerCode: null,
          address: null,
          cardNumber: null,
          picture: null,
          strPassword: null,
          textPrice: null,
          priceEk: 0,
          priceSea: 0,
        });
      }
    }
  }, [isOpen, isEditMode, initialData, reset]);

  useEffect(() => {
    console.log('Form State:', {
      isValid,
      isDirty,
      errors,
      isEditMode
    });
  }, [isValid, isDirty, errors, isEditMode]);

  const handleFormSubmit = (data: CustomerFormData) => {
    if (isEditMode && initialData) {
      // Check if any data has changed
      const hasChanges = Object.keys(data).some(key => {
        // Skip password field in comparison
        if (key === 'password') return false;
        // Handle null values
        const initialValue = initialData[key as keyof Customer] ?? '';
        const currentValue = data[key as keyof CustomerFormData] ?? '';
        return initialValue !== currentValue;
      });

      if (!hasChanges) {
        // If no changes, just close the modal
        onClose();
        return;
      }

      // Submit as update payload
      onSubmit(data as UpdateCustomerPayload);
    } else {
      // Submit as create payload with strType
      onSubmit({
        ...data,
        strType: 'customer', // Add required strType for new customers
      } as CreateCustomerPayload);
    }
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
              <Label htmlFor="email">อีเมล</Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
            </div>
            {!isEditMode && (
              <div className="space-y-1">
                <Label htmlFor="password">รหัสผ่าน *</Label>
                <Input id="password" type="password" {...register("password")} />
                {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="firstName">ชื่อ *</Label>
              <Input id="firstName" {...register("firstName")} />
              {errors.firstName && <p className="text-sm text-red-600">{errors.firstName.message}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="nickName">ชื่อเล่น</Label>
              <Input id="nickName" {...register("nickName")} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="customerCode">รหัสลูกค้า (4 ตัวอักษร)</Label>
              <Input id="customerCode" {...register("customerCode")} maxLength={4} />
              {errors.customerCode && <p className="text-sm text-red-600">{errors.customerCode.message}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="phone">เบอร์โทร</Label>
              <Input id="phone" {...register("phone")} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="phoneSub">เบอร์โทรสำรอง</Label>
              <Input id="phoneSub" {...register("phoneSub")} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="cardNumber">เลขบัตรประชาชน</Label>
              <Input id="cardNumber" {...register("cardNumber")} />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="address">ที่อยู่</Label>
            <Input id="address" {...register("address")} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="priceEk">ราคา EK</Label>
              <Input
                id="priceEk"
                type="number"
                {...register("priceEk", { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="priceSea">ราคา Sea</Label>
              <Input
                id="priceSea"
                type="number"
                {...register("priceSea", { valueAsNumber: true })}
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="textPrice">ข้อความราคา</Label>
            <Input id="textPrice" {...register("textPrice")} />
          </div>

          <div className="flex justify-between pt-2">
            <DialogClose asChild>
              <Button type="button" variant="outline" className="hover:scale-105 transition-transform">
                ยกเลิก ×
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="hover:scale-105 transition-transform"
              style={{ backgroundColor: "#5B5FEE" }}
              disabled={!isValid}
            >
              ยืนยัน 💾
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

