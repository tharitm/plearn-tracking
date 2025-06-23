/**
 * @fileoverview Service for user management operations.
 *  บริการสำหรับการจัดการผู้ใช้
 */
import { User, UserRole } from '../../entities/user.entity';
import AppDataSource from '../../config/ormconfig';
import { hashPassword } from '../auth/auth.service';
import { DeveloperMessages } from '../../common/constants';

/**
 * Interface for Data Transfer Object for creating a user.
 *  อินเทอร์เฟซสำหรับอ็อบเจกต์การถ่ายโอนข้อมูลสำหรับการสร้างผู้ใช้
 */
export interface CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  customerCode: string;
  address: string;
  password: string;
  role: UserRole;
}

/**
 * Creates a new user.
 *  สร้างผู้ใช้ใหม่
 * @param userData Data for the new user. ข้อมูลสำหรับผู้ใช้ใหม่
 * @returns A promise resolving to the created user. Promise ที่จะคืนค่าเป็นผู้ใช้ที่สร้างขึ้น
 * @throws Error if customerCode validation fails or if email/customerCode already exists. โยน Error หากการตรวจสอบ customerCode ล้มเหลว หรือหากอีเมล/customerCode มีอยู่แล้ว
 */
export const createUser = async (userData: CreateUserDto): Promise<User> => {
  const { customerCode, password, email, ...restOfUserData } = userData;
  const userRepository = AppDataSource.getRepository(User);

  // Validate customerCode length (ตรวจสอบความยาวของ customerCode)
  if (customerCode.length < 4 || customerCode.length > 10) {
    throw new Error(DeveloperMessages.VALIDATION_FAIL_CUSTOMER_CODE_LENGTH);
  }

  // Check for existing user by customerCode (ตรวจสอบผู้ใช้ที่มีอยู่ด้วย customerCode)
  const existingByCode = await userRepository.findOneBy({ customerCode });
  if (existingByCode) {
    throw new Error(DeveloperMessages.VALIDATION_FAIL_CUSTOMER_CODE_EXISTS);
  }

  // Check for existing user by email (ตรวจสอบผู้ใช้ที่มีอยู่ด้วย email)
  const existingByEmail = await userRepository.findOneBy({ email });
  if (existingByEmail) {
    throw new Error(DeveloperMessages.VALIDATION_FAIL_EMAIL_EXISTS);
  }

  const passwordHash = await hashPassword(password);

  const newUser = userRepository.create({
    ...restOfUserData,
    email,
    customerCode,
    passwordHash,
    role: userData.role || UserRole.CUSTOMER, // Ensure role is set
  });

  return userRepository.save(newUser);
};

/**
 * Finds a user by their customer code.
 *  ค้นหาผู้ใช้ด้วยรหัสลูกค้า
 * @param customerCode The customer code. รหัสลูกค้า
 * @returns A promise resolving to the user or null if not found. Promise ที่จะคืนค่าเป็นผู้ใช้หรือ null หากไม่พบ
 */
export const findUserByCustomerCode = async (customerCode: string): Promise<User | null> => {
  const userRepository = AppDataSource.getRepository(User);
  return userRepository.findOneBy({ customerCode });
};

/**
 * Finds a user by their ID.
 *  ค้นหาผู้ใช้ด้วย ID
 * @param id The user ID. ID ของผู้ใช้
 * @returns A promise resolving to the user or null if not found. Promise ที่จะคืนค่าเป็นผู้ใช้หรือ null หากไม่พบ
 */
export const findUserById = async (id: string): Promise<User | null> => {
  const userRepository = AppDataSource.getRepository(User);
  return userRepository.findOneBy({ id });
};

/**
 * Retrieves all users.
 *  ดึงข้อมูลผู้ใช้ทั้งหมด
 * @returns A promise resolving to a list of all users. Promise ที่จะคืนค่าเป็นรายการผู้ใช้ทั้งหมด
 */
export const getAllUsers = async (): Promise<User[]> => {
  const userRepository = AppDataSource.getRepository(User);
  // Consider adding pagination and filtering options for real-world scenarios
  // พิจารณาเพิ่มตัวเลือกการแบ่งหน้าและการกรองสำหรับสถานการณ์จริง
  return userRepository.find();
};
