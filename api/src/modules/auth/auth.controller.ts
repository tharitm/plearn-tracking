/**
 * @fileoverview Controller for authentication operations.
 *  ไฟล์นี้จัดการตรรกะสำหรับเส้นทาง (routes) ที่เกี่ยวข้องกับการยืนยันตัวตน
 */
import { FastifyRequest, FastifyReply } from 'fastify';
import { sendSuccess, sendError } from '../../../handlers/response.handler';
// Assuming User entity will be moved or accessible from a common entities path
// import { User } from '../../../entities/user.entity';
import { findUserByCustomerCode } from '../user/user.service'; // This path assumes user module is structured similarly
import { comparePassword, generateToken } from './auth.service';
import { BaseResponseKey, DeveloperMessages } from '../../../common/constants';

interface LoginRequestBody {
  customerCode: string;
  password: string;
}

/**
 * Handles user login.
 *  จัดการการเข้าสู่ระบบของผู้ใช้
 * @param request The Fastify request object. อ็อบเจกต์คำขอของ Fastify
 * @param reply The Fastify reply object. อ็อบเจกต์การตอบกลับของ Fastify
 */
export const loginController = async (
  request: FastifyRequest<{ Body: LoginRequestBody }>,
  reply: FastifyReply
) => {
  const { customerCode, password } = request.body;

  try {
    const user = await findUserByCustomerCode(customerCode);

    if (!user) {
      // Using a generic message for invalid credentials to avoid user enumeration
      // ใช้ข้อความทั่วไปสำหรับข้อมูลประจำตัวที่ไม่ถูกต้องเพื่อหลีกเลี่ยงการแจงนับผู้ใช้
      return sendError(reply, BaseResponseKey.UNAUTHORIZED, new Error(DeveloperMessages.UNAUTHORIZED));
    }

    const isPasswordValid = await comparePassword(password, user.passwordHash);

    if (!isPasswordValid) {
      return sendError(reply, BaseResponseKey.UNAUTHORIZED, new Error(DeveloperMessages.UNAUTHORIZED));
    }

    const token = generateToken({ userId: user.id, role: user.role });

    const userResponse = {
      id: user.id,
      customerCode: user.customerCode,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    };

    sendSuccess(reply, { token, user: userResponse }, BaseResponseKey.SUCCESS);
  } catch (error: any) {
    request.log.error(error, `Login error for customerCode: ${customerCode}`); // Log the error with context (บันทึกข้อผิดพลาดพร้อมบริบท)
    // Send a generic internal error message to the client
    // ส่งข้อความข้อผิดพลาดภายในทั่วไปไปยังไคลเอ็นต์
    sendError(reply, BaseResponseKey.INTERNAL_ERROR, new Error(DeveloperMessages.INTERNAL_ERROR));
  }
};
