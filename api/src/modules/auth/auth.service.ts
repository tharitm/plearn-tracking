/**
 * @fileoverview Authentication service for password hashing and JWT operations.
 *  บริการเกี่ยวกับการยืนยันตัวตน สำหรับการเข้ารหัสรหัสผ่านและการดำเนินการ JWT
 */
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ENV } from '../../config/env'; // Updated path

const SALT_ROUNDS = 10; // จำนวนรอบสำหรับการสร้าง salt (Number of rounds for salt generation)

/**
 * Hashes a password using bcrypt.
 * เข้ารหัสรหัสผ่านด้วย bcrypt
 * @param password The password to hash. รหัสผ่านที่ต้องการเข้ารหัส
 * @returns A promise resolving to the hashed password. Promise ที่จะคืนค่าเป็นรหัสผ่านที่เข้ารหัสแล้ว
 */
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(password, salt);
};

/**
 * Compares a plaintext password with a hash.
 * เปรียบเทียบรหัสผ่าน (plaintext) กับแฮช
 * @param password The plaintext password. รหัสผ่าน (plaintext)
 * @param hash The hash to compare against. แฮชที่ต้องการเปรียบเทียบ
 * @returns A promise resolving to true if the password matches the hash, false otherwise. Promise ที่จะคืนค่า true ถ้ารหัสผ่านตรงกับแฮช มิฉะนั้นเป็น false
 */
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

/**
 * Generates a JWT (JSON Web Token).
 * สร้าง JWT (JSON Web Token)
 * @param payload The payload to include in the token. ข้อมูลที่ต้องการใส่ในโทเค็น
 * @returns The generated JWT string. สตริง JWT ที่สร้างขึ้น
 */
export const generateToken = (payload: { userId: string; role: string }): string => {
  return jwt.sign(payload, ENV.JWT_SECRET, { expiresIn: '7d' }); // Token expires in 7 days (โทเค็นหมดอายุใน 7 วัน)
};

/**
 * Verifies a JWT.
 * ตรวจสอบความถูกต้องของ JWT
 * @param token The JWT string to verify. สตริง JWT ที่ต้องการตรวจสอบ
 * @returns The decoded payload if verification is successful, otherwise null. ข้อมูลที่ถอดรหัสแล้วหากการตรวจสอบสำเร็จ มิฉะนั้นเป็น null
 */
export const verifyToken = (token: string): { userId: string; role: string } | null => {
  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET);
    return decoded as { userId: string; role: string };
  } catch (error) {
    // console.error('Token verification error:', error); // Log error for debugging if needed (แสดงข้อผิดพลาดการตรวจสอบโทเค็นเพื่อดีบักหากจำเป็น)
    return null;
  }
};
