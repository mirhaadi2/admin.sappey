import { apiClient } from '../index';
const ADMIN_BASE_URL = '/admin';
export const adminClient = {
    // Statistics
    async getStats() {
        try {
            const response = await apiClient.get(`${ADMIN_BASE_URL}/stats`);
            return response.data.data;
        }
        catch (error) {
            throw error;
        }
    },
    // Users Management
    async listUsers(page, limit, search) {
        try {
            const response = await apiClient.get(`${ADMIN_BASE_URL}/users`, {
                params: { page, limit, search },
            });
            return { users: response.data.data, total: response.data.total };
        }
        catch (error) {
            throw error;
        }
    },
    async getUser(id) {
        try {
            const response = await apiClient.get(`${ADMIN_BASE_URL}/users/${id}`);
            return response.data.data;
        }
        catch (error) {
            throw error;
        }
    },
    async updateUserStatus(id, status) {
        try {
            const response = await apiClient.patch(`${ADMIN_BASE_URL}/users/${id}/status`, { status });
            return response.data.data;
        }
        catch (error) {
            throw error;
        }
    },
    async banUser(id, reason) {
        try {
            const response = await apiClient.post(`${ADMIN_BASE_URL}/users/${id}/ban`, { reason });
            return response.data.data;
        }
        catch (error) {
            throw error;
        }
    },
    // Sellers Management
    async listSellers(status, page, limit) {
        try {
            const response = await apiClient.get(`${ADMIN_BASE_URL}/sellers`, {
                params: { status, page, limit },
            });
            return { sellers: response.data.data, total: response.data.total };
        }
        catch (error) {
            throw error;
        }
    },
    async getSeller(id) {
        try {
            const response = await apiClient.get(`${ADMIN_BASE_URL}/sellers/${id}`);
            return response.data.data;
        }
        catch (error) {
            throw error;
        }
    },
    async approveSeller(id) {
        try {
            const response = await apiClient.post(`${ADMIN_BASE_URL}/sellers/${id}/approve`);
            return response.data.data;
        }
        catch (error) {
            throw error;
        }
    },
    async rejectSeller(id, reason) {
        try {
            const response = await apiClient.post(`${ADMIN_BASE_URL}/sellers/${id}/reject`, {
                reason,
            });
            return response.data.data;
        }
        catch (error) {
            throw error;
        }
    },
};
