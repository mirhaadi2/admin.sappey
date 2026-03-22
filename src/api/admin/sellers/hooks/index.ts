import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminSellersApi } from '../client';
import type { AdminSellersListParams, AdminSellerCreateInput, AdminSellerUpdateInput, AdminSellerVerificationInput } from '../types';

export const useAdminSellersList = (params?: AdminSellersListParams) => {
  return useQuery({
    queryKey: ['admin', 'sellers', params],
    queryFn: () => adminSellersApi.listSellers(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};

export const useAdminSellerDetail = (id: string) => {
  return useQuery({
    queryKey: ['admin', 'seller', id],
    queryFn: () => adminSellersApi.getSeller(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

export const useAdminCreateSeller = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AdminSellerCreateInput) => adminSellersApi.createSeller(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'sellers'] });
    },
  });
};

export const useAdminUpdateSeller = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AdminSellerUpdateInput }) =>
      adminSellersApi.updateSeller(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'sellers'] });
    },
  });
};

export const useAdminDeleteSeller = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminSellersApi.deleteSeller(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'sellers'] });
    },
  });
};

export const useAdminApproveSeller = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data?: AdminSellerVerificationInput }) =>
      adminSellersApi.approveSeller(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'sellers'] });
    },
  });
};

export const useAdminRejectSeller = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data?: AdminSellerVerificationInput }) =>
      adminSellersApi.rejectSeller(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'sellers'] });
    },
  });
};

export const useAdminSuspendSeller = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data?: AdminSellerVerificationInput }) =>
      adminSellersApi.suspendSeller(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'sellers'] });
    },
  });
};

export const useAdminRestoreSeller = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminSellersApi.restoreSeller(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'sellers'] });
    },
  });
};
