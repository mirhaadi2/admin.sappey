// Admin Users API Types
export interface AdminUser {
  id: string;
  email: string;
  name: string;
  phone?: string;
  status: 'active' | 'suspended' | 'banned';
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

export interface AdminUsersResponse {
  success: boolean;
  data: {
    data: AdminUser[];
    total: number;
    page: number;
    limit: number;
  };
}

export interface AdminUserResponse {
  success: boolean;
  data: AdminUser;
}

export interface AdminUsersListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface AdminUserCreateInput {
  email: string;
  name: string;
  phone?: string;
  password: string;
}

export interface AdminUserUpdateInput {
  email?: string;
  name?: string;
  phone?: string;
  status?: 'active' | 'suspended' | 'banned';
}
