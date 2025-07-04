import type { Parcel, ParcelFilters, ParcelListResponse } from '@/lib/types';
// Correctly import the new API response structure types
import type { ApiResponse, ApiSuccessResponse, ApiErrorResponse } from '@/lib/apiTypes';
import { isApiErrorResponse } from '@/lib/apiTypes';
import { withErrorHandling } from './apiService';
import { CLOUDINARY_CONFIG } from '@/lib/constants';

// Service function to fetch parcels
async function _fetchParcels(
  filters?: ParcelFilters & { page?: number; pageSize?: number; customerCode?: string }
): Promise<ParcelListResponse> { // This is the type for the 'data' field
  const params: Record<string, string> = {
    page: String(filters?.page || 1),
    pageSize: String(filters?.pageSize || 10),
  };
  if (filters?.status && filters.status !== 'all') params.status = filters.status;
  if (filters?.paymentStatus && filters.paymentStatus !== 'all') params.paymentStatus = filters.paymentStatus;
  if (filters?.trackingNo) params.trackingNo = filters.trackingNo;
  if (filters?.dateFrom) params.dateFrom = filters.dateFrom;
  if (filters?.dateTo) params.dateTo = filters.dateTo;
  if (filters?.customerCode) params.customerName = filters.customerCode;
  if (filters?.customerName) params.customerName = filters.customerName;

  const queryString = new URLSearchParams(params).toString();
  const url = '/api/orders/orders';  // Use relative path
  const finalUrl = queryString ? `${url}?${queryString}` : url;

  try {
    const res = await fetch(finalUrl, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}`);
    }

    const apiResponse: ApiResponse<ParcelListResponse> = await res.json();
    if (!res.ok || isApiErrorResponse(apiResponse)) {
      const errorResponse = apiResponse as ApiErrorResponse;
      throw new Error(errorResponse.developerMessage || `HTTP error ${res.status} (no developer message)`);
    }

    return (apiResponse as ApiSuccessResponse<ParcelListResponse>).resultData;
  } catch (error) {
    console.error('[_fetchParcels service error]:', error instanceof Error ? error.message : error);
    throw error;
  }
}

// Service function to update parcel status
async function _updateParcelStatus(
  id: string,
  status: Parcel['status'] | "",  // Allow empty string
): Promise<Parcel> {
  const url = `/api/orders/orders/${id}/status`;

  // Get token from cookie
  const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
  if (!token) {
    throw new Error('No authentication token found');
  }

  try {
    const res = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include',
      body: JSON.stringify({ status: status === '' ? null : status }),
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
  const url = `/api/orders/orders/${id}`;  // Use relative path

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
export interface CreateOrderPayload {
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
  estimate: string | null;
  status?: string | null;  // Make status optional and nullable
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
async function _createOrders(orders: CreateOrderPayload[]): Promise<Parcel[]> {
  try {
    const url = '/api/orders/orders';  // Use relative path

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
        // แปลง empty string เป็น null
        status: order.status === '' ? null : order.status,
        estimate: order.estimate === '' ? null : order.estimate ? new Date(order.estimate).toISOString().split('T')[0] : null
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

    const apiResponse: ApiResponse<Parcel[]> = await res.json();

    if (!res.ok || isApiErrorResponse(apiResponse)) {
      const errorResponse = apiResponse as ApiErrorResponse;
      throw new Error(errorResponse.developerMessage || `HTTP error ${res.status}`);
    }

    return (apiResponse as ApiSuccessResponse<Parcel[]>).resultData;

  } catch (error) {
    console.error('[_createOrders service error]:', error instanceof Error ? error.message : error);
    throw error;
  }
}

const _updateOrder = async (id: string, data: Partial<Parcel>) => {
  // Get token from cookie
  const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
  if (!token) {
    throw new Error('No authentication token found');
  }

  // แปลง empty string เป็น null
  const processedData = {
    ...data,
    status: data.status === '' ? null : data.status,
    estimate: data.estimate === '' ? null : data.estimate
  };

  const response = await fetch(`/api/orders/orders/${id}`, {  // Use relative path
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    credentials: 'include',
    body: JSON.stringify(processedData),
  });

  if (!response.ok) {
    const error = await response.json();
    if (isApiErrorResponse(error)) {
      throw new Error('Failed to update order');
    }
    throw new Error('Failed to update order');
  }

  return response.json();
};

const _deleteOrder = async (id: string) => {
  // Get token from cookie
  const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
  if (!token) {
    throw new Error('No authentication token found');
  }

  const response = await fetch(`/api/orders/orders/${id}`, {  // Use relative path
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    if (isApiErrorResponse(error)) {
      throw new Error('Failed to delete order');
    }
    throw new Error('Failed to delete order');
  }

  return response.json();
};

// Upload image to Cloudinary directly from browser
export async function uploadToCloudinary(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset!);
  formData.append('folder', CLOUDINARY_CONFIG.folder);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error('Failed to upload image to Cloudinary');
  }

  const data = await response.json();
  return data.secure_url;
}

// Upload multiple images and save to backend
async function _uploadOrderPictures(orderId: string, files: File[], previousImageUrls: string[] = []): Promise<string[]> {
  try {
    // First, upload all images to Cloudinary
    const uploadPromises = files.map(file => uploadToCloudinary(file));
    const imageUrls = await Promise.all(uploadPromises);

    const allImages = [...previousImageUrls, ...imageUrls];
    // Then, save URLs to backend
    const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`/api/orders/orders/${orderId}/upload-pictures`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include',
      body: JSON.stringify({ pictures: allImages }),
    });

    if (!response.ok) {
      throw new Error('Failed to save image URLs to backend');
    }

    const data = await response.json();
    return data.resultData
  } catch (error) {
    console.error('[_uploadOrderPictures service error]:', error);
    throw error;
  }
}

// Export wrapped functions
export const fetchParcels = withErrorHandling(_fetchParcels);
export const updateParcelStatus = withErrorHandling(_updateParcelStatus);
export const fetchParcelById = withErrorHandling(_fetchParcelById);
export const createOrders = withErrorHandling(_createOrders);
export const updateOrder = withErrorHandling(_updateOrder);
export const deleteOrder = withErrorHandling(_deleteOrder);
export const uploadOrderPictures = withErrorHandling(_uploadOrderPictures);
