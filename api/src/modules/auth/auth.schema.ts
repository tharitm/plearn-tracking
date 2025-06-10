/**
 * @fileoverview Schemas for authentication requests.
 *  ไฟล์นี้กำหนดสกีมาสำหรับคำขอที่เกี่ยวข้องกับการยืนยันตัวตน
 */

export const loginBodySchema = {
  type: 'object',
  required: ['customerCode', 'password'],
  properties: {
    customerCode: { type: 'string', description: 'รหัสลูกค้า (Customer Code)' },
    password: { type: 'string', description: 'รหัสผ่าน (Password)' },
  },
};
