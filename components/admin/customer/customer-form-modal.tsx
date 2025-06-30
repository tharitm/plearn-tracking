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
  firstName: z.string().min(1, "ชื่อจำเป็นต้องกรอก"),
  nickName: z.string().optional(),
  email: z.string().email("อีเมลไม่ถูกต้อง").nullable(),
  phone: z.string().min(1, "เบอร์โทรจำเป็นต้องกรอก"),
  phoneSub: z.string().optional(),
  customerCode: z.string().min(1, "รหัสลูกค้าจำเป็นต้องกรอก"),
  address: z.string().min(1, "ที่อยู่จำเป็นต้องกรอก"),
  cardNumber: z.string().optional(),
  status: z.boolean(),
  flagStatus: z.boolean(),
  picture: z.string().optional(),
  priceEk: z.number().default(0),
  priceSea: z.number().default(0),
  textPrice: z.string().optional(),
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
      firstName: "",
      nickName: "",
      email: null,
      phone: "",
      phoneSub: "",
      customerCode: "",
      address: "",
      cardNumber: "",
      status: true,
      flagStatus: false,
      picture: "",
      priceEk: 0,
      priceSea: 0,
      textPrice: "",
    },
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
          status: initialData.status,
          flagStatus: initialData.flagStatus,
          picture: initialData.picture,
          priceEk: initialData.priceEk,
          priceSea: initialData.priceSea,
          textPrice: initialData.textPrice,
        });
      } else {
        reset({
          firstName: "",
          nickName: "",
          email: null,
          phone: "",
          phoneSub: "",
          customerCode: "",
          address: "",
          cardNumber: "",
          status: true,
          flagStatus: false,
          picture: "",
          priceEk: 0,
          priceSea: 0,
          textPrice: "",
        });
      }
    }
  }, [isOpen, isEditMode, initialData, reset]);

  const handleFormSubmit = (data: CustomerFormData) => {
    onSubmit(data);
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
              <Label htmlFor="firstName">ชื่อ</Label>
              <Input id="firstName" {...register("firstName")} />
              {errors.firstName && <p className="text-sm text-red-600">{errors.firstName.message}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="nickName">ชื่อเล่น</Label>
              <Input id="nickName" {...register("nickName")} />
              {errors.nickName && <p className="text-sm text-red-600">{errors.nickName.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="email">อีเมล</Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="customerCode">รหัสลูกค้า</Label>
              <Input id="customerCode" {...register("customerCode")} readOnly={isEditMode} />
              {errors.customerCode && <p className="text-sm text-red-600">{errors.customerCode.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="phone">เบอร์โทร</Label>
              <Input id="phone" {...register("phone")} />
              {errors.phone && <p className="text-sm text-red-600">{errors.phone.message}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="phoneSub">เบอร์โทรสำรอง</Label>
              <Input id="phoneSub" {...register("phoneSub")} />
              {errors.phoneSub && <p className="text-sm text-red-600">{errors.phoneSub.message}</p>}
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="address">ที่อยู่</Label>
            <Textarea id="address" {...register("address")} />
            {errors.address && <p className="text-sm text-red-600">{errors.address.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="cardNumber">เลขบัตร/เลขทะเบียน</Label>
              <Input id="cardNumber" {...register("cardNumber")} />
              {errors.cardNumber && <p className="text-sm text-red-600">{errors.cardNumber.message}</p>}
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
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <span>{watch("status") ? "ใช้งาน" : "ไม่ใช้งาน"}</span>
              </div>
              {errors.status && <p className="text-sm text-red-600">{errors.status.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="priceEk">ราคา EK</Label>
              <Input
                id="priceEk"
                type="number"
                {...register("priceEk", { valueAsNumber: true })}
              />
              {errors.priceEk && <p className="text-sm text-red-600">{errors.priceEk.message}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="priceSea">ราคา Sea</Label>
              <Input
                id="priceSea"
                type="number"
                {...register("priceSea", { valueAsNumber: true })}
              />
              {errors.priceSea && <p className="text-sm text-red-600">{errors.priceSea.message}</p>}
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="textPrice">หมายเหตุราคา</Label>
            <Input id="textPrice" {...register("textPrice")} />
            {errors.textPrice && <p className="text-sm text-red-600">{errors.textPrice.message}</p>}
          </div>

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
