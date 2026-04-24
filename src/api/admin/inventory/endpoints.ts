// Admin Inventory API Endpoints
export const ADMIN_INVENTORY_LIST = '/admin/inventory';
export const ADMIN_INVENTORY_STATS = '/admin/inventory/stats';
export const ADMIN_INVENTORY_PRODUCT = (productId: string) => `/admin/inventory/product/${productId}`;
export const ADMIN_INVENTORY_UPDATE = (inventoryId: string) => `/admin/inventory/${inventoryId}`;
export const ADMIN_INVENTORY_ADD_STOCK = (inventoryId: string) => `/admin/inventory/${inventoryId}/add-stock`;
export const ADMIN_INVENTORY_REMOVE_STOCK = (inventoryId: string) => `/admin/inventory/${inventoryId}/remove-stock`;
export const ADMIN_INVENTORY_HISTORY = '/admin/inventory/history';