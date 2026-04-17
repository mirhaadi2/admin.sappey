import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminCustomersApi } from './client';
import type { AdminCustomersListParams, AdminCustomerCreateInput, AdminCustomerUpdateInput } from './types';

export const useAdminCustomersList = (params?: AdminCustomersListParams) => {
  return useQuery({
    queryKey: ['admin', 'customers', params],
    queryFn: () => adminCustomersApi.listCustomers(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};

export const useAdminCustomerDetail = (id: string) => {
  return useQuery({
    queryKey: ['admin', 'customer', id],
    queryFn: () => adminCustomersApi.getCustomer(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

export const useAdminCreateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AdminCustomerCreateInput) => adminCustomersApi.createCustomer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'customers'] });
    },
  });
};

export const useAdminUpdateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AdminCustomerUpdateInput }) =>
      adminCustomersApi.updateCustomer(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'customers'] });
    },
  });
};

export const useAdminDeleteCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminCustomersApi.deleteCustomer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'customers'] });
    },
  });
};

export const useAdminBanCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminCustomersApi.banCustomer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'customers'] });
    },
  });
};

export const useAdminUnbanCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminCustomersApi.unbanCustomer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'customers'] });
    },
  });
};
