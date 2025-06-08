import { FastifyReply } from 'fastify';
import { BaseResponse } from '../constants/baseResponse';

export class ResponseHandler {
  public static success<T>(
    reply: FastifyReply,
    statusCode: number,
    message: string,
    data?: T
  ): void {
    const response: BaseResponse<T> = {
      success: true,
      statusCode,
      message,
      data,
    };
    reply.status(statusCode).send(response);
  }

  public static error(
    reply: FastifyReply,
    statusCode: number,
    message: string,
    errorCode?: string,
    errorDetails?: any
  ): void {
    const response: BaseResponse<null> = {
      success: false,
      statusCode,
      message,
      error: {
        code: errorCode,
        details: errorDetails,
      },
    };
    reply.status(statusCode).send(response);
  }

  // This method will be used by the preSerialization hook or a custom reply.send decorator
  public static formatResponse<T>(
    payload: T,
    statusCode: number = 200, // Default success status code
    message: string = 'Success' // Default success message
  ): BaseResponse<T> {
    if (payload instanceof Error) {
      // This case should ideally be handled by a global error handler,
      // but as a fallback, we format it as an error response.
      return {
        success: false,
        statusCode: (payload as any).statusCode || 500,
        message: payload.message || 'An unexpected error occurred',
        error: {
          code: (payload as any).code,
          details: (payload as any).details,
        },
      };
    }
    return {
      success: true,
      statusCode,
      message,
      data: payload,
    };
  }

  // Helper to be used in hooks or decorators
  public static sendFormattedResponse<T>(
    reply: FastifyReply,
    payload: T,
    defaultStatusCode: number = 200,
    defaultMessage: string = 'Success'
  ): void {
    if (payload instanceof Error) {
      // Extract status code from error if available, otherwise default to 500
      const statusCode = (payload as any).statusCode || 500;
      ResponseHandler.error(reply, statusCode, payload.message, (payload as any).code, (payload as any).details);
    } else {
      // Determine the status code: if payload has a statusCode property, use it, otherwise use defaultStatusCode
      const responseStatusCode = (payload as any)?.statusCode || defaultStatusCode;
      ResponseHandler.success(reply, responseStatusCode, defaultMessage, payload);
    }
  }
}
