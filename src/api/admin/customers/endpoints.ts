// Admin Customers API Endpoints
export const ADMIN_CUSTOMERS_LIST = '/admin/customers';
export const ADMIN_CUSTOMERS_GET = (id: string) => `/admin/customers/${id}`;
export const ADMIN_CUSTOMERS_CREATE = '/admin/customers';
export const ADMIN_CUSTOMERS_UPDATE = (id: string) => `/admin/customers/${id}`;
export const ADMIN_CUSTOMERS_DELETE = (id: string) => `/admin/customers/${id}`;
export const ADMIN_CUSTOMERS_BAN = (id: string) => `/admin/customers/${id}/ban`;
export const ADMIN_CUSTOMERS_UNBAN = (id: string) => `/admin/customers/${id}/unban`;
