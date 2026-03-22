import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminOrdersApi } from '../client';
import type { AdminOrdersListParams, AdminOrderStatusInput, AdminOrderRefundInput, AdminOrderDisputeInput } from '../types';

export const useAdminOrdersList = (params?: AdminOrdersListParams) => {
  return useQuery({
    queryKey: ['admin', 'orders', params],
    queryFn: () => adminOrdersApi.listOrders(params),
    staleTime: 1000 * 60 * 2, // 2 minutes (orders are more time-sensitive)
    gcTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useAdminOrderDetail = (id: string) => {
  return useQuery({
    queryKey: ['admin', 'order', id],
    queryFn: () => adminOrdersApi.getOrder(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 2,
  });
};

export const useAdminUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AdminOrderStatusInput }) =>
      adminOrdersApi.updateOrderStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
    },
  });
};

export const useAdminRefundOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AdminOrderRefundInput }) =>
      adminOrdersApi.refundOrder(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
    },
  });
};

export const useAdminCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      adminOrdersApi.cancelOrder(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
    },
  });
};

export const useAdminDisputeOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AdminOrderDisputeInput }) =>
      adminOrdersApi.disputeOrder(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
    },
  });
};
