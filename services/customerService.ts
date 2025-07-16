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

async function _fetchCustomers(params: CustomerQuery): Promise<CustomerListResponse> {
  const url = '/api/admin/users';

  // Clean up undefined values and create query string
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([_, value]) => value !== undefined && value !== '')
  );
  const queryString = new URLSearchParams(cleanParams).toString();
  const finalUrl = queryString ? `${url}?${queryString}` : url;

  try {
    // Get token from cookie
    const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
    if (!token) {
      throw new Error('No authentication token found');
    }

    const res = await fetch(finalUrl, {
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
    const url = '/api/admin/users';

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
    const url = `/api/admin/users/${customerId}`;

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

    const url = `/api/admin/users/${customerId}`;

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

async function _deleteCustomer(customerId: number): Promise<SimpleSuccessMessage> {
  try {
    const url = `/api/admin/users/${customerId}`;

    // Get token from cookie
    const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
    if (!token) {
      throw new Error('No authentication token found');
    }

    const res = await fetch(url, {
      method: 'DELETE',
      headers: {
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

async function _resetPassword(customerId: number, newPassword: string): Promise<SimpleSuccessMessage> {
  try {
    const url = `/api/admin/users/${customerId}/reset-password`;

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
      body: JSON.stringify({ newPassword }),
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
