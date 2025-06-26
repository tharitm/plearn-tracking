"use client"

import { useEffect, useState } from "react" // Added useEffect and useState
import { useForm, Controller } from "react-hook-form" // Added Controller for Select
import type { Parcel } from "@/lib/types" // Added Parcel type
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useAuthStore } from "@/stores/auth-store"

export interface ParcelFormData {
  orderNo: string
  customerName: string
  description: string
  pack: number
  weight: number
  length?: number
  width?: number
  height?: number
  cbm?: number
  transportation: string
  cabinetCode: string
  estimate: string
  status: Parcel['status']
  paymentStatus: boolean
  tracking?: string
  trackingTh?: string
  shippingCost?: number
  images?: File[]
}

export interface ParcelFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: ParcelFormData) => void
  initialData?: Parcel // For editing
  isEditMode?: boolean // To toggle UI and behavior
}

export function ParcelForm({
  open,
  onClose,
  onSubmit,
  initialData,
  isEditMode = false,
}: ParcelFormProps) {
  const { user } = useAuthStore()
  const isAdmin = user?.role === 'admin'
  const [images, setImages] = useState<File[]>([])
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control, // Added control for Controller
    watch,
    formState: { errors, isDirty }, // Added isDirty to check if form has been touched
  } = useForm<ParcelFormData>({
    defaultValues: isEditMode && initialData
      ? {
        orderNo: initialData.orderNo ?? "",
        customerName: initialData.customerName ?? "",
        description: initialData.description ?? "",
        pack: initialData.pack ?? 1,
        weight: initialData.weight ?? 0,
        width: initialData.width ?? 0,
        length: initialData.length ?? 0,
        height: initialData.height ?? 0,
        cbm: initialData.cbm ?? 0,
        transportation: initialData.transportation ?? "",
        cabinetCode: initialData.cabinetCode ?? "",
        estimate: initialData.estimate ?? new Date().toISOString().split('T')[0],
        status: initialData.status ?? "pending",
        paymentStatus: initialData.paymentStatus ?? false,
        tracking: initialData.tracking ?? "",
        trackingTh: initialData.trackingTh ?? "",
        shippingCost: initialData.shippingCost ?? 0,
        images: [],
      }
      : {
        orderNo: "",
        customerName: "",
        description: "",
        pack: 1,
        weight: 0,
        width: 0,
        length: 0,
        height: 0,
        cbm: 0,
        transportation: "",
        cabinetCode: "",
        estimate: new Date().toISOString().split('T')[0],
        status: "pending",
        paymentStatus: false,
        tracking: "",
        trackingTh: "",
        shippingCost: 0,
        images: [],
      },
  })

  useEffect(() => {
    if (open) { // Only reset/initialize when sheet opens
      if (isEditMode && initialData) {
        const formData: ParcelFormData = {
          orderNo: initialData.orderNo ?? "",
          customerName: initialData.customerName ?? "",
          description: initialData.description ?? "",
          pack: initialData.pack ?? 1,
          weight: initialData.weight ?? 0,
          width: initialData.width ?? 0,
          length: initialData.length ?? 0,
          height: initialData.height ?? 0,
          cbm: initialData.cbm ?? 0,
          transportation: initialData.transportation ?? "",
          cabinetCode: initialData.cabinetCode ?? "",
          estimate: initialData.estimate ?? new Date().toISOString().split('T')[0],
          status: initialData.status ?? "pending",
          paymentStatus: initialData.paymentStatus ?? false,
          tracking: initialData.tracking ?? "",
          trackingTh: initialData.trackingTh ?? "",
          shippingCost: initialData.shippingCost ?? 0,
          images: [],
        };
        reset(formData);
        setImages([])
      } else {
        reset({
          orderNo: "",
          customerName: "",
          description: "",
          pack: 1,
          weight: 0,
          width: 0,
          length: 0,
          height: 0,
          cbm: 0,
          transportation: "",
          cabinetCode: "",
          estimate: new Date().toISOString().split('T')[0],
          status: "pending",
          paymentStatus: false,
          tracking: "",
          trackingTh: "",
          shippingCost: 0,
          images: [],
        });
        setImages([])
      }
    }
  }, [open, isEditMode, initialData, reset]);

  // คำนวณปริมาตร (CBM) อัตโนมัติ
  useEffect(() => {
    const width = watch("width") || 0
    const length = watch("length") || 0
    const height = watch("height") || 0
    const cbm = (width * length * height) / 1_000_000 // cm³ -> m³
    setValue("cbm", parseFloat(cbm.toFixed(4)))
  }, [watch("width"), watch("length"), watch("height"), setValue])

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files))
    }
  }

  const handleFormSubmit = (data: ParcelFormData) => {
    onSubmit({ ...data, images });
    if (!isEditMode) {
      reset({
        orderNo: "",
        customerName: "",
        description: "",
        pack: 1,
        weight: 0,
        width: 0,
        length: 0,
        height: 0,
        cbm: 0,
        transportation: "",
        cabinetCode: "",
        estimate: new Date().toISOString().split('T')[0],
        status: "pending",
        paymentStatus: false,
        tracking: "",
        trackingTh: "",
        shippingCost: 0,
        images: [],
      });
      setImages([])
    }
    // onClose(); // Parent should decide if form closes after submit, especially in edit mode
  };

  const title = isEditMode ? "แก้ไขข้อมูลพัสดุ" : "เพิ่มรายการสินค้าใหม่";
  const description = isEditMode
    ? "แก้ไขข้อมูลพัสดุที่มีอยู่ในระบบ"
    : "กรอกข้อมูลพัสดุใหม่ลงในระบบ";
  const submitButtonText = isEditMode ? "บันทึกการเปลี่ยนแปลง" : "เพิ่มสินค้า";

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 mt-6">
          {/* Order No */}
          <div className="space-y-2">
            <Label htmlFor="orderNo">Order No</Label>
            <Input id="orderNo" {...register("orderNo", { required: true })} readOnly={isEditMode} />
          </div>
          {/* Customer Name */}
          <div className="space-y-2">
            <Label htmlFor="customerName">ชื่อลูกค้า</Label>
            <Input id="customerName" {...register("customerName", { required: true })} />
          </div>
          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">รายละเอียดสินค้า</Label>
            <Input id="description" {...register("description", { required: true })} />
          </div>
          {/* Pack */}
          <div className="space-y-2">
            <Label htmlFor="pack">จำนวน (Pack)</Label>
            <Input id="pack" type="number" {...register("pack", { valueAsNumber: true, min: 1 })} />
          </div>
          {/* Weight */}
          <div className="space-y-2">
            <Label htmlFor="weight">น้ำหนัก (KG)</Label>
            <Input id="weight" type="number" {...register("weight", { valueAsNumber: true, min: 0 })} />
          </div>
          {/* Width */}
          <div className="space-y-2">
            <Label htmlFor="width">ความกว้าง (CM)</Label>
            <Input id="width" type="number" {...register("width", { valueAsNumber: true, min: 0 })} />
          </div>
          {/* Length */}
          <div className="space-y-2">
            <Label htmlFor="length">ความยาว (CM)</Label>
            <Input id="length" type="number" {...register("length", { valueAsNumber: true, min: 0 })} />
          </div>
          {/* Height */}
          <div className="space-y-2">
            <Label htmlFor="height">ความสูง (CM)</Label>
            <Input id="height" type="number" {...register("height", { valueAsNumber: true, min: 0 })} />
          </div>
          {/* CBM */}
          <div className="space-y-2">
            <Label htmlFor="cbm">ปริมาตร (CBM)</Label>
            <Input id="cbm" type="number" disabled {...register("cbm", { valueAsNumber: true })} />
          </div>
          {/* Transportation */}
          <div className="space-y-2">
            <Label htmlFor="transportation">ช่องทางขนส่ง</Label>
            <Input id="transportation" {...register("transportation", { required: true })} />
          </div>
          {/* Cabinet Code */}
          <div className="space-y-2">
            <Label htmlFor="cabinetCode">Cabinet Code</Label>
            <Input id="cabinetCode" {...register("cabinetCode", { required: true })} />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">สถานะ</Label>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกสถานะ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="arrived_cn_warehouse">ถึงโกดังจีน</SelectItem>
                    <SelectItem value="container_closed">ตู้ปิดสินค้า</SelectItem>
                    <SelectItem value="arrived_th_warehouse">ถึงโกดังไทย</SelectItem>
                    <SelectItem value="ready_to_ship_to_customer">เตรียมส่งลูกค้า</SelectItem>
                    <SelectItem value="shipped_to_customer">ส่งแล้ว</SelectItem>
                    <SelectItem value="delivered_to_customer">ส่งถึงแล้ว</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          {/* Payment Status */}
          <div className="space-y-2">
            <Label htmlFor="paymentStatus">สถานะชำระเงิน</Label>
            <Controller
              control={control}
              name="paymentStatus"
              render={({ field }) => (
                <Select
                  onValueChange={v => field.onChange(v === "true")}
                  defaultValue={field.value ? "true" : "false"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกสถานะชำระเงิน" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">ชำระแล้ว</SelectItem>
                    <SelectItem value="false">ค้างชำระ</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Tracking จีน */}
          <div className="space-y-2">
            <Label htmlFor="tracking">Tracking จีน</Label>
            <Input id="tracking" {...register("tracking")} />
          </div>
          {/* Tracking ไทย */}
          <div className="space-y-2">
            <Label htmlFor="trackingTh">Tracking ไทย</Label>
            <Input id="trackingTh" {...register("trackingTh")} />
          </div>
          {/* Shipping Cost */}
          <div className="space-y-2">
            <Label htmlFor="shippingCost">ค่าขนส่ง (บาท)</Label>
            <Input id="shippingCost" type="number" {...register("shippingCost", { valueAsNumber: true })} />
          </div>

          {isAdmin ? (
            <div className="space-y-2">
              <Label htmlFor="images">รูปภาพพัสดุ</Label>
              <Input id="images" type="file" multiple onChange={handleImagesChange} />
              {images.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {images.map((file, index) => (
                    <img
                      key={index}
                      src={URL.createObjectURL(file)}
                      className="h-16 w-16 object-cover rounded-md"
                      alt="preview"
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            initialData?.images && initialData.images.length > 0 && (
              <div className="space-y-2">
                <Label>รูปภาพพัสดุ</Label>
                <div className="flex flex-wrap gap-2">
                  {initialData.images.map((src, idx) => (
                    <img
                      key={idx}
                      src={src}
                      onClick={() => window.open(src, '_blank')}
                      className="h-16 w-16 object-cover rounded-md cursor-pointer"
                      alt="parcel image"
                    />
                  ))}
                </div>
              </div>
            )
          )}

          <div className="flex space-x-2 pt-4">
            <Button type="submit" className="flex-1">
              {submitButtonText}
            </Button>
            <Button type="button" variant="outline" onClick={() => {
              if (isEditMode && isDirty) { // Or some other logic to confirm discard
                if (confirm("คุณมีการเปลี่ยนแปลงที่ยังไม่ได้บันทึก ต้องการยกเลิกหรือไม่?")) {
                  onClose();
                }
              } else {
                onClose();
              }
            }}>
              ยกเลิก
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
