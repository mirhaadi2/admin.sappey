import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminUsersApi } from '../client';
import type { AdminUsersListParams, AdminUserCreateInput, AdminUserUpdateInput } from '../types';

export const useAdminUsersList = (params?: AdminUsersListParams) => {
  return useQuery({
    queryKey: ['admin', 'users', params],
    queryFn: () => adminUsersApi.listUsers(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};

export const useAdminUserDetail = (id: string) => {
  return useQuery({
    queryKey: ['admin', 'user', id],
    queryFn: () => adminUsersApi.getUser(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

export const useAdminCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AdminUserCreateInput) => adminUsersApi.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
};

export const useAdminUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AdminUserUpdateInput }) =>
      adminUsersApi.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
};

export const useAdminDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminUsersApi.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
};

export const useAdminBanUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminUsersApi.banUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
};

export const useAdminUnbanUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminUsersApi.unbanUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
};
