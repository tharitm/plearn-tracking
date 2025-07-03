import type { ApiResponse, ApiSuccessResponse, ApiErrorResponse } from '@/lib/apiTypes';
import { isApiErrorResponse } from '@/lib/apiTypes';
import { withErrorHandling } from './apiService';

// Remove API_BASE_URL since we'll use relative paths
// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface User {
  id: number;
  customerCode: string;
  username: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  role: string;
}

interface AuthResponse {
  id: number;
  customerCode: string;
  username: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  role: string;
}

interface UserProfileResponse {
  id: number;
  customerCode: string;
  username: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  role: string;
}

async function _login(username: string, password: string): Promise<User> {
  const url = '/api/auth/login';  // Use relative path
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // Important for cookies
      body: JSON.stringify({ customerCode: username, password }),
    });

    const apiResponse: ApiResponse<AuthResponse> = await res.json();

    if (!res.ok || isApiErrorResponse(apiResponse)) {
      const errorResponse = apiResponse as ApiErrorResponse; // Type assertion
      throw new Error(errorResponse.developerMessage || `HTTP error ${res.status}`);
    }
    const resultData = (apiResponse as ApiSuccessResponse<AuthResponse>).resultData;
    return {
      id: resultData.id,
      customerCode: resultData.customerCode,
      username: resultData.username,
      name: resultData.name,
      phone: resultData.phone,
      email: resultData.email,
      address: resultData.address,
      role: resultData.role,
    };

  } catch (error) {
    console.error('[_login service error]:', error instanceof Error ? error.message : error);
    throw error;
  }
}

async function _logout(): Promise<void> {
  const url = '/api/logout';  // Use relative path
  try {
    const res = await fetch(url, {
      method: 'POST', // or 'GET', depending on your API
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // Important for cookies
    });

    // Even if logout fails on the server, we should probably proceed with client-side logout.
    // However, logging an error is good.
    if (!res.ok) {
      // Attempt to parse error only if response indicates failure and is JSON
      try {
        const apiResponse: ApiErrorResponse = await res.json();
        console.error('Logout API error:', apiResponse.developerMessage || `HTTP error ${res.status}`);
        // Potentially throw new Error(apiResponse.developerMessage) if strict server logout is required
      } catch (e) {
        // If parsing fails or it's not JSON, log the status text
        console.error('Logout API error:', res.statusText || `HTTP error ${res.status}`);
      }
    }
    // No specific data is expected on successful logout usually.
  } catch (error) {
    // Network errors or other issues
    console.error('[_logout service error]:', error instanceof Error ? error.message : error);
    // Depending on policy, you might want to re-throw or ensure client logout still happens.
  }
}

async function _fetchUserProfile(userId: number): Promise<UserProfileResponse> {
  const url = `/api/admin/users/${userId}`;  // Use relative path
  try {
    const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
    if (!token) {
      throw new Error('No authentication token found');
    }
    const res = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      credentials: 'include',
    });

    const apiResponse: ApiResponse<UserProfileResponse> = await res.json();

    if (!res.ok || isApiErrorResponse(apiResponse)) {
      const errorResponse = apiResponse as ApiErrorResponse;
      throw new Error(errorResponse.developerMessage || `HTTP error ${res.status}`);
    }

    return (apiResponse as ApiSuccessResponse<UserProfileResponse>).resultData;
  } catch (error) {
    console.error('[_fetchUserProfile service error]:', error instanceof Error ? error.message : error);
    throw error;
  }
}

export const login = withErrorHandling(_login);
export const logout = withErrorHandling(_logout);
export const fetchUserProfile = withErrorHandling(_fetchUserProfile);
