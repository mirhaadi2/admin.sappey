import { apiMethods } from '../../index';
import {
  ADMIN_ORDERS_LIST,
  ADMIN_ORDERS_GET,
  ADMIN_ORDERS_UPDATE_STATUS,
  ADMIN_ORDERS_REFUND,
  ADMIN_ORDERS_CANCEL,
  ADMIN_ORDERS_DISPUTE,
} from './endpoints';
import {
  AdminOrder,
  AdminOrdersResponse,
  AdminOrderResponse,
  AdminOrdersListParams,
  AdminOrderStatusInput,
  AdminOrderRefundInput,
  AdminOrderDisputeInput,
} from './types';

export const adminOrdersApi = {
  // Fetch orders list
  listOrders: async (params?: AdminOrdersListParams): Promise<AdminOrdersResponse> => {
    const response = await apiMethods.get<AdminOrdersResponse>(ADMIN_ORDERS_LIST, params);
    return response.data;
  },

  // Get single order
  getOrder: async (id: string): Promise<AdminOrderResponse> => {
    const response = await apiMethods.get<AdminOrderResponse>(ADMIN_ORDERS_GET(id));
    return response.data;
  },

  // Update order status
  updateOrderStatus: async (id: string, data: AdminOrderStatusInput): Promise<AdminOrderResponse> => {
    const response = await apiMethods.put<AdminOrderResponse>(ADMIN_ORDERS_UPDATE_STATUS(id), data);
    return response.data;
  },

  // Process refund
  refundOrder: async (id: string, data: AdminOrderRefundInput): Promise<AdminOrderResponse> => {
    const response = await apiMethods.post<AdminOrderResponse>(ADMIN_ORDERS_REFUND(id), data);
    return response.data;
  },

  // Cancel order
  cancelOrder: async (id: string, reason?: string): Promise<AdminOrderResponse> => {
    const response = await apiMethods.post<AdminOrderResponse>(ADMIN_ORDERS_CANCEL(id), { reason });
    return response.data;
  },

  // Handle dispute
  disputeOrder: async (id: string, data: AdminOrderDisputeInput): Promise<AdminOrderResponse> => {
    const response = await apiMethods.post<AdminOrderResponse>(ADMIN_ORDERS_DISPUTE(id), data);
    return response.data;
  },
};
