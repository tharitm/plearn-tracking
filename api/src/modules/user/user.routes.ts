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
    // The prompt mentioned /customers, but this module is user-centric.
    // Using /users for creating any user type (admin can specify role).
    // If /customers is specifically for UserRole.CUSTOMER, a separate route/controller might be cleaner.
    // คำแนะนำกล่าวถึง /customers แต่โมดูลนี้เน้นผู้ใช้
    // ใช้ /users สำหรับการสร้างผู้ใช้ประเภทใดก็ได้ (ผู้ดูแลระบบสามารถระบุบทบาทได้)
    // หาก /customers มีไว้สำหรับ UserRole.CUSTOMER โดยเฉพาะ เส้นทาง/คอนโทรลเลอร์ที่แยกจากกันอาจจะชัดเจนกว่า
    '/users',
    {
      schema: {
        body: createUserBodySchema,
        response: {
          201: userResponseSchema, // HTTP 201 for created resource (สำหรับทรัพยากรที่สร้างขึ้น)
          // Define other responses like 400, 401, 403, 500 here
          // กำหนดการตอบกลับอื่นๆ เช่น 400, 401, 403, 500 ที่นี่
        },
        tags: ['Admin - Users'], // OpenAPI/Swagger tag
        summary: 'Create a new user', // สรุปสำหรับเอกสาร API
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

  // Add other user management routes here (e.g., update user, delete user)
  // เพิ่มเส้นทางอื่นๆ สำหรับการจัดการผู้ใช้ที่นี่ (เช่น อัปเดตผู้ใช้, ลบผู้ใช้)
};

export default userRoutes;
