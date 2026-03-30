// Authentication
export type { 
  LoginData,
  RegisterData,
  AuthTokens,
  AdminUser,
  AdminProfileResponse,
  AuthResponse
} from './types';
export * from './endpoints';
export { adminAuthApi } from './client';
export { useAdminAuth } from './hooks';

// Management Client
export { adminClient } from './management-client';
export { adminClient as default } from './management-client';

// Submodules (Users, Sellers, Orders, Products) - Import without export * to avoid conflicts
export { 
  adminUsersApi,
  useAdminUsersList,
  useAdminUserDetail,
  useAdminCreateUser,
  useAdminUpdateUser,
  useAdminDeleteUser,
  useAdminBanUser,
  useAdminUnbanUser
} from './users/index';
export type { 
  AdminUser as User,
  AdminUsersListParams,
  AdminUserCreateInput,
  AdminUserUpdateInput
} from './users/types';

export { 
  adminSellersApi,
  useAdminSellersList,
  useAdminSellerDetail,
  useAdminCreateSeller,
  useAdminUpdateSeller,
  useAdminDeleteSeller,
  useAdminApproveSeller,
  useAdminRejectSeller,
  useAdminSuspendSeller,
  useAdminRestoreSeller
} from './sellers/index';
export type { 
  AdminSeller,
  AdminSellersListParams,
  AdminSellerCreateInput,
  AdminSellerUpdateInput,
  AdminSellerVerificationInput
} from './sellers/types';

export { 
  adminOrdersApi,
  useAdminOrdersList,
  useAdminOrderDetail,
  useAdminUpdateOrderStatus,
  useAdminRefundOrder,
  useAdminCancelOrder,
  useAdminDisputeOrder
} from './orders/index';
export type { 
  AdminOrdersListParams,
  AdminOrderStatusInput,
  AdminOrderRefundInput,
  AdminOrderDisputeInput
} from './orders/types';

export { 
  adminProductsApi,
  useAdminProductsList,
  useAdminProductDetail,
  useAdminCreateProduct,
  useAdminUpdateProduct,
  useAdminDeleteProduct,
  useAdminPublishProduct,
  useAdminUnpublishProduct,
  useAdminFeatureProduct,
  useAdminUnfeatureProduct
} from './products/index';
export type { 
  AdminProductsListParams,
  AdminProductCreateInput,
  AdminProductUpdateInput
} from './products/types';

export {
  adminCategoriesApi,
  useAdminCategoriesList,
  useAdminCategoryDetail,
  useAdminCreateCategory,
  useAdminUpdateCategory,
  useAdminDeleteCategory,
} from './categories/index';
export type {
  AdminCategory,
  AdminCategoriesListParams,
  AdminCategoryCreateInput,
  AdminCategoryUpdateInput
} from './categories/types';

export {
  websiteApi,
  useWebsiteBanners,
  useWebsiteBannerMutations,
  useWebsiteHero,
  useWebsiteHeroMutations,
  useWebsiteSections,
  useWebsiteSectionMutations,
  useWebsiteTestimonials,
  useWebsiteTestimonialMutations,
  useWebsiteInstagramPosts,
  useWebsiteInstagramMutations,
  useWebsitePages,
  useWebsitePageMutations,
  useAboutUs,
  useAboutUsMutations,
  useShippingPolicy,
  useShippingPolicyMutations,
  useReturnsRefunds,
  useReturnsRefundsMutations,
  useFAQs,
  useFAQsMutations,
} from './website/index';
export type {
  Banner,
  Hero,
  Section,
  Testimonial,
  InstagramPost,
  WebsiteSetting,
  WebsitePage,
  CreateBannerRequest,
  UpdateBannerRequest,
  CreateHeroRequest,
  UpdateHeroRequest,
  CreateSectionRequest,
  UpdateSectionRequest,
  CreateTestimonialRequest,
  UpdateTestimonialRequest,
  CreateInstagramPostRequest,
  UpdateInstagramPostRequest,
  CreateWebsiteSettingRequest,
  UpdateWebsiteSettingRequest,
  CreateWebsitePageRequest,
  UpdateWebsitePageRequest,
  AboutUs,
  ShippingPolicy,
  ReturnsRefunds,
  FAQs,
  CreateSupportPageRequest,
  UpdateSupportPageRequest,
} from './website/types';
