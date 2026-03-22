import { apiMethods } from '../../index';
import {
  ADMIN_USERS_LIST,
  ADMIN_USERS_GET,
  ADMIN_USERS_CREATE,
  ADMIN_USERS_UPDATE,
  ADMIN_USERS_DELETE,
  ADMIN_USERS_BAN,
  ADMIN_USERS_UNBAN,
} from './endpoints';
import {
  AdminUser,
  AdminUsersResponse,
  AdminUserResponse,
  AdminUsersListParams,
  AdminUserCreateInput,
  AdminUserUpdateInput,
} from './types';

export const adminUsersApi = {
  // Fetch users list
  listUsers: async (params?: AdminUsersListParams): Promise<AdminUsersResponse['data']> => {
    const response = await apiMethods.get<AdminUsersResponse>(ADMIN_USERS_LIST, params);
    return response.data?.data;
  },

  // Get single user
  getUser: async (id: string): Promise<AdminUserResponse> => {
    const response = await apiMethods.get<AdminUserResponse>(ADMIN_USERS_GET(id));
    return response.data;
  },

  // Create user
  createUser: async (data: AdminUserCreateInput): Promise<AdminUserResponse> => {
    const response = await apiMethods.post<AdminUserResponse>(ADMIN_USERS_CREATE, data);
    return response.data;
  },

  // Update user
  updateUser: async (id: string, data: AdminUserUpdateInput): Promise<AdminUserResponse> => {
    const response = await apiMethods.put<AdminUserResponse>(ADMIN_USERS_UPDATE(id), data);
    return response.data;
  },

  // Delete user
  deleteUser: async (id: string): Promise<{ success: boolean }> => {
    const response = await apiMethods.delete<{ success: boolean }>(ADMIN_USERS_DELETE(id));
    return response.data;
  },

  // Ban user
  banUser: async (id: string): Promise<AdminUserResponse> => {
    const response = await apiMethods.post<AdminUserResponse>(ADMIN_USERS_BAN(id));
    return response.data;
  },

  // Unban user
  unbanUser: async (id: string): Promise<AdminUserResponse> => {
    const response = await apiMethods.post<AdminUserResponse>(ADMIN_USERS_UNBAN(id));
    return response.data;
  },
};
