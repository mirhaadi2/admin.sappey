export const ADMIN_PRODUCTS_LIST = '/admin/products';
export const ADMIN_PRODUCTS_GET = (id: string) => `/admin/products/${id}`;
export const ADMIN_PRODUCTS_CREATE = '/admin/products';
export const ADMIN_PRODUCTS_UPDATE = (id: string) => `/admin/products/${id}`;
export const ADMIN_PRODUCTS_DELETE = (id: string) => `/admin/products/${id}`;
export const ADMIN_PRODUCTS_PUBLISH = (id: string) => `/admin/products/${id}/publish`;
export const ADMIN_PRODUCTS_UNPUBLISH = (id: string) => `/admin/products/${id}/unpublish`;
export const ADMIN_PRODUCTS_FEATURE = (id: string) => `/admin/products/${id}/feature`;
export const ADMIN_PRODUCTS_UNFEATURE = (id: string) => `/admin/products/${id}/unfeature`;
