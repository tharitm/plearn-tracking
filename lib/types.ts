// UserRole matches backend UserRole
export enum UserRole {
  ADMIN = 'admin',
  CUSTOMER = 'customer',
}

// UserStatus matches backend User status as string
export enum UserStatus {
  ACTIVE = 'true',
  INACTIVE = 'false',
}

// ParcelStatus matches backend parcel status
export enum ParcelStatus {
  ARRIVED_CN_WAREHOUSE = 'arrived_cn_warehouse',
  CONTAINER_CLOSED = 'container_closed',
  ARRIVED_TH_WAREHOUSE = 'arrived_th_warehouse',
  READY_TO_SHIP = 'ready_to_ship_to_customer',
  SHIPPED = 'shipped_to_customer',
  DELIVERED = 'delivered_to_customer',
}

// This will represent the Customer data, aligned with UserResponse from backend
export interface Customer {
  id: number;
  email: string | null;
  firstName: string;
  nickName: string;
  phone: string;
  phoneSub: string;
  address: string;
  cardNumber: string;
  status: boolean;
  flagStatus: boolean;
  picture: string;
  customerCode: string;
  priceEk: number;
  priceSea: number;
  textPrice: string;
  createDate: string;
}

// Query parameters for fetching customers (aligns with GetUsersQuery on backend)
export interface CustomerQuery {
  page?: number;
  limit?: number;
  sortBy?: string; // e.g., 'name', 'email', 'createdAt'
  sortOrder?: 'ASC' | 'DESC';
  name?: string;
  email?: string;
  status?: UserStatus;
  search?: string; // Dynamic search field for name, email, customerCode
}

// Payload for creating a customer (aligns with CreateUserRequest on backend)
export interface CreateCustomerPayload {
  email: string;
  password: string;
  strType: string;
  firstName: string;
  nickName?: string;
  phone?: string;
  phoneSub?: string;
  address?: string;
  cardNumber?: string;
  status?: boolean;
  flagStatus?: boolean;
  picture?: string;
  strPassword?: string;
  textPrice?: string;
  priceEk?: number;
  priceSea?: number;
  customerCode?: string;
  applicationDate?: string;
}

// Payload for updating a customer (aligns with UpdateUserRequest on backend)
export interface UpdateCustomerPayload {
  firstName?: string;
  nickName?: string;
  email?: string | null;
  phone?: string;
  phoneSub?: string;
  customerCode?: string;
  address?: string;
  cardNumber?: string;
  status?: boolean;
  flagStatus?: boolean;
  picture?: string;
  priceEk?: number;
  priceSea?: number;
  textPrice?: string;
}


export interface User { // Basic user, might be useful for logged-in user context
  id: string
  name: string
  role: UserRole
  customerCode?: string // if the logged-in user is a customer
}

export interface Parcel {
  id: string;
  orderNo: string | null;
  customerName: string | null;
  description: string | null;
  pack: number | null;
  weight: number | null;
  length: number | null;
  width: number | null;
  height: number | null;
  cbm: number | null;
  transportation: string | null;
  cabinetCode: string | null;
  estimate: string | null;
  status: string;
  flagStatus: boolean;
  paymentStatus: boolean;
  tracking: string | null;
  trackingTh: string | null;
  receiptNumber: string | null;
  shippingCost: number | null;
  shippingRates: number | null;
  images: string[];
  orderDate: string | null;
  createDate: string | null;
  warehouseId: number | null;
  trackingEvents?: TrackingEvent[]; // Added for parcel detail modal
}

// Interface for tracking events, moved from parcel-detail-modal
export interface TrackingEvent {
  date: string;
  status: string;
  description: string;
  location?: string;
}

export interface ParcelFilters {
  dateFrom?: string
  dateTo?: string
  trackingNo?: string
  status?: string
  paymentStatus?: string
  search?: string
  customerName?: string
}

export interface PaginationState {
  pageIndex: number, // Corresponds to 'page' from backend but 0-indexed for some UI components
  pageSize: number, // Corresponds to 'limit' from backend
}

// Generic API response structure, can be specialized
export interface ApiResponse<T> {
  data: T;
  success?: boolean; // Assuming success is indicated by HTTP status or this flag
  message?: string;
  // Backend pagination structure for GET /users
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Specific response for fetching a list of customers (aligns with backend GET /api/users response)
export interface CustomerListResponse {
  users: Customer[];
  total: number;
  page: number;
  limit: number;
}

export interface ParcelListResponse {
  orders: Parcel[]
  total: number
  page: number
  pageSize: number
}

// For simple success responses from backend, often used for CUD operations not returning full entity
export interface SimpleSuccessMessage {
  success: boolean;
  message: string;
}
