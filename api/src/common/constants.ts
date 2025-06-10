/**
 * @fileoverview This file contains shared constants for the API.
 *  ไฟล์นี้เก็บค่าคงที่ที่ใช้ร่วมกันภายใน API
 */

/**
 * BaseResponseKey defines the set of standardized keys for API responses.
 *  กำหนดชุดของคีย์มาตรฐานสำหรับผลลัพธ์การตอบกลับของ API
 */
export enum BaseResponseKey {
  SUCCESS = 'success',
  CREATED = 'created',
  VALIDATION_FAIL = 'validationFail',
  UNAUTHORIZED = 'unauthorized',
  FORBIDDEN = 'forbidden',
  NOT_FOUND = 'notFound',
  CONFLICT = 'conflict',
  INTERNAL_ERROR = 'internalError',
}

/**
 * DeveloperMessages provides a mapping from BaseResponseKey to human-readable messages.
 * These are primarily for developer understanding but can also form the basis of user-facing messages.
 */
export const DeveloperMessages = {
  [BaseResponseKey.SUCCESS]: 'Operation was successful.', // การดำเนินการสำเร็จ
  [BaseResponseKey.CREATED]: 'Resource was successfully created.', // สร้างทรัพยากรสำเร็จแล้ว
  [BaseResponseKey.VALIDATION_FAIL]: 'Input validation failed.', // การตรวจสอบข้อมูลนำเข้าล้มเหลว
  [BaseResponseKey.UNAUTHORIZED]: 'Authentication required or invalid credentials.', // ต้องการการยืนยันตัวตนหรือข้อมูลประจำตัวไม่ถูกต้อง
  [BaseResponseKey.FORBIDDEN]: 'Access denied. You do not have permission to perform this action.', // ปฏิเสธการเข้าถึง คุณไม่มีสิทธิ์ดำเนินการนี้
  [BaseResponseKey.NOT_FOUND]: 'The requested resource was not found.', // ไม่พบทรัพยากรที่ร้องขอ
  [BaseResponseKey.CONFLICT]: 'A conflict occurred with the current state of the resource.', // เกิดข้อขัดแย้งกับสถานะปัจจุบันของทรัพยากร
  [BaseResponseKey.INTERNAL_ERROR]: 'An internal server error occurred.', // เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์

  // Specific validation messages (ข้อความการตรวจสอบเฉพาะ)
  VALIDATION_FAIL_CUSTOMER_CODE_LENGTH: 'รหัสลูกค้าต้องมีความยาวระหว่าง 4 ถึง 10 ตัวอักษร (Customer code must be between 4 and 10 characters)',
  VALIDATION_FAIL_CUSTOMER_CODE_EXISTS: 'รหัสลูกค้านี้มีอยู่ในระบบแล้ว (This customer code already exists in the system)',
  VALIDATION_FAIL_EMAIL_EXISTS: 'อีเมลนี้มีอยู่ในระบบแล้ว (This email already exists in the system)',
  USER_NOT_FOUND: 'ไม่พบผู้ใช้งานนี้ (User not found)',

  // Auth specific messages (ข้อความเฉพาะสำหรับการยืนยันตัวตน)
  MISSING_AUTH_HEADER: 'Missing or malformed Authorization header.', // ส่วนหัว Authorization หายไปหรือรูปแบบไม่ถูกต้อง
  INVALID_TOKEN: 'Invalid or expired token.', // โทเค็นไม่ถูกต้องหรือหมดอายุ
  INVALID_PASSWORD: 'รหัสผ่านไม่ถูกต้อง (Invalid password)', // Kept in Thai as it's a direct user feedback
};

/**
 * JWT (JSON Web Token) related constants.
 *  ค่าคงที่เกี่ยวกับ JWT (JSON Web Token)
 */
export const JWTConstants = {
  BEARER_PREFIX: 'Bearer ',
};

// Example of other constants that might be useful
// ตัวอย่างค่าคงที่อื่นๆ ที่อาจมีประโยชน์
export const DefaultPagination = {
  PAGE: 1,
  LIMIT: 10,
};

export const Roles = {
  ADMIN: 'ADMIN',
  CUSTOMER: 'CUSTOMER',
};
