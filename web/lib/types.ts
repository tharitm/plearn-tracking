export interface User {
  id: string
  name: string
  role: "admin" | "customer"
  customerCode?: string
}

export interface Parcel {
  id: string
  parcelRef: string
  receiveDate: string
  customerCode: string
  shipment: string
  estimate: number
  status: "pending" | "shipped" | "delivered" | "cancelled"
  cnTracking: string
  volume: number
  weight: number
  freight: number
  deliveryMethod: string
  thTracking?: string
  paymentStatus: "unpaid" | "paid" | "partial"
  createdAt: string
  updatedAt: string
}

export interface ParcelFilters {
  dateFrom?: string
  dateTo?: string
  trackingNo?: string
  status?: string
  paymentStatus?: string
  search?: string
}

export interface PaginationState {
  pageIndex: number
  pageSize: number
}

export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}

export interface ParcelListResponse {
  parcels: Parcel[]
  total: number
  page: number
  pageSize: number
}
