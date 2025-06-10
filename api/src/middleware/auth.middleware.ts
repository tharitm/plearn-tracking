import { FastifyRequest, FastifyReply } from 'fastify';
import { verifyToken } from '../services/auth.service';
import { sendError } from '../handlers/response.handler';
import { UserRole } from '../entities/user.entity';

export interface TokenUserPayload {
  userId: string; // Changed from 'id' to 'userId' to match generateToken payload
  role: UserRole;
  // customerCode is not part of the token payload in auth.service.ts
}

declare module 'fastify' {
  interface FastifyRequest {
    user?: TokenUserPayload;
  }
}

export const authenticateToken = async (request: FastifyRequest, reply: FastifyReply) => {
  const authHeader = request.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(reply, 'unauthorized', new Error('Missing or malformed Authorization header'));
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix

  try {
    const decodedToken = verifyToken(token);
    if (!decodedToken) {
      return sendError(reply, 'unauthorized', new Error('Invalid or expired token'));
    }
    // Ensure the payload matches TokenUserPayload, especially userId
    if (typeof decodedToken.userId !== 'string' || typeof decodedToken.role !== 'string') {
        return sendError(reply, 'unauthorized', new Error('Token payload is invalid'));
    }
    request.user = decodedToken as TokenUserPayload; // Cast after validation
  } catch (error) {
    // Log the error for debugging if necessary
    // console.error("Token verification error:", error);
    return sendError(reply, 'unauthorized', new Error('Token verification failed'));
  }
};

export const authorizeAdmin = async (request: FastifyRequest, reply: FastifyReply) => {
  if (!request.user || request.user.role !== UserRole.ADMIN) {
    return sendError(reply, 'forbidden', new Error('Admin access required'));
  }
};
