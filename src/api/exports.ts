// Main API exports
export { default as api, apiMethods, apiClient } from './index';

// Admin Authentication & Auth Hook
export { adminAuthApi } from './admin/client';
export { useAdminAuth } from './admin/hooks';
export type { AuthResponse, LoginData, AdminUser, AdminProfileResponse } from './admin/types';

// Admin Management APIs & Hooks - Customers
export { adminCustomersApi } from './admin/customers/client';
export { 
  useAdminCustomersList, 
  useAdminCustomerDetail, 
  useAdminCreateCustomer, 
  useAdminUpdateCustomer, 
  useAdminDeleteCustomer,
  useAdminBanCustomer,
  useAdminUnbanCustomer
} from './admin/customers/hooks/index';
export type { AdminCustomersListParams, AdminCustomerCreateInput, AdminCustomerUpdateInput } from './admin/customers/types';

// Admin Management APIs & Hooks - Sellers
export { adminSellersApi } from './admin/sellers/client';
export { 
  useAdminSellersList, 
  useAdminSellerDetail, 
  useAdminCreateSeller, 
  useAdminUpdateSeller, 
  useAdminDeleteSeller,
  useAdminApproveSeller,
  useAdminRejectSeller,
  useAdminSuspendSeller,
  useAdminRestoreSeller
} from './admin/sellers/hooks/index';
export type { AdminSellersListParams, AdminSellerCreateInput, AdminSellerUpdateInput, AdminSellerVerificationInput } from './admin/sellers/types';

// Admin Management APIs & Hooks - Orders
export { adminOrdersApi } from './admin/orders/client';
export { 
  useAdminOrdersList, 
  useAdminOrderDetail, 
  useAdminUpdateOrderStatus, 
  useAdminRefundOrder,
  useAdminCancelOrder,
  useAdminDisputeOrder
} from './admin/orders/hooks/index';
export type { AdminOrdersListParams, AdminOrderStatusInput, AdminOrderRefundInput, AdminOrderDisputeInput } from './admin/orders/types';

// Admin Management APIs & Hooks - Products
export { adminProductsApi } from './admin/products/client';
export { 
  useAdminProductsList, 
  useAdminProductDetail, 
  useAdminCreateProduct, 
  useAdminUpdateProduct, 
  useAdminDeleteProduct,
  useAdminPublishProduct,
  useAdminUnpublishProduct,
  useAdminFeatureProduct,
  useAdminUnfeatureProduct
} from './admin/products/hooks/index';
export type { AdminProductsListParams, AdminProductCreateInput, AdminProductUpdateInput } from './admin/products/types';

// Admin Management APIs & Hooks - Categories
export { adminCategoriesApi } from './admin/categories/client';
export { 
  useAdminCategoriesList,
  useAdminCategoryDetail,
  useAdminCreateCategory,
  useAdminUpdateCategory,
  useAdminDeleteCategory,
} from './admin/categories/hooks';
export type { 
  AdminCategory,
  AdminCategoriesListParams,
  AdminCategoryCreateInput,
  AdminCategoryUpdateInput,
} from './admin/categories/types';

// Admin Dashboard APIs & Hooks
export { adminDashboardApi } from './admin/dashboard/client';
export { 
  useAdminDashboardStats,
  useAdminDashboardKeyMetrics,
  useAdminDashboardTrendData,
} from './admin/dashboard/hooks/index';
export type { 
  PlatformStats,
  ChartDataPoint,
  StatsQueryParams,
  DashboardStatsResponse,
} from './admin/dashboard/types';

// Admin Tools APIs
export { adminToolsApi } from './admin/tools/client';
export type { GenerateCodeRequest, GenerateCodeResponse } from './admin/tools/types';

// API utilities
export { ApiService, createApiHooks, createApiService } from './utils';

// Legacy management client export
export { adminClient } from './admin/management-client';

