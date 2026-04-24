import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminInventoryApi } from '../client';
import type {
    AdminInventoryQuery,
    AdminInventoryUpdateInput,
    AdminAddStockInput,
    AdminRemoveStockInput,
} from '../types';

export const useAdminInventoryList = (params?: AdminInventoryQuery) => {
    return useQuery({
        queryKey: ['admin', 'inventory', params],
        queryFn: () => adminInventoryApi.listInventory(params),
        staleTime: 1000 * 60 * 2, // 2 minutes
        gcTime: 1000 * 60 * 5, // 5 minutes
    });
};

export const useAdminInventoryStats = () => {
    return useQuery({
        queryKey: ['admin', 'inventory', 'stats'],
        queryFn: () => adminInventoryApi.getInventoryStats(),
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 10, // 10 minutes
    });
};

export const useAdminProductInventory = (productId: string) => {
    return useQuery({
        queryKey: ['admin', 'inventory', 'product', productId],
        queryFn: () => adminInventoryApi.getProductInventory(productId),
        enabled: !!productId,
        staleTime: 1000 * 60 * 2,
    });
};

export const useAdminUpdateInventory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ inventoryId, data }: { inventoryId: string; data: AdminInventoryUpdateInput }) =>
            adminInventoryApi.updateInventory(inventoryId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'inventory'] });
            queryClient.invalidateQueries({ queryKey: ['admin', 'inventory', 'stats'] });
        },
    });
};

export const useAdminAddStock = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ inventoryId, data }: { inventoryId: string; data: AdminAddStockInput }) =>
            adminInventoryApi.addStock(inventoryId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'inventory'] });
            queryClient.invalidateQueries({ queryKey: ['admin', 'inventory', 'stats'] });
        },
    });
};

export const useAdminRemoveStock = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ inventoryId, data }: { inventoryId: string; data: AdminRemoveStockInput }) =>
            adminInventoryApi.removeStock(inventoryId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'inventory'] });
            queryClient.invalidateQueries({ queryKey: ['admin', 'inventory', 'stats'] });
        },
    });
};

export const useAdminInventoryHistory = (params?: {
    page?: number;
    limit?: number;
    productId?: string;
    sellerId?: string;
    inventoryId?: string;
}) => {
    return useQuery({
        queryKey: ['admin', 'inventory', 'history', params],
        queryFn: () => adminInventoryApi.getInventoryHistory(params),
        staleTime: 1000 * 60 * 2,
        gcTime: 1000 * 60 * 5,
    });
};