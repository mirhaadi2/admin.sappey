import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // Automatically send cookies with requests
    headers: {
        'Content-Type': 'application/json',
    },
});
// No response interceptor for 401 - let auth services handle it gracefully
// This prevents infinite redirects during initial auth checks
// Generic API methods (for backward compatibility with auth.service.ts)
export const apiMethods = {
    get: (url, params) => apiClient.get(url, { params }),
    post: (url, data) => apiClient.post(url, data),
    put: (url, data) => apiClient.put(url, data),
    patch: (url, data) => apiClient.patch(url, data),
    delete: (url) => apiClient.delete(url),
};
export default apiClient;
