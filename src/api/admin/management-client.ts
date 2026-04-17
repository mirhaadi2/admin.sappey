import { apiClient } from '../index';
import { PlatformStats, ApiResponse, ListResponse, User, Seller } from '../types';

const ADMIN_BASE_URL = '/admin';

export const adminClient = {
  // Statistics
  async getStats(): Promise<PlatformStats> {
    try {
      const response = await apiClient.get<ApiResponse<PlatformStats>>(`${ADMIN_BASE_URL}/stats`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  // Users Management
  async listUsers(page?: number, limit?: number, search?: string): Promise<{ users: User[]; total: number }> {
    try {
      const response = await apiClient.get<ListResponse<User>>(`${ADMIN_BASE_URL}/customers`, {
        params: { page, limit, search },
      });
      return { users: response.data.data, total: response.data.total };
    } catch (error) {
      throw error;
    }
  },

  async getUser(id: number): Promise<User> {
    try {
      const response = await apiClient.get<ApiResponse<User>>(`${ADMIN_BASE_URL}/customers/${id}`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  async updateUserStatus(id: number, status: string): Promise<User> {
    try {
      const response = await apiClient.patch<ApiResponse<User>>(`${ADMIN_BASE_URL}/customers/${id}/status`, { status });
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  async banUser(id: number, reason: string): Promise<User> {
    try {
      const response = await apiClient.post<ApiResponse<User>>(`${ADMIN_BASE_URL}/customers/${id}/ban`, { reason });
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  // Sellers Management
  async listSellers(status?: string, page?: number, limit?: number): Promise<any> {
    try {
      const response = await apiClient.get<ListResponse<Seller>>(`${ADMIN_BASE_URL}/sellers`, {
        params: { status, page, limit },
      });
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  async getSeller(id: number): Promise<Seller> {
    try {
      const response = await apiClient.get<ApiResponse<Seller>>(`${ADMIN_BASE_URL}/sellers/${id}`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  async approveSeller(id: number): Promise<Seller> {
    try {
      const response = await apiClient.post<ApiResponse<Seller>>(`${ADMIN_BASE_URL}/sellers/${id}/approve`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  async rejectSeller(id: number, reason: string): Promise<Seller> {
    try {
      const response = await apiClient.post<ApiResponse<Seller>>(`${ADMIN_BASE_URL}/sellers/${id}/reject`, {
        reason,
      });
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
};
