import axios, { AxiosError } from 'axios';

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
  get: <T = any>(url: string, params?: any) =>
    apiClient.get<T>(url, { params }),
  post: <T = any>(url: string, data?: any) =>
    apiClient.post<T>(url, data),
  put: <T = any>(url: string, data?: any) =>
    apiClient.put<T>(url, data),
  patch: <T = any>(url: string, data?: any) =>
    apiClient.patch<T>(url, data),
  delete: <T = any>(url: string) =>
    apiClient.delete<T>(url),
};

export default apiClient;
