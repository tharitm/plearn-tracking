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
  parcelRef: string
  customerCode: string
  cnTracking: string
  weight: number
  // volume: number // Volume will be calculated, so not part of form data directly unless also stored
  freight: number
  deliveryMethod: Parcel['deliveryMethod'] // Use string literal type from Parcel
  estimate: string // Changed to string for date input
  shipment: string
  receiveDate: string // HTML date input returns string
  width?: number
  length?: number
  height?: number
  thTracking?: string
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
    formState: { errors, isDirty }, // Added isDirty to check if form has been touched
  } = useForm<ParcelFormData>({
    defaultValues: isEditMode && initialData
      ? {
          ...initialData,
          receiveDate: initialData.receiveDate ? new Date(initialData.receiveDate).toISOString().split('T')[0] : "",
          // estimate is already a string 'YYYY-MM-DD' from initialData due to prior type change
          estimate: initialData.estimate || new Date().toISOString().split('T')[0],
          width: initialData.width || 0,
          length: initialData.length || 0,
          height: initialData.height || 0,
        }
      : {
          parcelRef: "",
          customerCode: "",
          cnTracking: "",
          weight: 0,
          // volume: 0, // Not directly in form
          width: 0,
          length: 0,
          height: 0,
          freight: 0,
          deliveryMethod: "pickup",
          estimate: new Date().toISOString().split('T')[0],
          shipment: "",
          receiveDate: new Date().toISOString().split('T')[0],
          thTracking: "",
        },
  })

  useEffect(() => {
    if (open) { // Only reset/initialize when sheet opens
      if (isEditMode && initialData) {
        const formData: ParcelFormData = {
          ...initialData,
          receiveDate: initialData.receiveDate ? new Date(initialData.receiveDate).toISOString().split('T')[0] : "",
          // estimate should be a string 'YYYY-MM-DD'
          estimate: initialData.estimate || new Date().toISOString().split('T')[0],
          width: initialData.width || 0,
          length: initialData.length || 0,
          height: initialData.height || 0,
        };
        reset(formData);
        setImages([])
      } else {
        // Reset to default new form values, including a default receiveDate
        reset({
          parcelRef: "",
          customerCode: "",
          cnTracking: "",
          weight: 0,
          // volume: 0, // Not directly in form
          width: 0,
          length: 0,
          height: 0,
          freight: 0,
          deliveryMethod: "pickup",
          estimate: new Date().toISOString().split('T')[0], // estimate is date
          shipment: "",
          receiveDate: new Date().toISOString().split('T')[0],
          thTracking: "",
        });
        setImages([])
      }
    }
  }, [open, isEditMode, initialData, reset]);

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files))
    }
  }

  const handleFormSubmit = (data: ParcelFormData) => {
    onSubmit({ ...data, images });
    if (!isEditMode) {
      // Only reset fully if creating a new parcel.
      // For edit, parent might close or keep it open with current data.
      reset({ // Reset to default new form values
        parcelRef: "",
        customerCode: "",
        cnTracking: "",
        weight: 0,
          // volume: 0, // Not directly in form
          width: 0,
          length: 0,
          height: 0,
        freight: 0,
        deliveryMethod: "pickup",
          estimate: new Date().toISOString().split('T')[0], // estimate is date
        shipment: "",
        receiveDate: new Date().toISOString().split('T')[0],
        thTracking: "",
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
          <div className="space-y-2">
            <Label htmlFor="parcelRef">เลขที่รับพัสดุ *</Label>
            <Input
              id="parcelRef"
              {...register("parcelRef", { required: "กรุณาใส่เลขที่รับพัสดุ" })}
              placeholder="เช่น P2024001"
              readOnly={isEditMode} // Read-only in edit mode
            />
            {errors.parcelRef && <p className="text-sm text-red-600">{errors.parcelRef.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="receiveDate">วันที่รับ *</Label>
            <Input
              id="receiveDate"
              type="date"
              {...register("receiveDate", { required: "กรุณาใส่วันที่รับ" })}
            />
            {errors.receiveDate && <p className="text-sm text-red-600">{errors.receiveDate.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="customerCode">รหัสลูกค้า *</Label>
            <Input
              id="customerCode"
              {...register("customerCode", { required: "กรุณาใส่รหัสลูกค้า" })}
              placeholder="เช่น C001"
            />
            {errors.customerCode && <p className="text-sm text-red-600">{errors.customerCode.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="cnTracking">TRACKING จีน *</Label>
            <Input
              id="cnTracking"
              {...register("cnTracking", { required: "กรุณาใส่เลข tracking จีน" })}
              placeholder="เช่น CN123456789"
            />
            {errors.cnTracking && <p className="text-sm text-red-600">{errors.cnTracking.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight">น้ำหนัก (KG) *</Label>
              <Input
                id="weight"
                type="number"
                step="0.01"
                {...register("weight", {
                  required: "กรุณาใส่น้ำหนัก",
                  valueAsNumber: true,
                  min: { value: 0, message: "น้ำหนักต้องมากกว่า 0" },
                })}
                placeholder="0.00"
              />
              {errors.weight && <p className="text-sm text-red-600">{errors.weight.message}</p>}
            </div>

            {/* Volume is not an input here anymore, it's calculated or comes from backend if stored */}
            {/* We add width, length, height instead */}
            <div className="space-y-2">
              <Label htmlFor="width">ความกว้าง (CM)</Label>
              <Input
                id="width"
                type="number"
                step="0.01"
                {...register("width", {
                  valueAsNumber: true,
                  min: { value: 0, message: "ความกว้างต้องไม่ติดลบ" },
                })}
                placeholder="0.00"
              />
              {errors.width && <p className="text-sm text-red-600">{errors.width.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="length">ความยาว (CM)</Label>
              <Input
                id="length"
                type="number"
                step="0.01"
                {...register("length", {
                  valueAsNumber: true,
                  min: { value: 0, message: "ความยาวต้องไม่ติดลบ" },
                })}
                placeholder="0.00"
              />
              {errors.length && <p className="text-sm text-red-600">{errors.length.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="height">ความสูง (CM)</Label>
              <Input
                id="height"
                type="number"
                step="0.01"
                {...register("height", {
                  valueAsNumber: true,
                  min: { value: 0, message: "ความสูงต้องไม่ติดลบ" },
                })}
                placeholder="0.00"
              />
              {errors.height && <p className="text-sm text-red-600">{errors.height.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="freight">ค่าขนส่ง (บาท) *</Label>
            <Input
              id="freight"
              type="number"
              step="0.01"
              {...register("freight", {
                required: "กรุณาใส่ค่าขนส่ง",
                valueAsNumber: true,
                min: { value: 0, message: "ค่าขนส่งต้องมากกว่า 0" },
              })}
              placeholder="0.00"
            />
            {errors.freight && <p className="text-sm text-red-600">{errors.freight.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="estimate">วันที่คาดว่าจะได้รับ (Estimate Date) *</Label>
            <Input
              id="estimate"
              type="date"
              {...register("estimate", {
                required: "กรุณาใส่วันที่คาดว่าจะได้รับ",
              })}
            />
            {errors.estimate && <p className="text-sm text-red-600">{errors.estimate.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="shipment">Shipment *</Label>
            <Input
              id="shipment"
              {...register("shipment", { required: "กรุณาใส่ shipment" })}
              placeholder="เช่น SH2024001"
            />
            {errors.shipment && <p className="text-sm text-red-600">{errors.shipment.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="thTracking">TRACKING ไทย (ถ้ามี)</Label>
            <Input
              id="thTracking"
              {...register("thTracking")}
              placeholder="เช่น TH123456789"
            />
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

          <div className="space-y-2">
            <Label>วิธีการจัดส่ง *</Label>
            <Controller
              name="deliveryMethod"
              control={control}
              rules={{ required: "กรุณาเลือกวิธีการจัดส่ง" }}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value} // Ensure value is correctly bound
                  defaultValue={isEditMode && initialData ? initialData.deliveryMethod : "pickup"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกวิธีการจัดส่ง" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pickup">รับที่โกดัง</SelectItem>
                    <SelectItem value="delivery">จัดส่งถึงบ้าน</SelectItem>
                    <SelectItem value="express">Express</SelectItem>
                    <SelectItem value="economy">Economy</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.deliveryMethod && (
              <p className="text-sm text-red-600">{errors.deliveryMethod.message}</p>
            )}
          </div>

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
