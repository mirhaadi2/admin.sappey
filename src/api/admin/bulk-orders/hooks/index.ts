import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminBulkOrdersApi } from '../client';
import type { AdminBulkOrdersListParams, AdminBulkOrderStatusInput } from '../types';

export const useAdminBulkOrdersList = (params?: AdminBulkOrdersListParams) => {
  return useQuery({
    queryKey: ['admin', 'bulk-orders', params],
    queryFn: () => adminBulkOrdersApi.listBulkOrders(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useAdminUpdateBulkOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AdminBulkOrderStatusInput }) =>
      adminBulkOrdersApi.updateBulkOrderStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'bulk-orders'] });
    },
  });
};