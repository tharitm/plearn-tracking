/**
 * @fileoverview Main router to register all module-based routes.
 *  ไฟล์หลักสำหรับลงทะเบียนเส้นทาง (routes) ทั้งหมดที่มาจากโมดูลต่างๆ
 */
import { FastifyInstance, FastifyPluginOptions } from 'fastify';

// Import module-based routes
// นำเข้าเส้นทาง (routes) จากโมดูลต่างๆ
import authRoutes from '../modules/auth/auth.routes'; // New path for auth routes (เส้นทางใหม่สำหรับ auth routes)
import userRoutes from '../modules/user/user.routes'; // New path for user/admin routes (เส้นทางใหม่สำหรับ user/admin routes)

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
  // Register authentication routes (e.g., /login)
  // ลงทะเบียนเส้นทาง (routes) การยืนยันตัวตน (เช่น /login)
  fastify.register(authRoutes);

  // Register user management routes under the '/admin' prefix
  // These routes are for admin operations like creating users, getting all users, etc.
  // ลงทะเบียนเส้นทาง (routes) การจัดการผู้ใช้ภายใต้ prefix '/admin'
  // เส้นทางเหล่านี้มีไว้สำหรับการดำเนินการของผู้ดูแลระบบ เช่น การสร้างผู้ใช้, การดึงข้อมูลผู้ใช้ทั้งหมด เป็นต้น
  fastify.register(userRoutes, { prefix: '/admin' });

  // Register parcel routes
  // It's assumed parcelRoutes might define its own internal prefixes or expect to be at '/parcels'
  // ลงทะเบียนเส้นทาง (routes) ของพัสดุ
  // สมมติว่า parcelRoutes อาจกำหนด prefix ภายในของตัวเอง หรือคาดว่าจะอยู่ที่ '/parcels'
  fastify.register(parcelRoutes, { prefix: '/parcels' });

  // Add other route modules here as the application grows
  // เพิ่มโมดูลเส้นทาง (routes) อื่นๆ ที่นี่เมื่อแอปพลิเคชันขยายใหญ่ขึ้น
  // fastify.register(anotherModuleRoutes, { prefix: '/another-module' });
}
