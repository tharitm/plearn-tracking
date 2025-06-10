import { User, UserRole } from '../entities/user.entity';
import { AppDataSource } from '../config/ormconfig';
import { hashPassword } from './auth.service';

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

export const createUser = async (userData: CreateUserDto): Promise<User> => {
  const { customerCode, password, ...restOfUserData } = userData;

  if (customerCode.length < 4 || customerCode.length > 10) {
    throw new Error('Customer code must be between 4 and 10 characters');
  }

  const passwordHash = await hashPassword(password);
  const userRepository = AppDataSource.getRepository(User);

  const newUser = userRepository.create({
    ...restOfUserData,
    customerCode,
    passwordHash,
  });

  return userRepository.save(newUser);
};

export const findUserByCustomerCode = async (customerCode: string): Promise<User | null> => {
  const userRepository = AppDataSource.getRepository(User);
  return userRepository.findOneBy({ customerCode });
};

export const findUserById = async (id: string): Promise<User | null> => {
  const userRepository = AppDataSource.getRepository(User);
  return userRepository.findOneBy({ id });
};

export const getAllUsers = async (): Promise<User[]> => {
  const userRepository = AppDataSource.getRepository(User);
  return userRepository.find();
};
