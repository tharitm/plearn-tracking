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
        tags: ['การจัดการผู้ใช้ (Admin)'], // OpenAPI/Swagger tag
        summary: 'สร้างผู้ใช้ใหม่',
        description: 'อนุญาตให้ผู้ดูแลระบบสร้างผู้ใช้ใหม่ (ลูกค้าหรือบทบาทอื่น ๆ)',
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
        tags: ['การจัดการผู้ใช้ (Admin)'],
        summary: 'ดูรายชื่อผู้ใช้ทั้งหมด',
        description: 'ดึงข้อมูลรายชื่อผู้ใช้ทั้งหมด',
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
        tags: ['การจัดการผู้ใช้ (Admin)'],
        summary: 'ดูข้อมูลผู้ใช้ตาม ID',
        description: 'ดึงข้อมูลผู้ใช้เฉพาะตาม ID',
      },
    },
    getUserByIdController
  );

};

export default userRoutes;
