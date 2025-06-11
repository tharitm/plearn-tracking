import { UserRole } from '../entities/user.entity';

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  customerCode: string;
  address?: string;
  role: UserRole;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  phone: string;
  customerCode: string;
  address?: string;
  password?: string; // Password should be optional and handled by the backend if not provided
  role?: UserRole;
  status?: 'active' | 'inactive';
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  phone?: string;
  customerCode?: string;
  address?: string;
  role?: UserRole;
  status?: 'active' | 'inactive';
}

export interface GetUsersQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  name?: string;
  email?: string;
  status?: 'active' | 'inactive';
}
