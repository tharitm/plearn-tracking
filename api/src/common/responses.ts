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
    resultCode: 20000,
    resultStatus: 'Success',
    developerMessage: 'Request processed successfully.',
  },
  created: {
    resultCode: 20100,
    resultStatus: 'Created',
    developerMessage: 'Resource created successfully.',
  },
  validationFail: {
    resultCode: 40000,
    resultStatus: 'Validation failed',
    developerMessage: 'Invalid input data. Please check the provided values.',
  },
  notFound: {
    resultCode: 40400,
    resultStatus: 'Not found',
    developerMessage: 'The requested resource was not found.',
  },
  conflict: {
    resultCode: 40900,
    resultStatus: 'Conflict',
    developerMessage: 'A conflict occurred, such as a duplicate entry or state mismatch.',
  },
  unauthorized: {
    resultCode: 40100,
    resultStatus: 'Unauthorized',
    developerMessage: 'Authentication failed or is required.',
  },
  forbidden: {
    resultCode: 40300,
    resultStatus: 'Forbidden',
    developerMessage: 'You do not have permission to access this resource or perform this action.',
  },
  internalError: {
    resultCode: 50000,
    resultStatus: 'Internal error',
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
