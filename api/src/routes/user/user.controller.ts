/**
 * @fileoverview Controller for user management operations.
 *  ไฟล์นี้จัดการตรรกะสำหรับเส้นทาง (routes) ที่เกี่ยวข้องกับการจัดการผู้ใช้
 */
import { FastifyRequest, FastifyReply } from 'fastify';
import { createUser, getAllUsers, findUserById, CreateUserDto } from './user.service';
import { BaseResponseKey, DeveloperMessages } from '../../common/constants';
import { sendSuccess, sendError } from '../../handlers/response.handler';

// ฟังก์ชันช่วยในการลบ passwordHash ออกจากอ็อบเจกต์ผู้ใช้
const sanitizeUser = (user: any) => {
  if (user && typeof user === 'object' && 'passwordHash' in user) {
    const { passwordHash, ...sanitizedUser } = user;
    return sanitizedUser;
  }
  return user;
};

// Helper function to exclude password hash from an array of users
// ฟังก์ชันช่วยในการลบ passwordHash ออกจากอาร์เรย์ของผู้ใช้
const sanitizeUsers = (users: any[]) => {
  return users.map(sanitizeUser);
};


/**
 * Handles creation of a new user.
 *  จัดการการสร้างผู้ใช้ใหม่
 * @param request The Fastify request object, expecting CreateUserDto in Body. อ็อบเจกต์คำขอของ Fastify ซึ่งคาดว่าจะมี CreateUserDto ในส่วน Body
 * @param reply The Fastify reply object. อ็อบเจกต์การตอบกลับของ Fastify
 */
export const createUserController = async (
  request: FastifyRequest<{ Body: CreateUserDto }>, // Using CreateUserDto for stronger typing
  reply: FastifyReply
) => {
  try {
    const createdUser = await createUser(request.body);
    sendSuccess(reply, sanitizeUser(createdUser), BaseResponseKey.CREATED);
  } catch (error: any) {
    request.log.error(error, 'Create user error'); // บันทึกข้อผิดพลาด
    // Check for specific, known validation error messages from the service
    // ตรวจสอบข้อความข้อผิดพลาดการตรวจสอบความถูกต้องที่รู้จักจากบริการ
    if (
      error.message === DeveloperMessages.VALIDATION_FAIL_CUSTOMER_CODE_LENGTH ||
      error.message === DeveloperMessages.VALIDATION_FAIL_CUSTOMER_CODE_EXISTS ||
      error.message === DeveloperMessages.VALIDATION_FAIL_EMAIL_EXISTS
    ) {
      sendError(reply, BaseResponseKey.VALIDATION_FAIL, error, error.message);
    } else {
      sendError(reply, BaseResponseKey.INTERNAL_ERROR);
    }
  }
};

/**
 * Handles retrieval of all users.
 *  จัดการการดึงข้อมูลผู้ใช้ทั้งหมด
 * @param request The Fastify request object. อ็อบเจกต์คำขอของ Fastify
 * @param reply The Fastify reply object. อ็อบเจกต์การตอบกลับของ Fastify
 */
export const getAllUsersController = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const users = await getAllUsers();
    sendSuccess(reply, sanitizeUsers(users));
  } catch (error: any) {
    request.log.error(error, 'Get all users error');
    sendError(reply, BaseResponseKey.INTERNAL_ERROR);
  }
};

/**
 * Handles retrieval of a single user by their ID.
 *  จัดการการดึงข้อมูลผู้ใช้คนเดียวด้วย ID
 * @param request The Fastify request object, expecting user ID in Params. อ็อบเจกต์คำขอของ Fastify ซึ่งคาดว่าจะมี ID ผู้ใช้ใน Params
 * @param reply The Fastify reply object. อ็อบเจกต์การตอบกลับของ Fastify
 */
export const getUserByIdController = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  const { id } = request.params;
  try {
    const user = await findUserById(id);
    if (!user) {
      return sendError(reply, BaseResponseKey.NOT_FOUND, new Error(DeveloperMessages.USER_NOT_FOUND));
    }
    sendSuccess(reply, sanitizeUser(user));
  } catch (error: any) {
    request.log.error(error, `Get user by ID (${id}) error`);
    sendError(reply, BaseResponseKey.INTERNAL_ERROR);
  }
};
