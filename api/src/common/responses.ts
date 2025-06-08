export type BaseResponseStatus =
  | 'success'
  | 'created'
  | 'validationFail'
  | 'notFound'
  | 'conflict'
  | 'unauthorized'
  | 'forbidden'
  | 'internalError';

export const BaseResponse: Record<BaseResponseStatus, {
  resultCode: number;
  resultStatus: string;
  developerMessage: string;
}> = {
  success: {
    resultCode: 0,
    resultStatus: 'SUCCESS',
    developerMessage: 'Request processed successfully.',
  },
  created: {
    resultCode: 0,
    resultStatus: 'CREATED',
    developerMessage: 'Resource created successfully.',
  },
  validationFail: {
    resultCode: 1001,
    resultStatus: 'VALIDATION_FAIL',
    developerMessage: 'Invalid input data. Please check the provided values.',
  },
  notFound: {
    resultCode: 1002,
    resultStatus: 'NOT_FOUND',
    developerMessage: 'The requested resource was not found.',
  },
  conflict: {
    resultCode: 1003,
    resultStatus: 'CONFLICT_ERROR',
    developerMessage: 'A conflict occurred, such as a duplicate entry or state mismatch.',
  },
  unauthorized: {
    resultCode: 1004,
    resultStatus: 'UNAUTHORIZED',
    developerMessage: 'Authentication failed or is required.',
  },
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
};

export type BaseResponseKey = keyof typeof BaseResponse;

export interface ApiResponse<T = null> {
  resultCode: number;
  resultStatus: string;
  developerMessage: string;
  resultData?: T;
  errorDetails?: any;
}
