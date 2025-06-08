export interface BaseResponse<T = any> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  error?: {
    code?: string;
    details?: any;
  };
}
