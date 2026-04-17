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

// Submodules (Customers, Sellers, Orders, Products) - Import without export * to avoid conflicts
export { 
  adminCustomersApi,
  useAdminCustomersList,
  useAdminCustomerDetail,
  useAdminCreateCustomer,
  useAdminUpdateCustomer,
  useAdminDeleteCustomer,
  useAdminBanCustomer,
  useAdminUnbanCustomer
} from './customers/index';
export type { 
  AdminCustomer as Customer,
  AdminCustomersListParams,
  AdminCustomerCreateInput,
  AdminCustomerUpdateInput
} from './customers/types';

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
  useWebsitePromotions,
  useWebsitePromotionMutations,
  useAboutUs,
  useAboutUsMutations,
  useShippingPolicy,
  useShippingPolicyMutations,
  useReturnsRefunds,
  useReturnsRefundsMutations,
  useFAQs,
  useFAQsMutations,
  usePrivacyPolicy,
  usePrivacyPolicyMutations,
  useTermsConditions,
  useTermsConditionsMutations,
  useSitemap,
  useSitemapMutations,
} from './website/index';
export type {
  Banner,
  Hero,
  Section,
  Testimonial,
  InstagramPost,
  WebsiteSetting,
  WebsitePage,
  Promotion,
  PromotionType,
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
  CreatePromotionRequest,
  UpdatePromotionRequest,
  AboutUs,
  ShippingPolicy,
  ReturnsRefunds,
  FAQs,
  PrivacyPolicy,
  TermsConditions,
  Sitemap,
  CreateSupportPageRequest,
  UpdateSupportPageRequest,
} from './website/types';
