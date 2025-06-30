import type {
  Customer,
  CustomerQuery,
  CreateCustomerPayload,
  UpdateCustomerPayload,
  CustomerListResponse,
  SimpleSuccessMessage, // Import from types
} from '@/lib/types';
import type { ApiResponse, ApiSuccessResponse, ApiErrorResponse } from '@/lib/apiTypes';
import { isApiErrorResponse } from '@/lib/apiTypes';
import { withErrorHandling } from './apiService';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) {
  console.warn('NEXT_PUBLIC_API_URL is not defined. API calls will likely fail.');
}

async function _fetchCustomers(filters?: CustomerQuery): Promise<CustomerListResponse> {
  try {
    const params = new URLSearchParams();
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.search) params.append('search', filters.search);
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);

    const queryString = params.toString();
    const url = `${API_BASE_URL || ''}/api/admin/users${queryString ? `?${queryString}` : ''}`;

    // Get token from cookie
    const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
    if (!token) {
      throw new Error('No authentication token found');
    }

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include',
    });

    const apiResponse: ApiResponse<CustomerListResponse> = await res.json();

    if (!res.ok || isApiErrorResponse(apiResponse)) {
      const errorResponse = apiResponse as ApiErrorResponse;
      throw new Error(errorResponse.developerMessage || `Failed to fetch customers: HTTP ${res.status}`);
    }
    return (apiResponse as ApiSuccessResponse<CustomerListResponse>).resultData;
  } catch (error) {
    console.error('[_fetchCustomers service error]:', error instanceof Error ? error.message : error);
    throw error;
  }
}

async function _addCustomer(customerData: CreateCustomerPayload): Promise<Customer> {
  try {
    const url = `${API_BASE_URL || ''}/api/admin/users`;

    // Get token from cookie
    const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
    if (!token) {
      throw new Error('No authentication token found');
    }

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include',
      body: JSON.stringify(customerData),
    });

    const apiResponse: ApiResponse<Customer> = await res.json();

    if (!res.ok || isApiErrorResponse(apiResponse)) {
      const errorResponse = apiResponse as ApiErrorResponse;
      throw new Error(errorResponse.developerMessage || `Failed to add customer: HTTP ${res.status}`);
    }
    return (apiResponse as ApiSuccessResponse<Customer>).resultData;
  } catch (error) {
    console.error('[_addCustomer service error]:', error instanceof Error ? error.message : error);
    throw error;
  }
}

async function _fetchCustomerById(customerId: number): Promise<Customer> {
  try {
    const url = `${API_BASE_URL || ''}/api/admin/users/${customerId}`;

    // Get token from cookie
    const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
    if (!token) {
      throw new Error('No authentication token found');
    }

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include',
    });

    const apiResponse: ApiResponse<Customer> = await res.json();

    if (!res.ok || isApiErrorResponse(apiResponse)) {
      const errorResponse = apiResponse as ApiErrorResponse;
      throw new Error(errorResponse.developerMessage || `Failed to fetch customer: HTTP ${res.status}`);
    }
    return (apiResponse as ApiSuccessResponse<Customer>).resultData;
  } catch (error) {
    console.error('[_fetchCustomerById service error]:', error instanceof Error ? error.message : error);
    throw error;
  }
}

async function _updateCustomer(customerId: number, customerData: UpdateCustomerPayload): Promise<Customer> {
  try {
    // First, fetch the current customer data
    const currentCustomer = await _fetchCustomerById(customerId);

    const url = `${API_BASE_URL || ''}/api/admin/users/${customerId}`;

    // Get token from cookie
    const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
    if (!token) {
      throw new Error('No authentication token found');
    }

    // Merge current data with updates
    const updatedData = {
      ...currentCustomer,
      ...customerData,
    };

    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include',
      body: JSON.stringify(updatedData),
    });

    const apiResponse: ApiResponse<Customer> = await res.json();

    if (!res.ok || isApiErrorResponse(apiResponse)) {
      const errorResponse = apiResponse as ApiErrorResponse;
      throw new Error(errorResponse.developerMessage || `Failed to update customer: HTTP ${res.status}`);
    }
    return (apiResponse as ApiSuccessResponse<Customer>).resultData;
  } catch (error) {
    console.error('[_updateCustomer service error]:', error instanceof Error ? error.message : error);
    throw error;
  }
}

async function _deleteCustomer(customerId: string): Promise<SimpleSuccessMessage> {
  try {
    const url = `${API_BASE_URL || ''}/api/admin/users/${customerId}`;

    // Get token from cookie
    const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
    if (!token) {
      throw new Error('No authentication token found');
    }

    const res = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include',
    });

    const apiResponse: ApiResponse<SimpleSuccessMessage> = await res.json();

    if (!res.ok || isApiErrorResponse(apiResponse)) {
      const errorResponse = apiResponse as ApiErrorResponse;
      throw new Error(errorResponse.developerMessage || `Failed to delete customer: HTTP ${res.status}`);
    }
    return (apiResponse as ApiSuccessResponse<SimpleSuccessMessage>).resultData;
  } catch (error) {
    console.error('[_deleteCustomer service error]:', error instanceof Error ? error.message : error);
    throw error;
  }
}

async function _resetPassword(customerId: string): Promise<SimpleSuccessMessage> {
  try {
    const url = `${API_BASE_URL || ''}/api/admin/users/${customerId}/reset-password`;

    // Get token from cookie
    const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
    if (!token) {
      throw new Error('No authentication token found');
    }

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include',
    });

    const apiResponse: ApiResponse<SimpleSuccessMessage> = await res.json();

    if (!res.ok || isApiErrorResponse(apiResponse)) {
      const errorResponse = apiResponse as ApiErrorResponse;
      throw new Error(errorResponse.developerMessage || `Failed to reset password: HTTP ${res.status}`);
    }
    return (apiResponse as ApiSuccessResponse<SimpleSuccessMessage>).resultData;
  } catch (error) {
    console.error('[_resetPassword service error]:', error instanceof Error ? error.message : error);
    throw error;
  }
}

// --- Export Wrapped Functions ---
export const fetchCustomers = withErrorHandling(_fetchCustomers);
export const addCustomer = withErrorHandling(_addCustomer);
export const updateCustomer = withErrorHandling(_updateCustomer);
export const deleteCustomer = withErrorHandling(_deleteCustomer);
export const resetPassword = withErrorHandling(_resetPassword);
export const fetchCustomerById = withErrorHandling(_fetchCustomerById);
