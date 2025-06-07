"use client"

import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"

interface ParcelFormData {
  parcelRef: string
  customerCode: string
  cnTracking: string
  weight: number
  volume: number
  freight: number
  deliveryMethod: string
  estimate: number
  shipment: string
}

interface ParcelFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: ParcelFormData) => void
}

export function ParcelForm({ open, onClose, onSubmit }: ParcelFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ParcelFormData>()

  const handleFormSubmit = (data: ParcelFormData) => {
    onSubmit(data)
    reset()
    onClose()
  }

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>เพิ่มรายการสินค้าใหม่</SheetTitle>
          <SheetDescription>กรอกข้อมูลพัสดุใหม่ลงในระบบ</SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 mt-6">
          <div className="space-y-2">
            <Label htmlFor="parcelRef">เลขที่รับพัสดุ *</Label>
            <Input
              id="parcelRef"
              {...register("parcelRef", { required: "กรุณาใส่เลขที่รับพัสดุ" })}
              placeholder="เช่น P2024001"
            />
            {errors.parcelRef && <p className="text-sm text-red-600">{errors.parcelRef.message}</p>}
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

            <div className="space-y-2">
              <Label htmlFor="volume">ปริมาณ (CBM) *</Label>
              <Input
                id="volume"
                type="number"
                step="0.01"
                {...register("volume", {
                  required: "กรุณาใส่ปริมาณ",
                  valueAsNumber: true,
                  min: { value: 0, message: "ปริมาณต้องมากกว่า 0" },
                })}
                placeholder="0.00"
              />
              {errors.volume && <p className="text-sm text-red-600">{errors.volume.message}</p>}
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
            <Label htmlFor="estimate">ประมาณการ (บาท) *</Label>
            <Input
              id="estimate"
              type="number"
              step="0.01"
              {...register("estimate", {
                required: "กรุณาใส่ประมาณการ",
                valueAsNumber: true,
                min: { value: 0, message: "ประมาณการต้องมากกว่า 0" },
              })}
              placeholder="0.00"
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
            <Label>วิธีการจัดส่ง *</Label>
            <Select onValueChange={(value) => setValue("deliveryMethod", value)}>
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
          </div>

          <div className="flex space-x-2 pt-4">
            <Button type="submit" className="flex-1">
              บันทึก
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              ยกเลิก
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
