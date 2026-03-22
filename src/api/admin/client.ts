import { apiMethods } from '../index';
import {
  ADMIN_LOGIN,
  ADMIN_ME,
  ADMIN_LOGOUT,
  ADMIN_REFRESH_TOKEN,
} from './endpoints';
import {
  AuthResponse,
  LoginData,
  AdminUser,
  AdminProfileResponse,
} from './types';

export const adminAuthApi = {
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await apiMethods.post<AuthResponse>(ADMIN_LOGIN, data);
    return response.data;
  },

  getProfile: async (): Promise<AdminUser> => {
    const response = await apiMethods.get<AdminProfileResponse>(ADMIN_ME);
    // Normalize both old and new backend payload shapes
    return (response.data.data as any)?.user || response.data.data as any;
  },

  logout: async (): Promise<void> => {
    await apiMethods.post(ADMIN_LOGOUT);
  },

  refreshToken: async (): Promise<{ token: string }> => {
    const response = await apiMethods.post<{ token: string }>(ADMIN_REFRESH_TOKEN);
    return response.data;
  },
};
