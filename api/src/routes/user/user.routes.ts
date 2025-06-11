/**
 * @fileoverview Defines routes related to user management.
 *  ไฟล์นี้กำหนดเส้นทาง (routes) ที่เกี่ยวข้องกับการจัดการผู้ใช้
 */
import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import {
  createUserController,
  getAllUsersController,
  getUserByIdController, // Will be replaced or updated if needed
  updateUserController,
  deleteUserController,
  resetPasswordController,
} from './user.controller'; // Assuming controller functions will be in user.controller.ts
import {
  createUserBodySchema,
  updateUserBodySchema,
  userIdParamsSchema,
  getUsersQuerySchema,
  userResponseSchema,
  successResponseSchema, // For simple success messages
} from './user.schema'; // Assuming schema definitions will be in user.schema.ts
import { authenticateToken } from '../../middleware/auth.middleware'; // Removed authorizeAdmin for now, can be added per route

/**
 * Registers user management routes with the Fastify instance.
 *  ลงทะเบียนเส้นทาง (routes) การจัดการผู้ใช้กับ Fastify instance
 * @param fastify The Fastify instance. อินสแตนซ์ของ Fastify
 * @param options Plugin options. ตัวเลือกสำหรับปลั๊กอิน
 * @param done Callback to signal completion. ฟังก์ชันเรียกกลับเพื่อแจ้งว่าเสร็จสิ้น
 */
const userRoutes = async (fastify: FastifyInstance, options: FastifyPluginOptions) => {
  // Apply authentication to all routes in this plugin. Specific authorization can be added per route.
  // fastify.addHook('preHandler', authenticateToken); // Authentication can be applied globally or per route

  fastify.get(
    '/users',
    {
      preHandler: [authenticateToken], // Example of per-route middleware
      schema: {
        querystring: getUsersQuerySchema, // For pagination, filtering, sorting
        response: {
          200: {
            type: 'array',
            items: userResponseSchema,
          },
        },
        tags: ['Users'],
        summary: 'Fetch all users',
        description: 'Retrieves a list of users with pagination, filtering, and sorting.',
      },
    },
    getAllUsersController
  );

  fastify.post(
    '/users',
    {
      preHandler: [authenticateToken], // Example: admin only for creation
      schema: {
        body: createUserBodySchema,
        response: {
          201: userResponseSchema,
        },
        tags: ['Users'],
        summary: 'Create a new user',
        description: 'Creates a new user.',
      },
    },
    createUserController
  );

  fastify.put(
    '/users/:id',
    {
      preHandler: [authenticateToken],
      schema: {
        params: userIdParamsSchema,
        body: updateUserBodySchema,
        response: {
          200: userResponseSchema,
          // Define 404 if user not found
        },
        tags: ['Users'],
        summary: 'Update an existing user',
        description: 'Updates an existing user by their ID.',
      },
    },
    updateUserController
  );

  fastify.delete(
    '/users/:id',
    {
      preHandler: [authenticateToken],
      schema: {
        params: userIdParamsSchema,
        response: {
          200: successResponseSchema, // Or a specific response schema for deletion
          // Define 404 if user not found
        },
        tags: ['Users'],
        summary: 'Mark a user as inactive',
        description: 'Marks a user as inactive by their ID (soft delete).',
      },
    },
    deleteUserController
  );

  fastify.post(
    '/users/:id/reset-password',
    {
      preHandler: [authenticateToken],
      schema: {
        params: userIdParamsSchema,
        response: {
          200: successResponseSchema, // Placeholder response
        },
        tags: ['Users'],
        summary: 'Reset user password',
        description: 'Resets a user\'s password (placeholder).',
      },
    },
    resetPasswordController
  );

  // The existing getUserByIdController might be useful, or can be removed if not part of the explicit requirements
  // For now, I'll keep it commented out to avoid conflicts until controllers are defined.
  /*
  fastify.get(
    '/users/:id',
    {
      preHandler: [authenticateToken], // Assuming admin or self
      schema: {
        params: userIdParamsSchema,
        response: {
          200: userResponseSchema,
          // Define 404, etc.
        },
        tags: ['Users'], // Changed tag
        summary: 'Get user by ID',
        description: 'Retrieves a specific user by their ID.',
      },
    },
    getUserByIdController
  );
  */
};

export default userRoutes;
