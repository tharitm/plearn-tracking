/**
 * @fileoverview Schemas for user management requests and responses.
 *  ไฟล์นี้กำหนดสกีมาสำหรับคำขอและการตอบกลับที่เกี่ยวข้องกับการจัดการผู้ใช้
 */
import { UserRole } from '../../entities/user.entity'; // Assuming path to UserRole enum

// Enum for status to be reused
const userStatusEnum = ['active', 'inactive'] as const;

export const createUserBodySchema = {
  type: 'object',
  required: ['name', 'email', 'phone', 'customerCode'],
  properties: {
    name: { type: 'string', minLength: 1, description: "ชื่อ-นามสกุล" },
    email: { type: 'string', format: 'email', description: "อีเมล" },
    phone: { type: 'string', description: "หมายเลขโทรศัพท์" },
    customerCode: {
      type: 'string',
      minLength: 4,
      maxLength: 10,
      description: "รหัสลูกค้า (4-10 ตัวอักษร)"
    },
    address: { type: 'string', nullable: true, description: "ที่อยู่" },
    password: {
      type: 'string',
      minLength: 8,
      nullable: true, // Password can be optional, might be set/required by service logic
      description: "รหัสผ่าน (อย่างน้อย 8 ตัวอักษร, ถ้ามี)"
    },
    role: {
      type: 'string',
      enum: Object.values(UserRole),
      default: UserRole.CUSTOMER,
      nullable: true,
      description: `บทบาทผู้ใช้. ค่าเริ่มต้นคือ ${UserRole.CUSTOMER}.`
    },
    status: {
      type: 'string',
      enum: userStatusEnum,
      default: 'active',
      nullable: true,
      description: "สถานะผู้ใช้. ค่าเริ่มต้นคือ 'active'."
    },
  },
};

export const updateUserBodySchema = {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 1, nullable: true, description: "ชื่อ-นามสกุล" },
    email: { type: 'string', format: 'email', nullable: true, description: "อีเมล" },
    phone: { type: 'string', nullable: true, description: "หมายเลขโทรศัพท์" },
    customerCode: {
      type: 'string',
      minLength: 4,
      maxLength: 10,
      nullable: true,
      description: "รหัสลูกค้า (4-10 ตัวอักษร)"
    },
    address: { type: 'string', nullable: true, description: "ที่อยู่" },
    role: {
      type: 'string',
      enum: Object.values(UserRole),
      nullable: true,
      description: `บทบาทผู้ใช้.`
    },
    status: {
      type: 'string',
      enum: userStatusEnum,
      nullable: true,
      description: "สถานะผู้ใช้."
    },
  },
  // At least one field should be present for an update
  // minProperties: 1 // Fastify schema doesn't directly support minProperties in this way for AJV,
  // this kind of validation might need to be in the handler or service layer.
};

export const userIdParamsSchema = {
  type: 'object',
  required: ['id'],
  properties: {
    // TODO: Update to use 'uuid' format if IDs are UUIDs
    id: { type: 'string', description: 'รหัสผู้ใช้ (User ID)' },
  },
};

export const userResponseSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', description: 'รหัสผู้ใช้' },
    name: { type: 'string', description: "ชื่อ-นามสกุล" },
    email: { type: 'string', format: 'email', description: "อีเมล" },
    phone: { type: 'string', description: "หมายเลขโทรศัพท์" },
    customerCode: { type: 'string', description: "รหัสลูกค้า" },
    address: { type: 'string', nullable: true, description: "ที่อยู่" },
    role: { type: 'string', enum: Object.values(UserRole), description: `บทบาทผู้ใช้` },
    status: { type: 'string', enum: userStatusEnum, description: "สถานะผู้ใช้" },
    createdAt: { type: 'string', format: 'date-time', description: 'สร้างเมื่อ' },
    updatedAt: { type: 'string', format: 'date-time', description: 'อัปเดตล่าสุดเมื่อ' },
  },
};

export const getUsersQuerySchema = {
  type: 'object',
  properties: {
    page: { type: 'integer', minimum: 1, default: 1, nullable: true, description: 'Page number for pagination' },
    limit: { type: 'integer', minimum: 1, maximum: 100, default: 10, nullable: true, description: 'Number of items per page' },
    sortBy: { type: 'string', enum: ['name', 'email', 'status', 'createdAt', 'customerCode'], default: 'createdAt', nullable: true, description: 'Field to sort by' },
    sortOrder: { type: 'string', enum: ['ASC', 'DESC'], default: 'DESC', nullable: true, description: 'Sort order (ASC or DESC)' },
    name: { type: 'string', nullable: true, description: 'Filter by name (partial match)' },
    email: { type: 'string', format: 'email', nullable: true, description: 'Filter by email (exact match)' },
    status: { type: 'string', enum: userStatusEnum, nullable: true, description: 'Filter by status' },
  },
};

export const successResponseSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean', default: true },
    message: { type: 'string' },
  },
  required: ['message']
};
