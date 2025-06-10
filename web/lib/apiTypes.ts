export interface ApiErrorResponse {
  resultCode: number;
  resultStatus: string;
  developerMessage: string;
  // According to the user feedback, ApiErrorResponse does not have a 'data' field.
}

export interface ApiSuccessResponse<T> {
  resultCode: number;
  resultStatus: string;
  developerMessage: string;
  resultData: T;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export function isApiErrorResponse<T>(response: ApiResponse<T>): response is ApiErrorResponse {
  return !('resultData' in response) || (response.resultCode >= 40000 && response.resultCode < 60000);
}
