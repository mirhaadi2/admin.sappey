import { apiMethods } from '../../index';
import {
  ADMIN_SELLERS_LIST,
  ADMIN_SELLERS_GET,
  ADMIN_SELLERS_CREATE,
  ADMIN_SELLERS_UPDATE,
  ADMIN_SELLERS_DELETE,
  ADMIN_SELLERS_APPROVE,
  ADMIN_SELLERS_REJECT,
  ADMIN_SELLERS_SUSPEND,
  ADMIN_SELLERS_RESTORE,
} from './endpoints';
import {
  AdminSeller,
  AdminSellersResponse,
  AdminSellerResponse,
  AdminSellersListParams,
  AdminSellerCreateInput,
  AdminSellerUpdateInput,
  AdminSellerVerificationInput,
} from './types';

export const adminSellersApi = {
  // Fetch sellers list
  listSellers: async (params?: AdminSellersListParams): Promise<AdminSellersResponse['data']> => {
    const response = await apiMethods.get<AdminSellersResponse>(ADMIN_SELLERS_LIST, params);
    return response.data.data;
  },

  // Get single seller
  getSeller: async (id: string): Promise<AdminSellerResponse> => {
    const response = await apiMethods.get<AdminSellerResponse>(ADMIN_SELLERS_GET(id));
    return response.data;
  },

  // Create seller
  createSeller: async (data: AdminSellerCreateInput): Promise<AdminSellerResponse> => {
    const response = await apiMethods.post<AdminSellerResponse>(ADMIN_SELLERS_CREATE, data);
    return response.data;
  },

  // Update seller
  updateSeller: async (id: string, data: AdminSellerUpdateInput): Promise<AdminSellerResponse> => {
    const response = await apiMethods.put<AdminSellerResponse>(ADMIN_SELLERS_UPDATE(id), data);
    return response.data;
  },

  // Delete seller
  deleteSeller: async (id: string): Promise<{ success: boolean }> => {
    const response = await apiMethods.delete<{ success: boolean }>(ADMIN_SELLERS_DELETE(id));
    return response.data;
  },

  // Approve seller
  approveSeller: async (id: string, data?: AdminSellerVerificationInput): Promise<AdminSellerResponse> => {
    const response = await apiMethods.post<AdminSellerResponse>(ADMIN_SELLERS_APPROVE(id), data || {});
    return response.data;
  },

  // Reject seller
  rejectSeller: async (id: string, data?: AdminSellerVerificationInput): Promise<AdminSellerResponse> => {
    const response = await apiMethods.post<AdminSellerResponse>(ADMIN_SELLERS_REJECT(id), data || {});
    return response.data;
  },

  // Suspend seller
  suspendSeller: async (id: string, data?: AdminSellerVerificationInput): Promise<AdminSellerResponse> => {
    const response = await apiMethods.post<AdminSellerResponse>(ADMIN_SELLERS_SUSPEND(id), data || {});
    return response.data;
  },

  // Restore seller
  restoreSeller: async (id: string): Promise<AdminSellerResponse> => {
    const response = await apiMethods.post<AdminSellerResponse>(ADMIN_SELLERS_RESTORE(id), {});
    return response.data;
  },
};
