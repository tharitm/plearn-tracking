// UserRole matches backend UserRole
export enum UserRole {
  ADMIN = 'admin',
  CUSTOMER = 'customer',
}

// UserStatus matches backend User status
export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

// This will represent the Customer data, aligned with UserResponse from backend
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  customerCode: string;
  address?: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string; // Assuming string format from API (e.g., ISO date string)
  updatedAt: string; // Assuming string format from API
  // passwordHash should not be included
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
  // We can add a generic 'search' if needed, to be handled by the backend
}

// Payload for creating a customer (aligns with CreateUserRequest on backend)
export interface CreateCustomerPayload {
  name: string;
  email: string;
  phone: string;
  customerCode: string;
  address?: string;
  password?: string; // Optional, backend might autogenerate or require
  role?: UserRole;
  status?: UserStatus;
}

// Payload for updating a customer (aligns with UpdateUserRequest on backend)
export interface UpdateCustomerPayload {
  name?: string;
  email?: string;
  phone?: string;
  customerCode?: string;
  address?: string;
  role?: UserRole;
  status?: UserStatus;
  // Password updates should ideally be a separate process (e.g., resetPassword)
}


export interface User { // Basic user, might be useful for logged-in user context
  id: string
  name: string
  role: UserRole
  customerCode?: string // if the logged-in user is a customer
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
  images?: string[]
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
  data: Customer[]; // The actual list of customers
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ParcelListResponse {
  parcels: Parcel[]
  total: number
  page: number
  pageSize: number
}

// For simple success responses from backend, often used for CUD operations not returning full entity
export interface SimpleSuccessMessage {
  success: boolean;
  message: string;
}
