import { apiMethods } from '../index';
import { ADMIN_LOGIN, ADMIN_ME, ADMIN_LOGOUT, ADMIN_REFRESH_TOKEN, } from './endpoints';
export const adminAuthApi = {
    login: async (data) => {
        const response = await apiMethods.post(ADMIN_LOGIN, data);
        return response.data;
    },
    getProfile: async () => {
        const response = await apiMethods.get(ADMIN_ME);
        // Normalize both old and new backend payload shapes
        return response.data.data?.user || response.data.data;
    },
    logout: async () => {
        await apiMethods.post(ADMIN_LOGOUT);
    },
    refreshToken: async () => {
        const response = await apiMethods.post(ADMIN_REFRESH_TOKEN);
        return response.data;
    },
};
