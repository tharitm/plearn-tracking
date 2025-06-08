export const BaseResponse = {
  success: {
    resultCode: 0,
    resultStatus: 'SUCCESS',
    developerMessage: 'Request processed successfully.',
  },
  created: { // Often useful for POST requests that create resources
    resultCode: 0, // Or a specific code like 0 for general success, or 1 if differentiating
    resultStatus: 'CREATED',
    developerMessage: 'Resource created successfully.',
  },
  validationFail: {
    resultCode: 1001,
    resultStatus: 'VALIDATION_FAIL',
    developerMessage: 'Invalid input data. Please check the provided values.',
  },
  notFound: { // For GET /resource/:id where ID doesn't exist
    resultCode: 1002,
    resultStatus: 'NOT_FOUND',
    developerMessage: 'The requested resource was not found.',
  },
  // Example: Error due to business logic, e.g., duplicate entry
  conflict: {
    resultCode: 1003,
    resultStatus: 'CONFLICT_ERROR',
    developerMessage: 'A conflict occurred, such as a duplicate entry or state mismatch.',
  },
  // Example: Unauthorized access
  unauthorized: {
    resultCode: 1004,
    resultStatus: 'UNAUTHORIZED',
    developerMessage: 'Authentication failed or is required.',
  },
  // Example: Forbidden access
  forbidden: {
    resultCode: 1005,
    resultStatus: 'FORBIDDEN',
    developerMessage: 'You do not have permission to access this resource or perform this action.',
  },
  internalError: {
    resultCode: 2001,
    resultStatus: 'INTERNAL_ERROR',
    developerMessage: 'An unexpected internal error occurred. Please try again later.',
  },
  // Add more common responses as needed
  // e.g. badRequest, serviceUnavailable, etc.
} as const;

export type BaseResponseKey = keyof typeof BaseResponse;

// Interface for the actual response payload that will be sent
export interface ApiResponse<T = null> {
  resultCode: number;
  resultStatus: string;
  developerMessage: string;
  resultData?: T; // Generic type for actual data
  errorDetails?: any; // For additional error info, e.g., validation errors list
}
