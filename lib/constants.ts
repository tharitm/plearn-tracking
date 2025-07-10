export const DEFAULT_THUMBNAIL = "/placeholder.jpg";

export const PARCEL_STATUS = {
  ALL: "all",
  PENDING: "pending",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
} as const;

export const PARCEL_STATUS_LABELS = {
  [PARCEL_STATUS.ALL]: "ทั้งหมด",
  [PARCEL_STATUS.PENDING]: "รอส่ง",
  [PARCEL_STATUS.SHIPPED]: "ส่งแล้ว",
  [PARCEL_STATUS.DELIVERED]: "ปิดตู้แล้ว",
  [PARCEL_STATUS.CANCELLED]: "ยกเลิก",
} as const;

export const PAYMENT_STATUS = {
  ALL: "all",
  UNPAID: "unpaid",
  PAID: "paid",
  PARTIAL: "partial",
} as const;

export const PAYMENT_STATUS_LABELS = {
  [PAYMENT_STATUS.ALL]: "ทั้งหมด",
  [PAYMENT_STATUS.UNPAID]: "ยังไม่ชำระ",
  [PAYMENT_STATUS.PAID]: "ชำระแล้ว",
  [PAYMENT_STATUS.PARTIAL]: "ชำระบางส่วน",
} as const;

export const CLOUDINARY_CONFIG = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
  folder: 'plearn-tracking/orders',
} as const;

