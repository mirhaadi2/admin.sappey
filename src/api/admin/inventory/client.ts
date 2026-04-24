import { apiMethods } from '../../index';
import {
    ADMIN_INVENTORY_LIST,
    ADMIN_INVENTORY_STATS,
    ADMIN_INVENTORY_PRODUCT,
    ADMIN_INVENTORY_UPDATE,
    ADMIN_INVENTORY_ADD_STOCK,
    ADMIN_INVENTORY_REMOVE_STOCK,
    ADMIN_INVENTORY_HISTORY,
} from './endpoints';
import {
    AdminInventoryItem,
    AdminInventoryResponse,
    AdminInventoryStatsResponse,
    AdminInventoryQuery,
    AdminInventoryUpdateInput,
    AdminAddStockInput,
    AdminRemoveStockInput,
    AdminInventoryHistoryResponse,
} from './types';

export const adminInventoryApi = {
    // List inventory with filtering and pagination
    listInventory: async (params?: AdminInventoryQuery): Promise<AdminInventoryResponse['data']> => {
        const response = await apiMethods.get<AdminInventoryResponse>(ADMIN_INVENTORY_LIST, params);
        return response.data?.data;
    },

    // Get inventory statistics
    getInventoryStats: async (): Promise<AdminInventoryStatsResponse['data']> => {
        const response = await apiMethods.get<AdminInventoryStatsResponse>(ADMIN_INVENTORY_STATS);
        return response.data?.data;
    },

    // Get inventory for a specific product
    getProductInventory: async (productId: string): Promise<AdminInventoryItem[]> => {
        const response = await apiMethods.get<{ success: boolean; data: AdminInventoryItem[] }>(ADMIN_INVENTORY_PRODUCT(productId));
        return response.data?.data || [];
    },

    // Update inventory item
    updateInventory: async (inventoryId: string, data: AdminInventoryUpdateInput): Promise<{ success: boolean; data: AdminInventoryItem }> => {
        const response = await apiMethods.put<{ success: boolean; data: AdminInventoryItem }>(ADMIN_INVENTORY_UPDATE(inventoryId), data);
        return response.data;
    },

    // Add stock to inventory
    addStock: async (inventoryId: string, data: AdminAddStockInput): Promise<{ success: boolean; data: AdminInventoryItem }> => {
        const response = await apiMethods.post<{ success: boolean; data: AdminInventoryItem }>(ADMIN_INVENTORY_ADD_STOCK(inventoryId), data);
        return response.data;
    },

    // Remove stock from inventory
    removeStock: async (inventoryId: string, data: AdminRemoveStockInput): Promise<{ success: boolean; data: AdminInventoryItem }> => {
        const response = await apiMethods.post<{ success: boolean; data: AdminInventoryItem }>(ADMIN_INVENTORY_REMOVE_STOCK(inventoryId), data);
        return response.data;
    },

    // Get inventory history
    getInventoryHistory: async (params?: { page?: number; limit?: number; productId?: string; sellerId?: string; inventoryId?: string }): Promise<AdminInventoryHistoryResponse['data']> => {
        const response = await apiMethods.get<AdminInventoryHistoryResponse>(ADMIN_INVENTORY_HISTORY, params);
        return response.data?.data;
    },
};