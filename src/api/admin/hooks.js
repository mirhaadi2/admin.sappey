import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminAuthApi } from './client';
export const useAdminAuth = () => {
    const queryClient = useQueryClient();
    const loginMutation = useMutation({
        mutationFn: adminAuthApi.login,
        onSuccess: (data) => {
            // Session cookie is set automatically by the server
            // Just update the user data in the cache
            queryClient.setQueryData(['admin', 'user'], data.data.user);
        },
    });
    const profileQuery = useQuery({
        queryKey: ['admin', 'user'],
        queryFn: adminAuthApi.getProfile,
        retry: 1,
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 10, // 10 minutes
    });
    const logoutMutation = useMutation({
        mutationFn: adminAuthApi.logout,
        onSuccess: () => {
            // Session is destroyed on server, clear cache
            queryClient.clear();
        },
    });
    return {
        // Data
        user: profileQuery.data,
        isLoading: profileQuery.isLoading,
        isAuthenticated: !!profileQuery.data, // User is authenticated if profile exists
        // Mutations
        loginMutation,
        logoutMutation,
        // Profile query
        profileQuery,
    };
};
