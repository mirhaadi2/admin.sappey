/**
 * Admin Authentication Types
 */

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
}

export interface AdminUser {
  id: string;
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  role: 'ADMIN';
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: AdminUser;
    token: string;
    refreshToken?: string;
    expiresIn?: number;
  };
}

export interface AdminProfileResponse {
  success: boolean;
  data: AdminUser;
}
