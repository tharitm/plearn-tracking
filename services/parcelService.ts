import type { Parcel, ParcelFilters, ParcelListResponse } from '@/lib/types';
// Correctly import the new API response structure types
import type { ApiResponse, ApiSuccessResponse, ApiErrorResponse } from '@/lib/apiTypes';
import { isApiErrorResponse } from '@/lib/apiTypes';
import { withErrorHandling } from './apiService';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) {
  console.warn('NEXT_PUBLIC_API_URL is not defined. API calls will likely fail.');
}

// Service function to fetch parcels
async function _fetchParcels(
  filters?: ParcelFilters & { page?: number; pageSize?: number; customerCode?: string }
): Promise<ParcelListResponse> { // This is the type for the 'data' field
  const params: Record<string, string> = {
    page: String(filters?.page || 1),
    pageSize: String(filters?.pageSize || 10),
  };
  // Add filters to params as before
  if (filters?.status && filters.status !== 'all') params.status = filters.status;
  if (filters?.paymentStatus && filters.paymentStatus !== 'all') params.paymentStatus = filters.paymentStatus;
  if (filters?.trackingNo) params.trackingNo = filters.trackingNo;
  if (filters?.dateFrom) params.dateFrom = filters.dateFrom;
  if (filters?.dateTo) params.dateTo = filters.dateTo;
  if (filters?.customerCode) params.customerName = filters.customerCode;
  if (filters?.search) params.trackingNo = filters.search;

  const queryString = new URLSearchParams(params).toString();
  const url = `${API_BASE_URL || ''}/api/orders/orders?${queryString}`;

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    const apiResponse: ApiResponse<ParcelListResponse> = await res.json();
    if (!res.ok || isApiErrorResponse(apiResponse)) {
      const errorResponse = apiResponse as ApiErrorResponse;
      throw new Error(errorResponse.developerMessage || `HTTP error ${res.status} (no developer message)`);
    }

    return (apiResponse as ApiSuccessResponse<ParcelListResponse>).resultData;

  } catch (error) {
    // Log specific service error and re-throw for the wrapper to catch
    // If error is already Error instance with developerMessage, it will propagate
    // If it's a new error from this block (e.g. network error before res.json()), it's caught.
    console.error('[_fetchParcels service error]:', error instanceof Error ? error.message : error);
    throw error; // Re-throw for withErrorHandling
  }
}

// Service function to update parcel status
async function _updateParcelStatus(
  id: string,
  status: Parcel['status'],
  notify: boolean = true
): Promise<Parcel> { // This is the type for the 'data' field
  const url = `${API_BASE_URL || ''}/api/admin/parcel/${id}/status`;
  const body = { status, notify };

  try {
    const res = await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(body),
    });

    const apiResponse: ApiResponse<Parcel> = await res.json();

    if (!res.ok || isApiErrorResponse(apiResponse)) {
      const errorResponse = apiResponse as ApiErrorResponse;
      throw new Error(errorResponse.developerMessage || `HTTP error ${res.status} (no developer message)`);
    }

    return (apiResponse as ApiSuccessResponse<Parcel>).resultData;

  } catch (error) {
    console.error('[_updateParcelStatus service error]:', error instanceof Error ? error.message : error);
    throw error; // Re-throw for withErrorHandling
  }
}

// Service function to fetch a single parcel by ID
async function _fetchParcelById(id: string): Promise<Parcel> { // This is the type for the 'data' field
  const url = `${API_BASE_URL || ''}/api/orders/orders/${id}`;

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    const apiResponse: ApiResponse<Parcel> = await res.json();

    if (!res.ok || isApiErrorResponse(apiResponse)) {
      const errorResponse = apiResponse as ApiErrorResponse;
      throw new Error(errorResponse.developerMessage || `HTTP error ${res.status} (no developer message)`);
    }

    return (apiResponse as ApiSuccessResponse<Parcel>).resultData;

  } catch (error) {
    console.error('[_fetchParcelById service error]:', error instanceof Error ? error.message : error);
    throw error; // Re-throw for withErrorHandling
  }
}

// เพิ่ม interface สำหรับ request body
interface CreateOrderPayload {
  orderNo: string;
  customerName: string;
  description: string;
  pack: number;
  weight: number;
  length: number;
  width: number;
  height: number;
  cbm: number;
  transportation: string;
  cabinetCode: string;
  estimate: string;
  status: string;
  tracking: string;
  trackingTh: string | null;
  receiptNumber: string | null;
  shippingCost: number | null;
  shippingRates: number | null;
  picture: string | null;
  orderDate: string;
}

interface BulkCreateOrdersPayload {
  orders: CreateOrderPayload[];
}

// เพิ่มฟังก์ชันใหม่
async function _createOrders(orders: CreateOrderPayload[]): Promise<ApiResponse<any>> {
  try {
    const url = `${API_BASE_URL || ''}/api/orders/orders`;

    // Get token from cookie
    const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
    if (!token) {
      throw new Error('No authentication token found');
    }

    const payload: BulkCreateOrdersPayload = {
      orders: orders.map(order => ({
        ...order,
        // แปลงค่าตัวเลขให้เป็น number
        pack: Number(order.pack),
        weight: Number(order.weight),
        length: Number(order.length),
        width: Number(order.width),
        height: Number(order.height),
        cbm: Number(order.cbm),
        shippingCost: order.shippingCost ? Number(order.shippingCost) : null,
        shippingRates: order.shippingRates ? Number(order.shippingRates) : null,
        // แปลงวันที่ให้อยู่ในรูปแบบ YYYY-MM-DD
        orderDate: new Date(order.orderDate).toISOString().split('T')[0],
        estimate: new Date(order.estimate).toISOString().split('T')[0]
      }))
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include',
      body: JSON.stringify(payload)
    });

    const apiResponse: ApiResponse<any> = await res.json();

    if (!res.ok || isApiErrorResponse(apiResponse)) {
      const errorResponse = apiResponse as ApiErrorResponse;
      throw new Error(errorResponse.developerMessage || `HTTP error ${res.status}`);
    }

    return apiResponse;

  } catch (error) {
    console.error('[_createOrders service error]:', error instanceof Error ? error.message : error);
    throw error;
  }
}

// Export wrapped functions
export const fetchParcels = withErrorHandling(_fetchParcels);
export const updateParcelStatus = withErrorHandling(_updateParcelStatus);
export const fetchParcelById = withErrorHandling(_fetchParcelById);
export const createOrders = withErrorHandling(_createOrders);
