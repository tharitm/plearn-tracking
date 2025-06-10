import type { Parcel, ParcelFilters, ParcelListResponse } from '@/lib/types';
import { withErrorHandling } from './apiService'; // Adjusted path

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) {
  // Consider throwing an error here or handling it more gracefully
  // For now, console.warn is kept.
  console.warn('NEXT_PUBLIC_API_URL is not defined. API calls will likely fail.');
}

// Original function (now "private" by convention with underscore)
async function _fetchParcels(
  filters?: ParcelFilters & { page?: number; pageSize?: number; customerCode?: string }
): Promise<ParcelListResponse> {
  const params: Record<string, string> = {
    page: String(filters?.page || 1),
    pageSize: String(filters?.pageSize || 10),
  };

  // Add filters to params
  if (filters?.status && filters.status !== 'all') {
    params.status = filters.status;
  }
  if (filters?.paymentStatus && filters.paymentStatus !== 'all') {
    params.paymentStatus = filters.paymentStatus;
  }
  if (filters?.trackingNo) {
    params.trackingNo = filters.trackingNo;
  }
  if (filters?.dateFrom) {
    params.dateFrom = filters.dateFrom;
  }
  if (filters?.dateTo) {
    params.dateTo = filters.dateTo;
  }
  if (filters?.customerCode) {
    params.customerCode = filters.customerCode;
  }
  if (filters?.search) {
    // Assuming 'search' maps to 'trackingNo' based on original code
    params.trackingNo = filters.search;
  }

  const queryString = new URLSearchParams(params).toString();
  // Ensure API_BASE_URL is actually defined before making the call
  const url = `${API_BASE_URL || ''}/api/parcel?${queryString}`;

  // The try/catch here is still useful for parsing specific API error messages
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!res.ok) {
      let errorData = { message: `HTTP error ${res.status}: Failed to fetch parcels` };
      try {
        errorData = await res.json();
      } catch (parseError) {
        // Could log parseError if needed, but primary error is HTTP status
      }
      // Ensure a message property exists
      throw new Error(errorData.message || `HTTP error ${res.status}: Failed to fetch parcels`);
    }

    return await res.json() as ParcelListResponse;
  } catch (error) {
    // Log specific service error and re-throw for the wrapper to catch
    console.error('[_fetchParcels specific error]:', error);
    throw error;
  }
}

// Original function (now "private")
async function _updateParcelStatus(
  id: string,
  status: Parcel['status'],
  notify: boolean = true
): Promise<Parcel> {
  const url = `${API_BASE_URL || ''}/api/admin/parcel/${id}/status`;
  const body = {
    status,
    notify,
  };

  try {
    const res = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      let errorData = { message: `HTTP error ${res.status}: Failed to update parcel status` };
      try {
        errorData = await res.json();
      } catch (parseError) {
        // Silent catch for parsing error, focus on HTTP error
      }
      throw new Error(errorData.message || `HTTP error ${res.status}: Failed to update parcel status`);
    }
    return await res.json() as Parcel;
  } catch (error) {
    console.error('[_updateParcelStatus specific error]:', error);
    throw error;
  }
}

// Export wrapped functions
export const fetchParcels = withErrorHandling(_fetchParcels);
export const updateParcelStatus = withErrorHandling(_updateParcelStatus);
