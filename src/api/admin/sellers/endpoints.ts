export const ADMIN_SELLERS_LIST = '/admin/sellers';
export const ADMIN_SELLERS_GET = (id: string) => `/admin/sellers/${id}`;
export const ADMIN_SELLERS_CREATE = '/admin/sellers';
export const ADMIN_SELLERS_UPDATE = (id: string) => `/admin/sellers/${id}`;
export const ADMIN_SELLERS_DELETE = (id: string) => `/admin/sellers/${id}`;
export const ADMIN_SELLERS_APPROVE = (id: string) => `/admin/sellers/${id}/approve`;
export const ADMIN_SELLERS_REJECT = (id: string) => `/admin/sellers/${id}/reject`;
export const ADMIN_SELLERS_SUSPEND = (id: string) => `/admin/sellers/${id}/suspend`;
export const ADMIN_SELLERS_RESTORE = (id: string) => `/admin/sellers/${id}/restore`;
