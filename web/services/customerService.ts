import type {
  Customer,
  CustomerQuery,
  CreateCustomerPayload,
  UpdateCustomerPayload,
  CustomerListResponse, // This type includes { data: Customer[], pagination: {...} }
} from '@/lib/types';
import type { ApiResponse, ApiSuccessResponse, ApiErrorResponse } from '@/lib/apiTypes';
import { isApiErrorResponse } from '@/lib/apiTypes';
import { withErrorHandling } from './apiService';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) {
  // This warning is good for development
  console.warn('NEXT_PUBLIC_API_URL is not defined. API calls will likely fail.');
}

// --- Private API Functions ---

async function _fetchCustomers(filters?: CustomerQuery): Promise<CustomerListResponse> {
  const params = new URLSearchParams();
  if (filters?.page) params.append('page', filters.page.toString());
  if (filters?.limit) params.append('limit', filters.limit.toString());
  if (filters?.name) params.append('name', filters.name);
  if (filters?.email) params.append('email', filters.email);
  if (filters?.status) params.append('status', filters.status);
  if (filters?.sortBy) params.append('sortBy', filters.sortBy);
  if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);

  const queryString = params.toString();
  const url = `${API_BASE_URL || ''}/api/users${queryString ? `?${queryString}` : ''}`;

  const res = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  const apiResponse: ApiResponse<CustomerListResponse> = await res.json();

  if (!res.ok || isApiErrorResponse(apiResponse)) {
    const errorResponse = apiResponse as ApiErrorResponse; // Type assertion
    throw new Error(errorResponse.developerMessage || `Failed to fetch customers: HTTP ${res.status}`);
  }
  // Backend returns CustomerListResponse directly within resultData if sendSuccess wraps it.
  // If sendSuccess returns { data: CustomerListResponse, ...}, then it's apiResponse.data.
  // Based on previous controller work, the structure is { data: Customer[], pagination: {...} }
  // This structure IS CustomerListResponse.
  // And sendSuccess wraps THIS in the ApiSuccessResponse envelope.
  // So, (apiResponse as ApiSuccessResponse<CustomerListResponse>).resultData IS CustomerListResponse
  return (apiResponse as ApiSuccessResponse<CustomerListResponse>).resultData;
}

async function _addCustomer(customerData: CreateCustomerPayload): Promise<Customer> {
  const url = `${API_BASE_URL || ''}/api/users`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(customerData),
  });

  const apiResponse: ApiResponse<Customer> = await res.json();

  if (!res.ok || isApiErrorResponse(apiResponse)) {
    const errorResponse = apiResponse as ApiErrorResponse;
    throw new Error(errorResponse.developerMessage || `Failed to add customer: HTTP ${res.status}`);
  }
  return (apiResponse as ApiSuccessResponse<Customer>).resultData;
}

async function _updateCustomer(customerId: string, customerData: UpdateCustomerPayload): Promise<Customer> {
  const url = `${API_BASE_URL || ''}/api/users/${customerId}`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(customerData),
  });

  const apiResponse: ApiResponse<Customer> = await res.json();

  if (!res.ok || isApiErrorResponse(apiResponse)) {
    const errorResponse = apiResponse as ApiErrorResponse;
    throw new Error(errorResponse.developerMessage || `Failed to update customer: HTTP ${res.status}`);
  }
  return (apiResponse as ApiSuccessResponse<Customer>).resultData;
}

// Assuming the backend DELETE returns a simple success message structure within resultData
// e.g. { success: true, message: "User marked as inactive" }
// Let's define a simple type for this if not already present.
interface SimpleSuccessMessage {
  success: boolean;
  message: string;
}

async function _deleteCustomer(customerId: string): Promise<SimpleSuccessMessage> {
  const url = `${API_BASE_URL || ''}/api/users/${customerId}`;
  const res = await fetch(url, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  const apiResponse: ApiResponse<SimpleSuccessMessage> = await res.json();

  if (!res.ok || isApiErrorResponse(apiResponse)) {
    const errorResponse = apiResponse as ApiErrorResponse;
    throw new Error(errorResponse.developerMessage || `Failed to delete customer: HTTP ${res.status}`);
  }
  return (apiResponse as ApiSuccessResponse<SimpleSuccessMessage>).resultData;
}

async function _resetPassword(customerId: string): Promise<SimpleSuccessMessage> {
  const url = `${API_BASE_URL || ''}/api/users/${customerId}/reset-password`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  const apiResponse: ApiResponse<SimpleSuccessMessage> = await res.json();

  if (!res.ok || isApiErrorResponse(apiResponse)) {
    const errorResponse = apiResponse as ApiErrorResponse;
    throw new Error(errorResponse.developerMessage || `Failed to reset password: HTTP ${res.status}`);
  }
  return (apiResponse as ApiSuccessResponse<SimpleSuccessMessage>).resultData;
}

// --- Export Wrapped Functions ---
export const fetchCustomers = withErrorHandling(_fetchCustomers);
export const addCustomer = withErrorHandling(_addCustomer);
export const updateCustomer = withErrorHandling(_updateCustomer);
export const deleteCustomer = withErrorHandling(_deleteCustomer);
export const resetPassword = withErrorHandling(_resetPassword);
