/**
 * @fileoverview Schemas for user management requests.
 *  ไฟล์นี้กำหนดสกีมาสำหรับคำขอที่เกี่ยวข้องกับการจัดการผู้ใช้
 */
import { UserRole } from '../../entities/user.entity'; // Assuming path to UserRole enum

export const createUserBodySchema = {
  type: 'object',
  required: ['firstName', 'lastName', 'email', 'phone', 'customerCode', 'address', 'password'],
  properties: {
    firstName: { type: 'string', description: 'ชื่อจริง (First Name)' },
    lastName: { type: 'string', description: 'นามสกุล (Last Name)' },
    email: { type: 'string', format: 'email', description: 'อีเมล (Email)' },
    phone: { type: 'string', description: 'หมายเลขโทรศัพท์ (Phone Number)' },
    customerCode: {
      type: 'string',
      minLength: 4,
      maxLength: 10,
      description: 'รหัสลูกค้า (Customer Code), 4-10 ตัวอักษร'
    },
    address: { type: 'string', description: 'ที่อยู่ (Address)' },
    password: {
      type: 'string',
      minLength: 8, // Increased minLength for better security
      description: 'รหัสผ่าน (Password), อย่างน้อย 8 ตัวอักษร'
    },
    role: {
      type: 'string',
      enum: Object.values(UserRole),
      default: UserRole.CUSTOMER,
      description: `บทบาทผู้ใช้ (User Role), ค่าเริ่มต้นคือ ${UserRole.CUSTOMER}`
    },
  },
};

export const userIdParamsSchema = {
  type: 'object',
  required: ['id'],
  properties: {
    id: { type: 'string', description: 'รหัสผู้ใช้ (User ID)' }, // Assuming ID is a string (UUID or DB ID)
  },
};

// Example for response schema (can be expanded)
// ตัวอย่างสำหรับสกีมาการตอบกลับ (สามารถขยายได้)
export const userResponseSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    email: { type: 'string' },
    phone: { type: 'string' },
    customerCode: { type: 'string' },
    address: { type: 'string' },
    role: { type: 'string', enum: Object.values(UserRole) },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
    // passwordHash should NOT be in responses
    // passwordHash ไม่ควรอยู่ในผลลัพธ์การตอบกลับ
  },
};
