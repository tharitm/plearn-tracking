export interface ApiErrorResponse {
  resultCode: number;
  resultStatus: string;
  developerMessage: string;
  // According to the user feedback, ApiErrorResponse does not have a 'data' field.
}

export interface ApiSuccessResponse<T> {
  resultCode: number;
  resultStatus: string;
  developerMessage: string; // Success responses can also have a developer message
  data: T;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// Helper type guard to check if the response is an error
export function isApiErrorResponse<T>(response: ApiResponse<T>): response is ApiErrorResponse {
  // Assuming non-successful resultCodes are indicative of errors.
  // Adjust this logic based on your backend's specific resultCode conventions for errors.
  // For example, if errors are always outside the 20000-29999 range or always negative.
  // A common convention is that resultCode >= 20000 && resultCode < 30000 is success.
  // For this example, let's assume any resultCode that isn't 200 (if using HTTP status like codes)
  // or a specific success code (e.g. 0 or 20000) might be an error.
  // The most reliable way is often checking for the presence/absence of the 'data' field
  // if ApiErrorResponse strictly never has it.
  return !('data' in response) || (response.resultCode >= 40000 && response.resultCode < 60000) ; // Example: 4xxxx and 5xxxx are errors
}
