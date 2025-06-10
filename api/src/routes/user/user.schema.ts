/**
 * @fileoverview Schemas for user management requests.
 *  ไฟล์นี้กำหนดสกีมาสำหรับคำขอที่เกี่ยวข้องกับการจัดการผู้ใช้
 */
import { UserRole } from '../../entities/user.entity'; // Assuming path to UserRole enum

export const createUserBodySchema = {
  type: 'object',
  required: ['firstName', 'lastName', 'email', 'phone', 'customerCode', 'address', 'password'],
  properties: {
    firstName: { type: 'string', description: "ชื่อจริง" },
    lastName: { type: 'string', description: "นามสกุล" },
    email: { type: 'string', format: 'email', description: "อีเมล" },
    phone: { type: 'string', description: "หมายเลขโทรศัพท์" },
    customerCode: {
      type: 'string',
      minLength: 4,
      maxLength: 10,
      description: "รหัสลูกค้า (4-10 ตัวอักษร)"
    },
    address: { type: 'string', description: "ที่อยู่" },
    password: {
      type: 'string',
      minLength: 8, // Increased minLength for better security
      description: "รหัสผ่าน (อย่างน้อย 8 ตัวอักษร)"
    },
    role: {
      type: 'string',
      enum: Object.values(UserRole),
      default: UserRole.CUSTOMER,
      description: `บทบาทผู้ใช้. ค่าเริ่มต้นคือ ${UserRole.CUSTOMER}. ค่าที่เป็นไปได้: ${Object.values(UserRole).join(', ')}`
    },
  },
};

export const userIdParamsSchema = {
  type: 'object',
  required: ['id'],
  properties: {
    id: { type: 'string', description: 'รหัสผู้ใช้' }, // Assuming ID is a string (UUID or DB ID)
  },
};

// Example for response schema (can be expanded)
// ตัวอย่างสำหรับสกีมาการตอบกลับ (สามารถขยายได้)
export const userResponseSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', description: 'รหัสผู้ใช้' },
    firstName: { type: 'string', description: "ชื่อจริง" },
    lastName: { type: 'string', description: "นามสกุล" },
    email: { type: 'string', format: 'email', description: "อีเมล" },
    phone: { type: 'string', description: "หมายเลขโทรศัพท์" },
    customerCode: { type: 'string', description: "รหัสลูกค้า" },
    address: { type: 'string', description: "ที่อยู่" },
    role: { type: 'string', enum: Object.values(UserRole), description: `บทบาทผู้ใช้. ค่าที่เป็นไปได้: ${Object.values(UserRole).join(', ')}` },
    createdAt: { type: 'string', format: 'date-time', description: 'สร้างเมื่อ' },
    updatedAt: { type: 'string', format: 'date-time', description: 'อัปเดตล่าสุดเมื่อ' },
    // passwordHash should NOT be in responses
    // passwordHash ไม่ควรอยู่ในผลลัพธ์การตอบกลับ
  },
};
