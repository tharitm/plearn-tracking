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

// Export wrapped functions
export const fetchParcels = withErrorHandling(_fetchParcels);
export const updateParcelStatus = withErrorHandling(_updateParcelStatus);
