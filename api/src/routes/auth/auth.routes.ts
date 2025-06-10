/**
 * @fileoverview Defines routes related to authentication.
 *  ไฟล์นี้กำหนดเส้นทาง (routes) ที่เกี่ยวข้องกับการยืนยันตัวตน
 */
import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { loginController } from './auth.controller';
import { loginBodySchema } from './auth.schema';

/**
 * Registers authentication routes with the Fastify instance.
 *  ลงทะเบียนเส้นทาง (routes) การยืนยันตัวตนกับ Fastify instance
 * @param fastify The Fastify instance. อินสแตนซ์ของ Fastify
 * @param options Plugin options. ตัวเลือกสำหรับปลั๊กอิน
 * @param done Callback to signal completion. ฟังก์ชันเรียกกลับเพื่อแจ้งว่าเสร็จสิ้น
 */
const authRoutes = async (fastify: FastifyInstance, options: FastifyPluginOptions) => {
  fastify.post(
    '/login',
    {
      schema: {
        body: loginBodySchema,
        // It's good practice to define response schemas as well for documentation and validation
        // เป็นแนวทางปฏิบัติที่ดีในการกำหนดสกีมาการตอบกลับด้วยเพื่อประโยชน์ในการทำเอกสารและการตรวจสอบความถูกต้อง
        // response: {
        //   200: loginSuccessResponseSchema, // Example
        //   401: errorResponseSchema, // Example
        // },
        tags: ['Authentication'], // Add Swagger/OpenAPI tags if used
        summary: 'ยืนยันตัวตนผู้ใช้และรับ JWT token', // Summary for API documentation
        description: 'ยืนยันตัวตนผู้ใช้และส่งคืน JWT token พร้อมรายละเอียดผู้ใช้', // Detailed description
      },
    },
    loginController
  );

  // Add other auth-related routes here if needed (e.g., /register, /refresh-token, /logout)
  // เพิ่มเส้นทางอื่นๆ ที่เกี่ยวข้องกับการยืนยันตัวตนที่นี่หากจำเป็น (เช่น /register, /refresh-token, /logout)
};

export default authRoutes;
