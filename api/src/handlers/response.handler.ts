import { FastifyReply } from 'fastify';
import { BaseResponse, BaseResponseKey, ApiResponse } from '../common/responses';

// Helper to determine HTTP status code from BaseResponseKey or specific conditions
const getStatusCode = (key: BaseResponseKey, data?: any): number => {
  switch (key) {
    case 'success':
      return data ? 200 : 204; // 200 if data, 204 if no content but still success
    case 'created':
      return 201;
    case 'validationFail':
      return 400;
    case 'unauthorized':
      return 401;
    case 'forbidden':
      return 403;
    case 'notFound':
      return 404;
    case 'conflict':
      return 409;
    case 'internalError':
    default:
      return 500;
  }
};

export function sendSuccess<T = null>(
  reply: FastifyReply,
  data?: T,
  messageKey: BaseResponseKey = 'success',
  customMessage?: string
): void {
  const responseTemplate = BaseResponse[messageKey] || BaseResponse.success; // Fallback to success
  const statusCode = getStatusCode(messageKey, data);

  const responsePayload: ApiResponse<T> = {
    resultCode: responseTemplate.resultCode,
    resultStatus: responseTemplate.resultStatus,
    developerMessage: customMessage || responseTemplate.developerMessage,
  };

  if (data !== undefined) {
    responsePayload.resultData = data;
  }

  reply.status(statusCode).send(responsePayload);
}

export function sendError(
  reply: FastifyReply,
  messageKey: BaseResponseKey,
  error?: Error | unknown, // Accept unknown for broader compatibility
  customMessage?: string,
  additionalErrorDetails?: any
): void {
  const responseTemplate = BaseResponse[messageKey] || BaseResponse.internalError; // Fallback to internalError
  const statusCode = getStatusCode(messageKey);

  // Log the actual error for server-side debugging, especially for internal errors
  if (error) {
    // Fastify's logger can be accessed via reply.request.log or if the handler is part of a plugin, this.log
    // For a generic utility, console.error is a fallback. In a real app, inject or use Fastify's logger.
    console.error(`[ErrorHandler] Key: ${messageKey}, Status: ${statusCode}, Error:`, error);
  } else {
    console.error(`[ErrorHandler] Key: ${messageKey}, Status: ${statusCode}, CustomMessage: ${customMessage || responseTemplate.developerMessage}`);
  }


  const responsePayload: ApiResponse<null> = {
    resultCode: responseTemplate.resultCode,
    resultStatus: responseTemplate.resultStatus,
    developerMessage: customMessage || responseTemplate.developerMessage,
  };

  if (additionalErrorDetails) {
    responsePayload.errorDetails = additionalErrorDetails;
  } else if (error instanceof Error && messageKey === 'validationFail') {
    // Simple example: include error message for validation fail
    // In a real app, you might have a structured error object from a validation library
    responsePayload.errorDetails = { message: error.message };
  } else if (error instanceof Error && process.env.NODE_ENV !== 'production' && messageKey === 'internalError') {
      // Optionally include stack in non-production for internal errors
      responsePayload.errorDetails = { message: error.message, stack: error.stack };
  }


  reply.status(statusCode).send(responsePayload);
}
