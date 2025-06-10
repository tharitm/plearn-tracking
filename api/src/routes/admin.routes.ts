import { FastifyInstance, FastifyPluginOptions, FastifyRequest, FastifyReply } from 'fastify';
import { sendSuccess, sendError } from '../handlers/response.handler';
import { createUser, getAllUsers, findUserById, CreateUserDto } from '../services/user.service';
import { authenticateToken, authorizeAdmin } from '../middleware/auth.middleware';
import { UserRole } from '../entities/user.entity';

const createCustomerBodySchema = {
  type: 'object',
  required: ['firstName', 'lastName', 'email', 'phone', 'customerCode', 'address', 'password'],
  properties: {
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    email: { type: 'string', format: 'email' },
    phone: { type: 'string' },
    customerCode: { type: 'string', minLength: 4, maxLength: 10 },
    address: { type: 'string' },
    password: { type: 'string', minLength: 6 }, // Added minLength for password
    role: { type: 'string', enum: Object.values(UserRole), default: UserRole.CUSTOMER },
  },
};

const userIdParamsSchema = {
  type: 'object',
  required: ['id'],
  properties: {
    id: { type: 'string' }, // Assuming ID is a string (e.g., UUID)
  },
};

interface UserIdParams {
  id: string;
}

const adminRoutes = async (fastify: FastifyInstance, options: FastifyPluginOptions) => {
  // Apply authentication and admin authorization to all routes in this plugin
  fastify.addHook('preHandler', authenticateToken);
  fastify.addHook('preHandler', authorizeAdmin);

  fastify.post<{ Body: CreateUserDto }>(
    '/customers', // Route path changed from /admin/customers to /customers as per typical REST patterns when prefixing routes
    { schema: { body: createCustomerBodySchema } },
    async (request: FastifyRequest<{ Body: CreateUserDto }>, reply: FastifyReply) => {
      try {
        // Ensure role is set if not provided, defaulting to CUSTOMER
        const userData = { ...request.body, role: request.body.role || UserRole.CUSTOMER };
        const createdUser = await createUser(userData);
        // Exclude passwordHash from the response
        const { passwordHash, ...userResponse } = createdUser;
        sendSuccess(reply, userResponse, 'created');
      } catch (error: any) {
        request.log.error(error, 'Admin create customer error');
        if (error.message.includes('Customer code must be between 4 and 10 characters') ||
            error.message.toLowerCase().includes('unique constraint') || // For duplicate customerCode/email
            error.message.toLowerCase().includes('already exists')) {
          sendError(reply, 'validationFail', error, error.message);
        } else {
          sendError(reply, 'internalError', new Error('Failed to create customer'));
        }
      }
    }
  );

  fastify.get(
    '/users', // Route path changed from /admin/users to /users
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const users = await getAllUsers();
        // Exclude passwordHash from the response for all users
        const usersResponse = users.map(({ passwordHash, ...user }) => user);
        sendSuccess(reply, usersResponse);
      } catch (error: any) {
        request.log.error(error, 'Admin get all users error');
        sendError(reply, 'internalError', new Error('Failed to retrieve users'));
      }
    }
  );

  fastify.get<{ Params: UserIdParams }>(
    '/users/:id', // Route path changed from /admin/users/:id to /users/:id
    { schema: { params: userIdParamsSchema } },
    async (request: FastifyRequest<{ Params: UserIdParams }>, reply: FastifyReply) => {
      const { id } = request.params;
      try {
        const user = await findUserById(id);
        if (!user) {
          return sendError(reply, 'notFound', new Error('User not found'));
        }
        // Exclude passwordHash from the response
        const { passwordHash, ...userResponse } = user;
        sendSuccess(reply, userResponse);
      } catch (error: any) {
        request.log.error(error, `Admin get user by id (${id}) error`);
        sendError(reply, 'internalError', new Error('Failed to retrieve user'));
      }
    }
  );
};

export default adminRoutes;
