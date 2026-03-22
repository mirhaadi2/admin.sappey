export const ADMIN_ORDERS_LIST = '/admin/orders';
export const ADMIN_ORDERS_GET = (id: string) => `/admin/orders/${id}`;
export const ADMIN_ORDERS_UPDATE_STATUS = (id: string) => `/admin/orders/${id}/status`;
export const ADMIN_ORDERS_REFUND = (id: string) => `/admin/orders/${id}/refund`;
export const ADMIN_ORDERS_CANCEL = (id: string) => `/admin/orders/${id}/cancel`;
export const ADMIN_ORDERS_DISPUTE = (id: string) => `/admin/orders/${id}/dispute`;
