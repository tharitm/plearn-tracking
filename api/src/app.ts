import Fastify, { FastifyError, FastifyRequest, FastifyReply } from 'fastify';
import registerAllRoutes from './routes/routes';
import { sendError } from './handlers/response.handler';
import { BaseResponse } from './common/responses';

const app = Fastify({
  logger: true,
});

app.setErrorHandler((error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
  if (error.validation) {
    sendError(reply, 'validationFail', error, 'Input validation failed.', error.validation);
  } else if (error.statusCode && error.statusCode === 404) {
    sendError(reply, 'notFound', error, error.message || 'Resource not found.');
  } else if (error.statusCode && error.statusCode >= 400 && error.statusCode < 500) {
    const clientErrorKey = 'validationFail';
    const responseTemplate = BaseResponse[clientErrorKey];
    reply.status(error.statusCode).send({
      resultCode: responseTemplate.resultCode,
      resultStatus: responseTemplate.resultStatus,
      developerMessage: error.message || responseTemplate.developerMessage,
      errorDetails: { originalStatus: error.statusCode }
    });
  }
  else {
    sendError(reply, 'internalError', error, error.message || 'An unexpected error occurred.');
  }
});

app.register(registerAllRoutes, { prefix: '/api' });

app.get('/', async (request, reply) => {
  return { hello: 'world' };
});

export default app;
