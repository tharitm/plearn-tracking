/**
 * @fileoverview Main router to register all module-based routes.
 *  ไฟล์หลักสำหรับลงทะเบียนเส้นทาง (routes) ทั้งหมดที่มาจากโมดูลต่างๆ
 */
import { FastifyInstance, FastifyPluginOptions } from 'fastify';


import authRoutes from './auth/auth.routes';
import userRoutes from './user/user.routes';

// Import other existing routes, assuming parcelRoutes is not yet modularized
// นำเข้าเส้นทาง (routes) อื่นๆ ที่มีอยู่ โดยสมมติว่า parcelRoutes ยังไม่ได้ถูกทำให้เป็นโมดูล
import parcelRoutes from './parcel/parcel.route';

/**
 * Registers all application routes with the Fastify instance.
 *  ลงทะเบียนเส้นทาง (routes) ทั้งหมดของแอปพลิเคชันกับ Fastify instance
 * @param fastify The Fastify instance. อินสแตนซ์ของ Fastify
 * @param options Plugin options. ตัวเลือกสำหรับปลั๊กอิน
 */
export default async function registerAllRoutes(fastify: FastifyInstance, options: FastifyPluginOptions): Promise<void> {
  fastify.register(authRoutes, { prefix: '/api/auth' }); // Adding a common prefix for auth as well
  fastify.register(userRoutes, { prefix: '/api/users' }); // Changed prefix
  fastify.register(parcelRoutes, { prefix: '/api/parcels' }); // Adding a common prefix for parcels
}
