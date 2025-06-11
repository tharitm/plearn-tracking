/**
 * @fileoverview Service for user management operations.
 *  บริการสำหรับการจัดการผู้ใช้
 */
import { User, UserRole } from '../../entities/user.entity';
import AppDataSource from '../../config/ormconfig';
import { hashPassword } from '../auth/auth.service'; // Ensure this path is correct
import { DeveloperMessages } from '../../common/constants';
import { CreateUserRequest, UpdateUserRequest, GetUsersQuery } from '../../types/user.types';
import { FindManyOptions, ILike } from 'typeorm';

/**
 * Creates a new user.
 * @param userData Data for the new user from CreateUserRequest.
 * @returns A promise resolving to the created user.
 * @throws Error if validation fails or if email/customerCode already exists.
 */
export const createUser = async (userData: CreateUserRequest): Promise<User> => {
  const { name, email, phone, customerCode, address, password, role, status } = userData;
  const userRepository = AppDataSource.getRepository(User);

  if (customerCode) {
    if (customerCode.length < 4 || customerCode.length > 10) {
      throw new Error(DeveloperMessages.VALIDATION_FAIL_CUSTOMER_CODE_LENGTH);
    }
    const existingByCode = await userRepository.findOneBy({ customerCode });
    if (existingByCode) {
      throw new Error(DeveloperMessages.VALIDATION_FAIL_CUSTOMER_CODE_EXISTS);
    }
  }

  const existingByEmail = await userRepository.findOneBy({ email });
  if (existingByEmail) {
    throw new Error(DeveloperMessages.VALIDATION_FAIL_EMAIL_EXISTS);
  }

  let passwordHash: string | undefined = undefined;
  if (password) {
    passwordHash = await hashPassword(password);
  } else {
    // If password is not provided, you might want to generate a random one
    // or throw an error if it's mandatory for new user creation.
    // For now, we'll let it be undefined if not provided, but DB constraint might fail if it's not nullable.
    // The entity User has passwordHash as non-nullable. So, a password must be provided or generated.
    throw new Error("Password is required for new user creation.");
  }

  const newUser = userRepository.create({
    name,
    email,
    phone,
    customerCode,
    address: address || undefined, // Handle optional address
    passwordHash,
    role: role || UserRole.CUSTOMER,
    status: status || 'active',
  });

  return userRepository.save(newUser);
};

/**
 * Retrieves users with pagination, filtering, and sorting.
 * @param queryParams Parameters for pagination, filtering, and sorting.
 * @returns A promise resolving to an object with users and pagination details.
 */
export const getAllUsers = async (queryParams: GetUsersQuery): Promise<{ users: User[]; total: number; page: number; limit: number }> => {
  const userRepository = AppDataSource.getRepository(User);
  const {
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder = 'DESC',
    name,
    email,
    status,
  } = queryParams;

  const where: FindManyOptions<User>['where'] = {};
  if (name) {
    where.name = ILike(`%${name}%`);
  }
  if (email) {
    where.email = email;
  }
  if (status) {
    where.status = status;
  }

  const [users, total] = await userRepository.findAndCount({
    where,
    order: { [sortBy]: sortOrder },
    take: limit,
    skip: (page - 1) * limit,
  });

  return { users, total, page, limit };
};

/**
 * Finds a user by their ID.
 * @param id The user ID.
 * @returns A promise resolving to the user or null if not found.
 */
export const findUserById = async (id: string): Promise<User | null> => {
  const userRepository = AppDataSource.getRepository(User);
  return userRepository.findOneBy({ id });
};

/**
 * Updates an existing user.
 * @param id The ID of the user to update.
 * @param updateData Data to update for the user from UpdateUserRequest.
 * @returns A promise resolving to the updated user or null if not found.
 * @throws Error if email/customerCode uniqueness is violated.
 */
export const updateUser = async (id: string, updateData: UpdateUserRequest): Promise<User | null> => {
  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOneBy({ id });

  if (!user) {
    throw new Error(DeveloperMessages.USER_NOT_FOUND);
  }

  // Check for email and customerCode conflicts if they are being changed
  if (updateData.email && updateData.email !== user.email) {
    const existingByEmail = await userRepository.findOneBy({ email: updateData.email });
    if (existingByEmail && existingByEmail.id !== id) {
      throw new Error(DeveloperMessages.VALIDATION_FAIL_EMAIL_EXISTS);
    }
  }
  if (updateData.customerCode && updateData.customerCode !== user.customerCode) {
    if (updateData.customerCode.length < 4 || updateData.customerCode.length > 10) {
      throw new Error(DeveloperMessages.VALIDATION_FAIL_CUSTOMER_CODE_LENGTH);
    }
    const existingByCode = await userRepository.findOneBy({ customerCode: updateData.customerCode });
    if (existingByCode && existingByCode.id !== id) {
      throw new Error(DeveloperMessages.VALIDATION_FAIL_CUSTOMER_CODE_EXISTS);
    }
  }

  // Update only allowed fields. TypeORM's save method handles partial updates well.
  // Object.assign(user, updateData); // This is also an option but less safe with types.

  userRepository.merge(user, updateData); // Merges updateData into user entity

  // Note: Password updates should ideally be handled via a separate "changePassword" endpoint
  // and not directly through the general update user endpoint for security reasons.
  // If a password field is present in UpdateUserRequest and needs to be updated,
  // it should be hashed here. However, it's currently not in UpdateUserRequest.

  return userRepository.save(user);
};

/**
 * Marks a user as inactive (soft delete).
 * @param id The ID of the user to mark as inactive.
 * @returns A promise resolving to true if successful, false otherwise.
 */
export const deleteUser = async (id: string): Promise<boolean> => {
  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOneBy({ id });

  if (!user) {
    throw new Error(DeveloperMessages.USER_NOT_FOUND);
  }
  if (user.status === 'inactive') {
    // Optional: throw an error or return a specific message if already inactive
    // For now, just return true as the state is already as desired.
     throw new Error(DeveloperMessages.USER_ALREADY_INACTIVE); // Or handle as success
  }

  user.status = 'inactive';
  await userRepository.save(user);
  return true;
};

/**
 * Resets a user's password (placeholder).
 * In a real application, this would involve generating a reset token,
 * sending an email, and a separate step to confirm the new password.
 * @param id The ID of the user whose password is to be reset.
 * @returns A promise resolving to true if the operation can be initiated.
 */
export const resetPassword = async (id: string): Promise<boolean> => {
  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOneBy({ id });

  if (!user) {
    throw new Error(DeveloperMessages.USER_NOT_FOUND);
  }

  // Placeholder: Log action.
  console.log(`Password reset initiated for user ID: ${id}. (This is a placeholder)`);
  // In a real scenario:
  // 1. Generate a password reset token, save it with an expiry to the user record or a separate table.
  // 2. Send an email to the user with a link containing the token.
  // For now, we just return true.
  return true;
};

// findUserByCustomerCode might still be useful for other parts of the application
export const findUserByCustomerCode = async (customerCode: string): Promise<User | null> => {
  const userRepository = AppDataSource.getRepository(User);
  return userRepository.findOneBy({ customerCode });
};
