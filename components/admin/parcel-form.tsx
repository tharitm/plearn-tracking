"use client"

import { useEffect, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import type { Parcel } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useAuthStore } from "@/stores/auth-store"
import { createOrders, updateOrder, uploadOrderPictures, uploadToCloudinary } from "@/services/parcelService"
import { showToast } from "@/lib/toast-utils"
import { ImageUpload } from "@/components/shared/image-upload"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Trash2 } from "lucide-react"

export interface ParcelFormData {
  orderNo: string
  customerName: string
  description: string
  pack: number
  weight: number
  length: number
  width: number
  height: number
  cbm: number
  transportation: string
  cabinetCode: string
  estimate: string
  status: string
  tracking: string
  trackingTh: string | null
  receiptNumber: string | null
  shippingCost: number | null
  shippingRates: number | null
  picture: string | null
  orderDate: string
  images: string[]
}

export interface ParcelFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: ParcelFormData) => void
  initialData?: Parcel // For editing
  isEditMode?: boolean // To toggle UI and behavior
  refetch: () => Promise<void>
}

export function ParcelForm({
  open,
  onClose,
  onSubmit,
  initialData,
  isEditMode = false,
  refetch,
}: ParcelFormProps) {
  const { user } = useAuthStore()
  const isAdmin = user?.role === 'admin'
  const [isUploading, setIsUploading] = useState(false)
  const [images, setImages] = useState<string[]>(initialData?.images || [])
  const [pendingFiles, setPendingFiles] = useState<File[]>([])
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    control,
    watch,
    formState: { errors, isDirty },
  } = useForm<ParcelFormData>({
    defaultValues: {
      orderNo: initialData?.orderNo || "",
      customerName: initialData?.customerName || "",
      description: initialData?.description || "",
      pack: initialData?.pack || 0,
      weight: initialData?.weight || 0,
      length: initialData?.length || 0,
      width: initialData?.width || 0,
      height: initialData?.height || 0,
      cbm: initialData?.cbm || 0,
      transportation: initialData?.transportation || "",
      cabinetCode: initialData?.cabinetCode || "",
      estimate: initialData?.estimate || new Date().toISOString().split('T')[0],
      status: initialData?.status || "",
      tracking: initialData?.tracking || "",
      trackingTh: initialData?.trackingTh || null,
      receiptNumber: initialData?.receiptNumber || null,
      shippingCost: initialData?.shippingCost || null,
      shippingRates: initialData?.shippingRates || null,
      picture: initialData?.images?.[0] || null,
      orderDate: initialData?.orderDate || new Date().toISOString().split('T')[0],
      images: initialData?.images || [],
    },
  })

  useEffect(() => {
    if (open) {
      if (isEditMode && initialData) {
        const formData: ParcelFormData = {
          orderNo: initialData.orderNo || "",
          customerName: initialData.customerName || "",
          description: initialData.description || "",
          pack: initialData.pack || 0,
          weight: initialData.weight || 0,
          length: initialData.length || 0,
          width: initialData.width || 0,
          height: initialData.height || 0,
          cbm: initialData.cbm || 0,
          transportation: initialData.transportation || "",
          cabinetCode: initialData.cabinetCode || "",
          estimate: initialData.estimate || new Date().toISOString().split('T')[0],
          status: initialData.status || "",
          tracking: initialData.tracking || "",
          trackingTh: initialData.trackingTh || null,
          receiptNumber: initialData.receiptNumber || null,
          shippingCost: initialData.shippingCost || null,
          shippingRates: initialData.shippingRates || null,
          picture: initialData.images?.[0] || null,
          orderDate: initialData.orderDate || new Date().toISOString().split('T')[0],
          images: initialData.images || [],
        };
        reset(formData);
        setImages(initialData.images || [])
      } else {
        reset({
          orderNo: "",
          customerName: "",
          description: "",
          pack: 0,
          weight: 0,
          length: 0,
          width: 0,
          height: 0,
          cbm: 0,
          transportation: "",
          cabinetCode: "",
          estimate: new Date().toISOString().split('T')[0],
          status: "",
          tracking: "",
          trackingTh: null,
          receiptNumber: null,
          shippingCost: null,
          shippingRates: null,
          picture: null,
          orderDate: new Date().toISOString().split('T')[0],
          images: [],
        });
        setImages([])
      }
    }
  }, [open, isEditMode, initialData, reset]);

  // คำนวณปริมาตร (CBM) และค่าขนส่งอัตโนมัติ
  useEffect(() => {
    const width = watch("width") || 0
    const length = watch("length") || 0
    const height = watch("height") || 0
    const cbm = (width * length * height) / 1_000_000 // cm³ -> m³
    setValue("cbm", parseFloat(cbm.toFixed(4)))

    // คำนวณค่าขนส่ง
    const shippingRates = watch("shippingRates") || 0
    const calculatedShippingCost = cbm * shippingRates
    setValue("shippingCost", parseFloat(calculatedShippingCost.toFixed(2)))
  }, [watch("width"), watch("length"), watch("height"), watch("shippingRates"), setValue])

  const handleImagesSelected = async (files: File[]) => {
    // เก็บไฟล์ไว้ใน state แทนที่จะอัพโหลดทันที
    setPendingFiles(prev => [...prev, ...files])
  }

  const handleFormSubmit = async (data: ParcelFormData) => {
    try {
      setIsUploading(true)

      const formattedData = {
        ...data,
        shippingCost: data.shippingCost,
        shippingRates: data.shippingRates,
        cbm: Number(data.cbm),
        pack: Number(data.pack),
        weight: Number(data.weight),
        length: Number(data.length),
        width: Number(data.width),
        height: Number(data.height),
        images: images, // ใช้รูปเดิมที่มีอยู่
      }

      let orderId: string;

      if (isEditMode && initialData?.id) {
        await updateOrder(initialData.id, formattedData)
        orderId = initialData.id
        showToast("แก้ไขข้อมูลสำเร็จ")
      } else {
        // สร้าง order ใหม่
        const createdOrders = await createOrders([formattedData])
        orderId = createdOrders[0].id
        showToast("เพิ่มข้อมูลสำเร็จ")
      }
      // ถ้ามีรูปใหม่ ค่อยอัพโหลด
      if (pendingFiles.length > 0) {
        try {
          // ดึงรูปเก่าจาก form state
          const previousImages = getValues("images") || []

          // เรียก uploadOrderPictures โดยส่งไฟล์ใหม่ และรูปเก่ารวมกันไป
          const uploadedImages = await uploadOrderPictures(orderId, pendingFiles, previousImages)
          if (Array.isArray(uploadedImages)) {
            await updateOrder(orderId, { images: uploadedImages })
            setImages(uploadedImages)
            setValue("images", uploadedImages)
            showToast("อัพโหลดรูปภาพสำเร็จ")
          } else {
            console.error("Unexpected response format from uploadOrderPictures")
            showToast("อัพโหลดรูปภาพไม่สำเร็จ แต่บันทึกข้อมูลสินค้าแล้ว", "warning")
          }
        } catch (error) {
          console.error("Failed to upload images:", error)
          showToast("อัพโหลดรูปภาพไม่สำเร็จ แต่บันทึกข้อมูลสินค้าแล้ว", "warning")
        }
      }

      await refetch()
      if (onSubmit) {
        onSubmit(formattedData)
      }
      onClose()
    } catch (error) {
      console.error("Failed to submit form:", error)
      showToast(isEditMode ? "แก้ไขข้อมูลไม่สำเร็จ" : "เพิ่มข้อมูลไม่สำเร็จ", "error")
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async () => {
    try {
      // Mock delete for now
      showToast("ลบข้อมูลสำเร็จ")
      onClose()
    } catch (error) {
      console.error("Failed to delete:", error)
      showToast("ลบข้อมูลไม่สำเร็จ", "error")
    }
  }

  const title = isEditMode ? "แก้ไขข้อมูลพัสดุ" : "เพิ่มรายการสินค้าใหม่";
  const description = isEditMode
    ? "แก้ไขข้อมูลพัสดุที่มีอยู่ในระบบ"
    : "กรอกข้อมูลพัสดุใหม่ลงในระบบ";
  const submitButtonText = isEditMode ? "บันทึกการเปลี่ยนแปลง" : "เพิ่มสินค้า";

  const handleClose = () => {
    if (isDirty) {
      setShowConfirmDialog(true)
    } else {
      onClose()
    }
  }

  // Required field label component
  const RequiredLabel = ({ children }: { children: React.ReactNode }) => (
    <div className="flex items-center gap-1">
      {children}
      <span className="text-red-500">*</span>
    </div>
  )

  return (
    <>
      <Sheet open={open} onOpenChange={handleClose}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{title}</SheetTitle>
            <SheetDescription>{description}</SheetDescription>
            <div className="text-sm text-muted-foreground mt-2">
              <span className="text-red-500">*</span> หมายถึงฟิลด์ที่จำเป็นต้องกรอก
            </div>
          </SheetHeader>

          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 mt-6">
            {/* Order No */}
            <div className="space-y-2">
              <RequiredLabel>
                <Label htmlFor="orderNo">Order No</Label>
              </RequiredLabel>
              <Input
                id="orderNo"
                {...register("orderNo", {
                  required: "กรุณากรอก Order No"
                })}
                readOnly={isEditMode}
              />
              {errors.orderNo && (
                <p className="text-sm text-red-500">{errors.orderNo.message}</p>
              )}
            </div>
            {/* Customer Name */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <RequiredLabel>
                  <Label htmlFor="customerName">รหัสลูกค้า</Label>
                </RequiredLabel>
              </div>
              <Input
                id="customerName"
                {...register("customerName", {
                  required: "กรุณากรอกรหัสลูกค้า",
                  pattern: {
                    value: /^[A-Za-z0-9]{4}$/,
                    message: "รหัสลูกค้าต้องเป็นตัวอักษรหรือตัวเลข 4 ตัว"
                  }
                })}
              />
              {errors.customerName && (
                <p className="text-sm text-red-500">{errors.customerName.message}</p>
              )}
            </div>
            {/* Description */}
            <div className="space-y-2">
              <RequiredLabel>
                <Label htmlFor="description">รายละเอียดสินค้า</Label>
              </RequiredLabel>
              <Input
                id="description"
                {...register("description", {
                  required: "กรุณากรอกรายละเอียดสินค้า"
                })}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description.message}</p>
              )}
            </div>
            {/* Pack */}
            <div className="space-y-2">
              <RequiredLabel>
                <Label htmlFor="pack">จำนวน (Pack)</Label>
              </RequiredLabel>
              <Input
                id="pack"
                type="number"
                {...register("pack", {
                  required: "กรุณากรอกจำนวน",
                  valueAsNumber: true,
                  min: {
                    value: 1,
                    message: "จำนวนต้องมากกว่า 0"
                  }
                })}
              />
              {errors.pack && (
                <p className="text-sm text-red-500">{errors.pack.message}</p>
              )}
            </div>
            {/* Weight */}
            <div className="space-y-2">
              <RequiredLabel>
                <Label htmlFor="weight">น้ำหนัก (KG)</Label>
              </RequiredLabel>
              <Input
                id="weight"
                type="number"
                step="0.01"
                {...register("weight", {
                  required: "กรุณากรอกน้ำหนัก",
                  valueAsNumber: true,
                  min: {
                    value: 0,
                    message: "น้ำหนักต้องไม่ติดลบ"
                  }
                })}
              />
              {errors.weight && (
                <p className="text-sm text-red-500">{errors.weight.message}</p>
              )}
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
              <Input id="transportation" {...register("transportation")} />
            </div>
            {/* Cabinet Code */}
            <div className="space-y-2">
              <Label htmlFor="cabinetCode">Cabinet Code</Label>
              <Input id="cabinetCode" {...register("cabinetCode")} />
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
            {/* Tracking จีน */}
            <div className="space-y-2">
              <Label htmlFor="tracking">Tracking จีน</Label>
              <Input id="tracking" {...register("tracking")} />
            </div>
            {/* Estimate Date */}
            <div className="space-y-2">
              <Label htmlFor="estimate">ประมาณการ</Label>
              <Input
                type="date"
                id="estimate"
                {...register("estimate")}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            {/* Shipping Rates */}
            <div className="space-y-2">
              <Label htmlFor="shippingRates">เรทค่าขนส่ง (บาท/CBM)</Label>
              <Input
                id="shippingRates"
                type="number"
                {...register("shippingRates", {
                  valueAsNumber: true,
                  onChange: (e) => {
                    const value = parseFloat(e.target.value);
                    const cbm = watch("cbm") || 0;
                    setValue("shippingCost", parseFloat((value * cbm).toFixed(2)));
                  }
                })}
              />
            </div>
            {/* Shipping Cost */}
            <div className="space-y-2">
              <Label htmlFor="shippingCost">ค่าขนส่ง (บาท)</Label>
              <Input
                id="shippingCost"
                type="number"
                {...register("shippingCost", { valueAsNumber: true })}
                disabled
              />
            </div>

            {isAdmin && (
              <div className="space-y-2">
                <Label>รูปภาพสินค้า</Label>
                <ImageUpload
                  images={[...images, ...pendingFiles.map(file => URL.createObjectURL(file))]}
                  onImagesChange={(newImages) => {
                    // ลบรูปที่เลือกออก
                    const remainingImages = newImages.filter(img => !pendingFiles.some(file => URL.createObjectURL(file) === img))
                    const remainingFiles = pendingFiles.filter(file => newImages.includes(URL.createObjectURL(file)))
                    setImages(remainingImages)
                    setPendingFiles(remainingFiles)
                  }}
                  onFilesSelected={handleImagesSelected}
                  isUploading={isUploading}
                />
              </div>
            )}

            <div className="flex justify-between items-center pt-4">
              <div className="flex gap-2">
                <Button type="submit" disabled={!isAdmin || isUploading}>
                  {submitButtonText}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleClose()}
                >
                  ยกเลิก
                </Button>
              </div>
              {isEditMode && isAdmin && (
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </form>
        </SheetContent>
      </Sheet>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ยืนยันการยกเลิก</AlertDialogTitle>
            <AlertDialogDescription>
              คุณมีการเปลี่ยนแปลงที่ยังไม่ได้บันทึก ต้องการยกเลิกหรือไม่?
              การยกเลิกจะทำให้ข้อมูลที่แก้ไขหายไป
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ไม่, กลับไปแก้ไข</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShowConfirmDialog(false)
                onClose()
              }}
            >
              ใช่, ยกเลิกการแก้ไข
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ยืนยันการลบ?</AlertDialogTitle>
            <AlertDialogDescription>
              การดำเนินการนี้ไม่สามารถยกเลิกได้ คุณแน่ใจหรือไม่?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ไม่</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
            >
              ใช่, ลบ
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
