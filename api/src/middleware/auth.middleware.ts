/**
 * @fileoverview Authentication and authorization middleware.
 *  Middleware สำหรับการยืนยันตัวตนและการอนุญาต
 */
import { FastifyRequest, FastifyReply } from 'fastify';
import { verifyToken } from '../modules/auth/auth.service'; // Updated path
import { sendError } from '../handlers/response.handler';
import { UserRole } from '../entities/user.entity';
import { BaseResponseKey, DeveloperMessages, JWTConstants } from '../common/constants'; // Import constants

/**
 * Defines the expected structure of the user payload within the JWT.
 *  กำหนดโครงสร้างที่คาดหวังของข้อมูลผู้ใช้ภายใน JWT
 */
export interface TokenUserPayload {
  userId: string;
  role: UserRole;
}

// Augment FastifyRequest to include the 'user' property
// ขยาย FastifyRequest เพื่อรวมคุณสมบัติ 'user'
declare module 'fastify' {
  interface FastifyRequest {
    user?: TokenUserPayload;
  }
}

/**
 * Middleware to authenticate a token from the Authorization header.
 *  Middleware สำหรับยืนยันโทเค็นจากส่วนหัว Authorization
 * @param request The Fastify request object. อ็อบเจกต์คำขอของ Fastify
 * @param reply The Fastify reply object. อ็อบเจกต์การตอบกลับของ Fastify
 */
export const authenticateToken = async (request: FastifyRequest, reply: FastifyReply) => {
  const authHeader = request.headers.authorization;

  if (!authHeader || !authHeader.startsWith(JWTConstants.BEARER_PREFIX)) {
    // ส่วนหัว Authorization หายไปหรือรูปแบบไม่ถูกต้อง
    return sendError(reply, BaseResponseKey.UNAUTHORIZED, new Error(DeveloperMessages.MISSING_AUTH_HEADER));
  }

  const token = authHeader.substring(JWTConstants.BEARER_PREFIX.length); // Remove 'Bearer ' prefix (ลบคำนำหน้า 'Bearer ')

  try {
    const decodedToken = verifyToken(token);
    if (!decodedToken) {
      // โทเค็นไม่ถูกต้องหรือหมดอายุ
      return sendError(reply, BaseResponseKey.UNAUTHORIZED, new Error(DeveloperMessages.INVALID_TOKEN));
    }

    // Ensure the payload matches TokenUserPayload (ตรวจสอบว่าข้อมูลสอดคล้องกับ TokenUserPayload)
    // This check can be more robust depending on the exact structure of decodedToken
    // การตรวจสอบนี้สามารถทำให้เข้มงวดมากขึ้นได้ขึ้นอยู่กับโครงสร้างที่แน่นอนของ decodedToken
    if (typeof decodedToken.userId !== 'string' || typeof decodedToken.role !== 'string') {
        // โทเค็นมีข้อมูลที่ไม่ถูกต้อง
        return sendError(reply, BaseResponseKey.UNAUTHORIZED, new Error(DeveloperMessages.INVALID_TOKEN_PAYLOAD || 'Token payload is invalid')); // Added a fallback message
    }
    request.user = decodedToken as TokenUserPayload; // Cast after validation (แปลงประเภทหลังจากการตรวจสอบ)
  } catch (error) {
    // Log the error for debugging if necessary (บันทึกข้อผิดพลาดเพื่อดีบักหากจำเป็น)
    request.log.error(error, 'Token verification error');
    // การตรวจสอบโทเค็นล้มเหลว
    return sendError(reply, BaseResponseKey.UNAUTHORIZED, new Error(DeveloperMessages.INVALID_TOKEN));
  }
};

/**
 * Middleware to authorize admin users.
 *  Middleware สำหรับอนุญาตผู้ใช้ที่เป็นผู้ดูแลระบบ
 * @param request The Fastify request object. อ็อบเจกต์คำขอของ Fastify
 * @param reply The Fastify reply object. อ็อบเจกต์การตอบกลับของ Fastify
 */
export const authorizeAdmin = async (request: FastifyRequest, reply: FastifyReply) => {
  if (!request.user || request.user.role !== UserRole.ADMIN) {
    // ต้องการสิทธิ์ผู้ดูแลระบบ
    // Using the generic FORBIDDEN message as FORBIDDEN_ADMIN_ACCESS was not explicitly in constants.ts
    // For more specificity, add a 'FORBIDDEN_ADMIN_ACCESS' to DeveloperMessages.
    // ใช้ข้อความ FORBIDDEN ทั่วไปเนื่องจาก FORBIDDEN_ADMIN_ACCESS ไม่ได้ระบุไว้อย่างชัดเจนใน constants.ts
    // หากต้องการความเฉพาะเจาะจงมากขึ้น ให้เพิ่ม 'FORBIDDEN_ADMIN_ACCESS' ใน DeveloperMessages
    return sendError(reply, BaseResponseKey.FORBIDDEN, new Error(DeveloperMessages.FORBIDDEN));
  }
};
