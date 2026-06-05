// Website content types - matching backend models

export interface Banner {
  id: string;
  title: string;
  text: string;
  subtitle: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Hero {
  id: string;
  title: string;
  subtitle: string;
  ctaText?: string;
  description: string;
  imageUrl?: string;
  backgroundImageUrl?: string;
  videoUrl?: string;
  videoPosterUrl?: string;
  buttonText: string;
  buttonUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Section {
  id: string;
  sectionType: string;
  title: string;
  subtitle?: string;
  content?: string;
  imageUrl?: string;
  videoUrl?: string;
  videoPosterUrl?: string;
  buttonText?: string;
  buttonLink?: string;
  backgroundImageUrl?: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Testimonial {
  id: string;
  author: string;
  location?: string;
  comment: string;
  imageUrl?: string;
  rating: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InstagramPost {
  id: string;
  imageUrl: string;
  caption?: string;
  postUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WebsiteSetting {
  id: string;
  key: string;
  value: string;
  type: 'string' | 'number' | 'boolean' | 'json';
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WebsitePage {
  id: string;
  slug: string;
  title: string;
  content: string;
  metaTitle?: string;
  metaDescription?: string;
  isPublished: boolean;
  order?: number;
  createdAt: string;
  updatedAt: string;
}

// Page types
export enum PageType {
  ABOUT_US = 'about_us',
  SHIPPING_POLICY = 'shipping_policy',
  RETURNS_REFUNDS = 'returns_refunds',
  FAQS = 'faqs',
  TERMS_CONDITIONS = 'terms_conditions',
  PRIVACY_POLICY = 'privacy_policy',
  SITEMAP = 'sitemap'
}

export interface Page {
  id: string;
  type: PageType;
  slug: string;
  title: string;
  content: string;
  metaTitle?: string;
  metaDescription?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

// Legacy interfaces for backward compatibility
export interface AboutUs {
  id: string;
  title: string;
  content: string;
  metaTitle?: string;
  metaDescription?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ShippingPolicy {
  id: string;
  title: string;
  content: string;
  metaTitle?: string;
  metaDescription?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ReturnsRefunds {
  id: string;
  title: string;
  content: string;
  metaTitle?: string;
  metaDescription?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FAQs {
  id: string;
  title: string;
  content: string;
  metaTitle?: string;
  metaDescription?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PrivacyPolicy {
  id: string;
  title: string;
  content: string;
  metaTitle?: string;
  metaDescription?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TermsConditions {
  id: string;
  title: string;
  content: string;
  metaTitle?: string;
  metaDescription?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Sitemap {
  id: string;
  title: string;
  content: string;
  metaTitle?: string;
  metaDescription?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

// Request/Response types
export interface CreateBannerRequest {
  title: string;
  text: string;
  subtitle: string;
  isActive?: boolean;
}

export interface UpdateBannerRequest extends Partial<CreateBannerRequest> {}

export interface CreateHeroRequest {
  title: string;
  subtitle: string;
  ctaText?: string;
  description: string;
  imageUrl?: string;
  backgroundImageUrl?: string;
  videoUrl?: string;
  videoPosterUrl?: string;
  buttonText: string;
  buttonUrl: string;
  isActive?: boolean;
}

export interface UpdateHeroRequest extends Partial<CreateHeroRequest> {}

export interface CreateSectionRequest {
  sectionType: Section['sectionType'];
  title: string;
  subtitle?: string;
  content?: string;
  imageUrl?: string;
  videoUrl?: string;
  videoPosterUrl?: string;
  buttonText?: string;
  buttonLink?: string;
  backgroundImageUrl?: string;
  isActive?: boolean;
  order?: number;
}

export interface UpdateSectionRequest extends Partial<CreateSectionRequest> {}

export interface CreateTestimonialRequest {
  name: string;
  role?: string;
  content: string;
  imageUrl?: string;
  rating: number;
  isActive?: boolean;
}

export interface UpdateTestimonialRequest extends Partial<CreateTestimonialRequest> {}

export interface CreateInstagramPostRequest {
  imageUrl: string;
  caption?: string;
  postUrl?: string;
  isActive?: boolean;
}

export interface UpdateInstagramPostRequest extends Partial<CreateInstagramPostRequest> {}

export interface CreateWebsiteSettingRequest {
  key: string;
  value: string;
  type: WebsiteSetting['type'];
  description?: string;
}

export interface UpdateWebsiteSettingRequest extends Partial<CreateWebsiteSettingRequest> {}

export interface CreateWebsitePageRequest {
  slug: string;
  title: string;
  content: string;
  metaTitle?: string;
  metaDescription?: string;
  isPublished?: boolean;
}

export interface UpdateWebsitePageRequest extends Partial<CreateWebsitePageRequest> {}

export interface CreateSupportPageRequest {
  title: string;
  content: string;
  metaTitle?: string;
  metaDescription?: string;
  isPublished?: boolean;
}

export interface UpdateSupportPageRequest extends Partial<CreateSupportPageRequest> {}

// Promotion types
export type PromotionType = 'fixed_discount' | 'percentage_discount' | 'free_gift' | 'free_shipping' | 'bundle' | 'tiered';

export interface Promotion {
  id: string;
  title: string;
  description?: string;
  type: PromotionType;
  bannerText: string;
  minOrderValue?: number;
  maxOrderValue?: number;
  minQuantity?: number;
  maxQuantity?: number;
  applicableCategories?: string[];
  applicableProducts?: string[];
  excludeProducts?: string[];
  discountValue?: number;
  giftProductId?: string;
  freeText?: string;
  validFrom: string;
  validUntil: string;
  usageLimit?: number;
  currentUsage?: number;
  isActive: boolean;
  priority: number;
  displayOnHomepage: boolean;
  displayOnCheckout: boolean;
  displayOnProductPages: boolean;
  badgeIcon?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePromotionRequest {
  title: string;
  description?: string;
  type: PromotionType;
  bannerText: string;
  minOrderValue?: number;
  maxOrderValue?: number;
  minQuantity?: number;
  maxQuantity?: number;
  applicableCategories?: string[];
  applicableProducts?: string[];
  excludeProducts?: string[];
  discountValue?: number;
  giftProductId?: string;
  freeText?: string;
  validFrom: string;
  validUntil: string;
  usageLimit?: number;
  isActive?: boolean;
  priority?: number;
  displayOnHomepage?: boolean;
  displayOnCheckout?: boolean;
  displayOnProductPages?: boolean;
  badgeIcon?: string;
}

export interface UpdatePromotionRequest extends Partial<CreatePromotionRequest> {}

// Coupon types
export type CouponType = 'fixed_discount' | 'percentage_discount' | 'free_shipping' | 'free_order';

export interface Coupon {
  id: string;
  code: string;
  title: string;
  description?: string;
  type: CouponType;
  discountValue?: number;
  minOrderValue?: number;
  maxDiscountAmount?: number;
  validFrom: string;
  validUntil: string;
  usageLimit?: number;
  currentUsage: number;
  perUserLimit?: number;
  applicableCategories?: string[];
  applicableProducts?: string[];
  excludeProducts?: string[];
  firstOrderOnly: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCouponRequest {
  code: string;
  title: string;
  description?: string;
  type: CouponType;
  discountValue?: number;
  minOrderValue?: number;
  maxDiscountAmount?: number;
  validFrom: string;
  validUntil: string;
  usageLimit?: number;
  perUserLimit?: number;
  applicableCategories?: string[];
  applicableProducts?: string[];
  excludeProducts?: string[];
  firstOrderOnly?: boolean;
  isActive?: boolean;
}

export interface UpdateCouponRequest extends Partial<CreateCouponRequest> {}

// API Response types
export interface WebsiteApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface WebsiteListResponse<T> {
  success: boolean;
  data: T[];
  total?: number;
  page?: number;
  limit?: number;
}