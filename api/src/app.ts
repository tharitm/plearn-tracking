import Fastify, { FastifyError, FastifyRequest, FastifyReply } from 'fastify';
import registerAllRoutes from './routes/routes'; // Import the new central router
import { sendError } from './handlers/response.handler'; // Import sendError
import { BaseResponse } from './common/responses'; // To access resultCode for logging

const app = Fastify({
  logger: true, // Keep Fastify's built-in logger
});

// Global Error Handler
app.setErrorHandler((error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
  // Log the error using Fastify's built-in logger
  // request.log.error(error); // Already logged by Fastify by default usually

  // Determine the BaseResponseKey
  // If the error has a statusCode property (e.g. from Boom, or custom error classes),
  // we could map it to a BaseResponseKey.
  // For now, default to 'internalError' for unhandled errors.
  // Validation errors from schemas are typically handled before this point,
  // but if one slips through or is a different kind of error:
  if (error.validation) {
    // Fastify's validation errors have a 'validation' property
    sendError(reply, 'validationFail', error, 'Input validation failed.', error.validation);
  } else if (error.statusCode && error.statusCode === 404) {
    sendError(reply, 'notFound', error, error.message || 'Resource not found.');
  } else if (error.statusCode && error.statusCode >= 400 && error.statusCode < 500) {
    // For other client-side errors that might be thrown by plugins/hooks
    // It's harder to map these to a specific BaseResponseKey without more context
    // Defaulting to a generic client error or using internalError with the specific message
    const clientErrorKey = 'validationFail'; // Or a more generic 'badRequest' if defined in BaseResponse
    const responseTemplate = BaseResponse[clientErrorKey];
    reply.status(error.statusCode).send({
        resultCode: responseTemplate.resultCode,
        resultStatus: responseTemplate.resultStatus,
        developerMessage: error.message || responseTemplate.developerMessage,
        errorDetails: { originalStatus: error.statusCode }
    });
  }
  else {
    // For all other errors, treat as internal server error
    sendError(reply, 'internalError', error, error.message || 'An unexpected error occurred.');
  }
});

// Register all application routes under the /api prefix
app.register(registerAllRoutes, { prefix: '/api' });

app.get('/', async (request, reply) => {
  // This route is outside the error handler's direct reply modification
  // unless an error occurs within it.
  return { hello: 'world' };
});

export default app;
