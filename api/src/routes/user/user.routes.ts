/**
 * @fileoverview Defines routes related to user management, typically admin-protected.
 *  ไฟล์นี้กำหนดเส้นทาง (routes) ที่เกี่ยวข้องกับการจัดการผู้ใช้ ซึ่งโดยทั่วไปจะมีการป้องกันสำหรับผู้ดูแลระบบ
 */
import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import {
  createUserController,
  getAllUsersController,
  getUserByIdController,
} from './user.controller';
import {
  createUserBodySchema,
  userIdParamsSchema,
  userResponseSchema, // For documenting responses
} from './user.schema';
import { authenticateToken, authorizeAdmin } from '../../middleware/auth.middleware'; // Adjusted path

/**
 * Registers user management routes with the Fastify instance.
 *  ลงทะเบียนเส้นทาง (routes) การจัดการผู้ใช้กับ Fastify instance
 * @param fastify The Fastify instance. อินสแตนซ์ของ Fastify
 * @param options Plugin options. ตัวเลือกสำหรับปลั๊กอิน
 * @param done Callback to signal completion. ฟังก์ชันเรียกกลับเพื่อแจ้งว่าเสร็จสิ้น
 */
const userRoutes = async (fastify: FastifyInstance, options: FastifyPluginOptions) => {
  // Apply authentication and admin authorization to all routes in this plugin
  // ใช้ middleware การยืนยันตัวตนและการอนุญาตผู้ดูแลระบบกับทุกเส้นทางในปลั๊กอินนี้
  fastify.addHook('preHandler', authenticateToken);
  fastify.addHook('preHandler', authorizeAdmin);

  fastify.post(
    '/users',
    {
      schema: {
        body: createUserBodySchema,
        response: {
          201: userResponseSchema,
        },
        tags: ['Admin - Users'], // OpenAPI/Swagger tag
        summary: 'Create a new user',
        description: 'Allows an admin to create a new user (customer or other roles).', // คำอธิบายโดยละเอียด
      },
    },
    createUserController
  );

  fastify.get(
    '/users',
    {
      schema: {
        response: {
          200: {
            type: 'array',
            items: userResponseSchema,
          },
          // Define other responses
        },
        tags: ['Admin - Users'],
        summary: 'Get all users',
        description: 'Retrieves a list of all users.',
      },
    },
    getAllUsersController
  );

  fastify.get(
    '/users/:id',
    {
      schema: {
        params: userIdParamsSchema,
        response: {
          200: userResponseSchema,
          // Define 404, etc.
        },
        tags: ['Admin - Users'],
        summary: 'Get user by ID',
        description: 'Retrieves a specific user by their ID.',
      },
    },
    getUserByIdController
  );

};

export default userRoutes;
