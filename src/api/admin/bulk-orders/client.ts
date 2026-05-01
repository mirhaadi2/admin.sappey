import { apiMethods } from '../../index';
import {
  ADMIN_BULK_ORDERS_LIST,
  ADMIN_BULK_ORDERS_UPDATE_STATUS,
} from './endpoints';
import {
  AdminBulkOrder,
  AdminBulkOrdersResponse,
  AdminBulkOrderResponse,
  AdminBulkOrdersListParams,
  AdminBulkOrderStatusInput,
} from './types';

export const adminBulkOrdersApi = {
  // Fetch bulk orders list
  listBulkOrders: async (params?: AdminBulkOrdersListParams): Promise<AdminBulkOrdersResponse> => {
    const response = await apiMethods.get<AdminBulkOrdersResponse>(ADMIN_BULK_ORDERS_LIST, params);
    return response.data;
  },

  // Update bulk order status
  updateBulkOrderStatus: async (id: string, data: AdminBulkOrderStatusInput): Promise<AdminBulkOrderResponse> => {
    const response = await apiMethods.put<AdminBulkOrderResponse>(ADMIN_BULK_ORDERS_UPDATE_STATUS(id), data);
    return response.data;
  },
};