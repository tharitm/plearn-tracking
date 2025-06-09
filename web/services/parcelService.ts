import type { Parcel, ParcelFilters, ParcelListResponse } from '@/lib/types'; // Assuming types are in @/lib/types

// Ensure NEXT_PUBLIC_API_URL is available.
// It should be defined in .env.local or environment variables for Next.js
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) {
  console.warn('NEXT_PUBLIC_API_URL is not defined. API calls will likely fail.');
}

/**
 * Fetches a list of parcels based on the provided filters and pagination options.
 * Maps to GET /api/parcel
 */
export async function fetchParcels(
  filters?: ParcelFilters & { page?: number; pageSize?: number; customerCode?: string }
): Promise<ParcelListResponse> {
  // Default pagination if not provided
  const params: Record<string, string> = {
    page: String(filters?.page || 1),
    pageSize: String(filters?.pageSize || 10),
  };

  // Add filters to params if they exist
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
    params.dateFrom = filters.dateFrom; // Assuming YYYY-MM-DD format
  }
  if (filters?.dateTo) {
    params.dateTo = filters.dateTo; // Assuming YYYY-MM-DD format
  }
  if (filters?.customerCode) {
    params.customerCode = filters.customerCode;
  }
  // Add 'search' from ParcelFilters if it's meant to be generic search like trackingNo
  if (filters?.search) {
    params.trackingNo = filters.search; // Or map 'search' to a specific backend param if different
  }


  const queryString = new URLSearchParams(params).toString();
  const url = `${API_BASE_URL}/api/parcel?${queryString}`;

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Include credentials if your API expects cookies/auth headers
        // 'Authorization': `Bearer ${your_token_here}`,
      },
      credentials: 'include', // As per issue spec
    });

    if (!res.ok) {
      // Attempt to parse error response from API
      const errorData = await res.json().catch(() => ({ message: 'Failed to fetch parcels and parse error response' }));
      console.error('API Error Response:', errorData);
      throw new Error(errorData.message || `HTTP error ${res.status}: Failed to fetch parcels`);
    }

    // The backend now returns ParcelListResponse structure directly
    const data = await res.json();

    // Transform date strings back to Date objects if necessary, though ParcelListResponse from backend already has strings
    // The `Parcel` type in `lib/types.ts` expects strings for dates, so no transformation needed here
    // if the backend provides them as ISO strings.

    return data as ParcelListResponse;

  } catch (error) {
    debugger
    console.error('fetchParcels error:', error);
    throw error;
  }
}

/**
 * Updates the status of a specific parcel.
 * Maps to PATCH /api/admin/parcel/:id/status
 */
export async function updateParcelStatus(
  id: string,
  status: Parcel['status'], // Use the status type from Parcel interface
  notify: boolean = true // Default notify to true as per issue example
): Promise<Parcel> { // Assuming the API returns the updated parcel
  const url = `${API_BASE_URL}/api/admin/parcel/${id}/status`;
  const body = {
    status,
    notify, // As per issue spec
  };

  try {
    const res = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        // Include credentials/auth if needed
      },
      credentials: 'include', // As per issue spec
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: 'Failed to update parcel status and parse error response' }));
      console.error('API Error Response:', errorData);
      throw new Error(errorData.message || `HTTP error ${res.status}: Failed to update parcel status`);
    }

    // Assuming the backend returns the full updated parcel object matching ParcelCoreType
    const updatedParcel = await res.json();

    // Transform date strings back to Date objects if necessary
    // The `Parcel` type in `lib/types.ts` expects strings for dates.
    // Backend provides ISO strings for dates in ParcelCoreType. So direct cast should be fine.
    return updatedParcel as Parcel;

  } catch (error) {
    console.error('updateParcelStatus error:', error);
    throw error;
  }
}

// Example of how to define NEXT_PUBLIC_API_URL in web/.env.local
// Create a file web/.env.local with the following content:
// NEXT_PUBLIC_API_URL=http://localhost:3001
// (Replace port if your Fastify API runs on a different one)
