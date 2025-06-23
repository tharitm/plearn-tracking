import Fastify, { FastifyError, FastifyRequest, FastifyReply } from 'fastify';
import registerAllRoutes from './routes/routes';
import { sendError } from './handlers/response.handler';
import { BaseResponse } from './common/responses';
import cors from '@fastify/cors';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUI from '@fastify/swagger-ui';

const app = Fastify({
  logger: true,
});

// enable CORS for your frontend origin
app.register(cors, {
  origin: ['http://localhost:3005'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
});

// Register Swagger
app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'เอกสาร API สำหรับ Backend',
      description: 'เอกสาร API สำหรับบริการส่วนหลังบ้านของระบบ',
      version: '1.0.0'
    },
    components: {
    },
  }
});

// Register Swagger UI
app.register(fastifySwaggerUI, {
  routePrefix: '/documentation', // Or any other path you prefer e.g., /api-docs
  uiConfig: {
    docExpansion: 'list', // How the UI should expand documents (none, list, full)
    deepLinking: false
  },
  staticCSP: true, // Content Security Policy
  transformSpecificationClone: true // Allows for specification modification without affecting the original
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
