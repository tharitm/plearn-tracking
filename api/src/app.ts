import Fastify, { FastifyReply, FastifyRequest, FastifyError } from 'fastify';
import { ResponseHandler } from './utils/response.handler';
import { BaseResponse } from './constants/baseResponse';
import registerRoutes from './routes'; // This will point to src/routes/index.ts

const app = Fastify({
  logger: true,
});

// Hook for formatting successful responses
// The `preSerialization` hook is suitable for modifying the payload before it's serialized and sent.
app.addHook('preSerialization', async (request: FastifyRequest, reply: FastifyReply, payload: any): Promise<BaseResponse<any>> => {
  // We only want to format successful responses that haven't been formatted yet.
  // Errors are handled by the `setErrorHandler` or `onError` hook.
  // If the payload is already a BaseResponse, don't re-format.
  if (payload && payload.success !== undefined && payload.statusCode !== undefined) {
    return payload;
  }

  // If a route specifically used ResponseHandler.success/error, reply.sent would be true.
  // However, controllers now return raw data, so reply.sent will be false here.
  // The `payload` here is the raw data returned by the controller.

  let message = 'Success'; // Default message
  // You could potentially customize the message based on the request or a property in the payload
  // For example, if payload had a `message` property.

  // If the original handler set a specific status code (e.g. 201 for created),
  // we should honor that. Otherwise, default to 200.
  const statusCode = reply.statusCode >= 200 && reply.statusCode < 300 ? reply.statusCode : 200;


  return ResponseHandler.formatResponse(payload, statusCode, message);
});

// Hook for handling errors
app.setErrorHandler((error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
  request.log.error(error); // Log the original error

  const statusCode = error.statusCode || 500;
  const message = error.message || 'An unexpected error occurred';

  // Use ResponseHandler.error to send a standardized error response
  ResponseHandler.error(reply, statusCode, message, error.code, error);
});


// Register all routes from the routes directory
// All routes will be prefixed with /api
app.register(registerRoutes, { prefix: '/api' });


// Example root route - this will also be formatted by the preSerialization hook
app.get('/', async (request, reply) => {
  return { message: 'Welcome to the API' }; // Return raw data
});

// Simple health check route, also formatted
app.get('/health', async (request, reply) => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

export default app;
