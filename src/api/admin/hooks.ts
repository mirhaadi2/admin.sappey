import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminAuthApi } from './client';
import { AuthResponse, LoginData, AdminUser } from './types';

export const useAdminAuth = () => {
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: adminAuthApi.login,
    onSuccess: (data: AuthResponse) => {
      // Session cookie is set automatically by the server
      // Just update the user data in the cache
      queryClient.setQueryData(['admin', 'user'], data.data.user);
    },
  });

  const profileQuery = useQuery<AdminUser | null, Error>({
    queryKey: ['admin', 'user'],
    queryFn: adminAuthApi.getProfile,
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  const logoutMutation = useMutation({
    mutationFn: adminAuthApi.logout,
    onMutate: async () => {
      // Optimistically clear user and cancel in-flight queries to prevent stale protected data fetch
      await queryClient.cancelQueries({ queryKey: ['admin', 'user'] });
      queryClient.setQueryData(['admin', 'user'], null);
      await queryClient.cancelQueries();
    },
    onSuccess: () => {
      // Session is destroyed on server, clear client cache
      queryClient.clear();
    },
  });

  return {
    // Data
    user: profileQuery.data,
    isLoading: profileQuery.isInitialLoading,
    isAuthenticated: !!profileQuery.data, // User is authenticated if profile exists

    // Mutations
    loginMutation,
    logoutMutation,

    // Profile query
    profileQuery,
  };
};
