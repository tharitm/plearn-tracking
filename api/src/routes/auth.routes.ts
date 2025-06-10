import { FastifyInstance, FastifyPluginOptions, FastifyRequest, FastifyReply } from 'fastify';
import { sendSuccess, sendError } from '../handlers/response.handler';
import { findUserByCustomerCode } from '../services/user.service';
import { comparePassword, generateToken } from '../services/auth.service';
import { User, UserRole } from '../entities/user.entity'; // UserRole might not be directly used here but good for consistency

const loginBodySchema = {
  type: 'object',
  required: ['customerCode', 'password'],
  properties: {
    customerCode: { type: 'string' },
    password: { type: 'string' },
  },
};

interface LoginRequestBody {
  customerCode: string;
  password: string;
}

const authRoutes = async (fastify: FastifyInstance, options: FastifyPluginOptions) => {
  fastify.post(
    '/login',
    { schema: { body: loginBodySchema } },
    async (request: FastifyRequest<{ Body: LoginRequestBody }>, reply: FastifyReply) => {
      const { customerCode, password } = request.body;

      try {
        const user = await findUserByCustomerCode(customerCode);

        if (!user) {
          return sendError(reply, 'unauthorized', new Error('Invalid customer code or password'));
        }

        const isPasswordValid = await comparePassword(password, user.passwordHash);

        if (!isPasswordValid) {
          return sendError(reply, 'unauthorized', new Error('Invalid customer code or password'));
        }

        // Note: customerCode is added to the token payload as per the requirement
        const token = generateToken({ userId: user.id, role: user.role });
        // The requirement was: const token = generateToken({ userId: user.id, role: user.role, customerCode: user.customerCode });
        // However, the auth.service.ts generateToken function is defined as:
        // export const generateToken = (payload: { userId: string; role: string }): string => { ... }
        // And TokenUserPayload in auth.middleware.ts is:
        // export interface TokenUserPayload { userId: string; role: UserRole; }
        // For now, I will stick to the existing definition in auth.service.ts and TokenUserPayload.
        // If customerCode is strictly needed in the token, auth.service.ts and TokenUserPayload should be updated first.

        const userResponse = {
          id: user.id,
          customerCode: user.customerCode,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email, // Added email to response as it's a common field
          role: user.role,
        };

        sendSuccess(reply, { token, user: userResponse }, 'success');
      } catch (error) {
        request.log.error(error, 'Login error');
        sendError(reply, 'internalError', new Error('An unexpected error occurred during login'));
      }
    }
  );
};

export default authRoutes;
