// Admin Users API Endpoints
export const ADMIN_USERS_LIST = '/admin/users';
export const ADMIN_USERS_GET = (id: string) => `/admin/users/${id}`;
export const ADMIN_USERS_CREATE = '/admin/users';
export const ADMIN_USERS_UPDATE = (id: string) => `/admin/users/${id}`;
export const ADMIN_USERS_DELETE = (id: string) => `/admin/users/${id}`;
export const ADMIN_USERS_BAN = (id: string) => `/admin/users/${id}/ban`;
export const ADMIN_USERS_UNBAN = (id: string) => `/admin/users/${id}/unban`;
