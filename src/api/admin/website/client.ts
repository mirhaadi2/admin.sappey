import { apiMethods } from '../../index';
import {
  WEBSITE_BANNERS,
  WEBSITE_HERO,
  WEBSITE_SECTIONS,
  WEBSITE_TESTIMONIALS,
  WEBSITE_INSTAGRAM,
  WEBSITE_SETTINGS,
  WEBSITE_PAGES,
  WEBSITE_SUPPORT_PAGES,
  WEBSITE_PROMOTIONS,
} from './endpoints';
import {
  Banner,
  Hero,
  Section,
  Testimonial,
  InstagramPost,
  WebsiteSetting,
  WebsitePage,
  Page,
  Promotion,
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
  CreateSupportPageRequest,
  UpdateSupportPageRequest,
  WebsiteApiResponse,
  WebsiteListResponse,
} from './types';

export const websiteApi = {
  // ===================== BANNER APIs =====================
  getBanners: async (): Promise<WebsiteListResponse<Banner>> => {
    const response = await apiMethods.get<WebsiteListResponse<Banner>>(WEBSITE_BANNERS);
    return response.data;
  },

  createBanner: async (data: CreateBannerRequest): Promise<WebsiteApiResponse<Banner>> => {
    const response = await apiMethods.post<WebsiteApiResponse<Banner>>(WEBSITE_BANNERS, data);
    return response.data;
  },

  updateBanner: async (id: string, data: UpdateBannerRequest): Promise<WebsiteApiResponse<Banner>> => {
    const response = await apiMethods.put<WebsiteApiResponse<Banner>>(`${WEBSITE_BANNERS}/${id}`, data);
    return response.data;
  },

  deleteBanner: async (id: string): Promise<WebsiteApiResponse<void>> => {
    const response = await apiMethods.delete<WebsiteApiResponse<void>>(`${WEBSITE_BANNERS}/${id}`);
    return response.data;
  },

  // ===================== HERO APIs =====================
  getHero: async (): Promise<WebsiteApiResponse<Hero[]>> => {
    const response = await apiMethods.get<WebsiteApiResponse<Hero[]>>(WEBSITE_HERO);
    return response.data;
  },

  createHero: async (data: CreateHeroRequest): Promise<WebsiteApiResponse<Hero>> => {
    const response = await apiMethods.post<WebsiteApiResponse<Hero>>(WEBSITE_HERO, data);
    return response.data;
  },

  updateHero: async (id: string, data: UpdateHeroRequest): Promise<WebsiteApiResponse<Hero>> => {
    const response = await apiMethods.put<WebsiteApiResponse<Hero>>(`${WEBSITE_HERO}/${id}`, data);
    return response.data;
  },

  deleteHero: async (id: string): Promise<WebsiteApiResponse<void>> => {
    const response = await apiMethods.delete<WebsiteApiResponse<void>>(`${WEBSITE_HERO}/${id}`);
    return response.data;
  },

  // ===================== SECTION APIs =====================
  getSections: async (type?: string): Promise<WebsiteListResponse<Section>> => {
    const url = type ? `${WEBSITE_SECTIONS}?type=${type}` : WEBSITE_SECTIONS;
    const response = await apiMethods.get<WebsiteListResponse<Section>>(url);
    return response.data;
  },

  createSection: async (data: CreateSectionRequest): Promise<WebsiteApiResponse<Section>> => {
    const response = await apiMethods.post<WebsiteApiResponse<Section>>(WEBSITE_SECTIONS, data);
    return response.data;
  },

  updateSection: async (id: string, data: UpdateSectionRequest): Promise<WebsiteApiResponse<Section>> => {
    const response = await apiMethods.put<WebsiteApiResponse<Section>>(`${WEBSITE_SECTIONS}/${id}`, data);
    return response.data;
  },

  deleteSection: async (id: string): Promise<WebsiteApiResponse<void>> => {
    const response = await apiMethods.delete<WebsiteApiResponse<void>>(`${WEBSITE_SECTIONS}/${id}`);
    return response.data;
  },

  // ===================== TESTIMONIAL APIs =====================
  getTestimonials: async (): Promise<WebsiteListResponse<Testimonial>> => {
    const response = await apiMethods.get<WebsiteListResponse<Testimonial>>(WEBSITE_TESTIMONIALS);
    return response.data;
  },

  createTestimonial: async (data: CreateTestimonialRequest): Promise<WebsiteApiResponse<Testimonial>> => {
    const response = await apiMethods.post<WebsiteApiResponse<Testimonial>>(WEBSITE_TESTIMONIALS, data);
    return response.data;
  },

  updateTestimonial: async (id: string, data: UpdateTestimonialRequest): Promise<WebsiteApiResponse<Testimonial>> => {
    const response = await apiMethods.put<WebsiteApiResponse<Testimonial>>(`${WEBSITE_TESTIMONIALS}/${id}`, data);
    return response.data;
  },

  deleteTestimonial: async (id: string): Promise<WebsiteApiResponse<void>> => {
    const response = await apiMethods.delete<WebsiteApiResponse<void>>(`${WEBSITE_TESTIMONIALS}/${id}`);
    return response.data;
  },

  // ===================== INSTAGRAM APIs =====================
  getInstagramPosts: async (): Promise<WebsiteListResponse<InstagramPost>> => {
    const response = await apiMethods.get<WebsiteListResponse<InstagramPost>>(WEBSITE_INSTAGRAM);
    return response.data;
  },

  createInstagramPost: async (data: CreateInstagramPostRequest): Promise<WebsiteApiResponse<InstagramPost>> => {
    const response = await apiMethods.post<WebsiteApiResponse<InstagramPost>>(WEBSITE_INSTAGRAM, data);
    return response.data;
  },

  updateInstagramPost: async (id: string, data: UpdateInstagramPostRequest): Promise<WebsiteApiResponse<InstagramPost>> => {
    const response = await apiMethods.put<WebsiteApiResponse<InstagramPost>>(`${WEBSITE_INSTAGRAM}/${id}`, data);
    return response.data;
  },

  deleteInstagramPost: async (id: string): Promise<WebsiteApiResponse<void>> => {
    const response = await apiMethods.delete<WebsiteApiResponse<void>>(`${WEBSITE_INSTAGRAM}/${id}`);
    return response.data;
  },

  // ===================== SETTINGS APIs =====================
  getWebsiteSettings: async (): Promise<WebsiteListResponse<WebsiteSetting>> => {
    const response = await apiMethods.get<WebsiteListResponse<WebsiteSetting>>(WEBSITE_SETTINGS);
    return response.data;
  },

  getWebsiteSetting: async (key: string): Promise<WebsiteApiResponse<WebsiteSetting>> => {
    const response = await apiMethods.get<WebsiteApiResponse<WebsiteSetting>>(`${WEBSITE_SETTINGS}/${key}`);
    return response.data;
  },

  createWebsiteSetting: async (data: CreateWebsiteSettingRequest): Promise<WebsiteApiResponse<WebsiteSetting>> => {
    const response = await apiMethods.post<WebsiteApiResponse<WebsiteSetting>>(WEBSITE_SETTINGS, data);
    return response.data;
  },

  updateWebsiteSetting: async (key: string, data: UpdateWebsiteSettingRequest): Promise<WebsiteApiResponse<WebsiteSetting>> => {
    const response = await apiMethods.put<WebsiteApiResponse<WebsiteSetting>>(`${WEBSITE_SETTINGS}/${key}`, data);
    return response.data;
  },

  deleteWebsiteSetting: async (key: string): Promise<WebsiteApiResponse<void>> => {
    const response = await apiMethods.delete<WebsiteApiResponse<void>>(`${WEBSITE_SETTINGS}/${key}`);
    return response.data;
  },

  // ===================== PAGE APIs =====================
  getWebsitePages: async (): Promise<WebsiteListResponse<WebsitePage>> => {
    const response = await apiMethods.get<WebsiteListResponse<WebsitePage>>(WEBSITE_PAGES);
    return response.data;
  },

  getWebsitePage: async (slug: string): Promise<WebsiteApiResponse<WebsitePage>> => {
    const response = await apiMethods.get<WebsiteApiResponse<WebsitePage>>(`${WEBSITE_PAGES}/${slug}`);
    return response.data;
  },

  createWebsitePage: async (data: CreateWebsitePageRequest): Promise<WebsiteApiResponse<WebsitePage>> => {
    const response = await apiMethods.post<WebsiteApiResponse<WebsitePage>>(WEBSITE_PAGES, data);
    return response.data;
  },

  updateWebsitePage: async (slug: string, data: UpdateWebsitePageRequest): Promise<WebsiteApiResponse<WebsitePage>> => {
    const response = await apiMethods.put<WebsiteApiResponse<WebsitePage>>(`${WEBSITE_PAGES}/${slug}`, data);
    return response.data;
  },

  deleteWebsitePage: async (slug: string): Promise<WebsiteApiResponse<void>> => {
    const response = await apiMethods.delete<WebsiteApiResponse<void>>(`${WEBSITE_PAGES}/${slug}`);
    return response.data;
  },

  // ===================== SUPPORT PAGE APIs (GENERIC) =====================
  getSupportPage: async (slug: string): Promise<WebsiteApiResponse<Page | null>> => {
    const response = await apiMethods.get<WebsiteApiResponse<Page | null>>(`${WEBSITE_SUPPORT_PAGES}/${slug}`);
    return response.data;
  },

  updateSupportPage: async (slug: string, data: CreateSupportPageRequest): Promise<WebsiteApiResponse<Page>> => {
    const response = await apiMethods.put<WebsiteApiResponse<Page>>(`${WEBSITE_SUPPORT_PAGES}/${slug}`, data);
    return response.data;
  },

  deleteSupportPage: async (slug: string): Promise<WebsiteApiResponse<void>> => {
    const response = await apiMethods.delete<WebsiteApiResponse<void>>(`${WEBSITE_SUPPORT_PAGES}/${slug}`);
    return response.data;
  },

  // ===================== ABOUT US APIs =====================
  getAboutUs: async (): Promise<WebsiteApiResponse<Page | null>> => {
    return await websiteApi.getSupportPage('about-us');
  },

  updateAboutUs: async (data: CreateSupportPageRequest): Promise<WebsiteApiResponse<Page>> => {
    return await websiteApi.updateSupportPage('about-us', data);
  },

  deleteAboutUs: async (): Promise<WebsiteApiResponse<void>> => {
    return await websiteApi.deleteSupportPage('about-us');
  },

  // ===================== SHIPPING POLICY APIs =====================
  getShippingPolicy: async (): Promise<WebsiteApiResponse<Page | null>> => {
    return await websiteApi.getSupportPage('shipping-policy');
  },

  updateShippingPolicy: async (data: CreateSupportPageRequest): Promise<WebsiteApiResponse<Page>> => {
    return await websiteApi.updateSupportPage('shipping-policy', data);
  },

  deleteShippingPolicy: async (): Promise<WebsiteApiResponse<void>> => {
    return await websiteApi.deleteSupportPage('shipping-policy');
  },

  // ===================== RETURNS & REFUNDS APIs =====================
  getReturnsRefunds: async (): Promise<WebsiteApiResponse<Page | null>> => {
    return await websiteApi.getSupportPage('returns-refunds');
  },

  updateReturnsRefunds: async (data: CreateSupportPageRequest): Promise<WebsiteApiResponse<Page>> => {
    return await websiteApi.updateSupportPage('returns-refunds', data);
  },

  deleteReturnsRefunds: async (): Promise<WebsiteApiResponse<void>> => {
    return await websiteApi.deleteSupportPage('returns-refunds');
  },

  // ===================== FAQs APIs =====================
  getFAQs: async (): Promise<WebsiteApiResponse<Page | null>> => {
    return await websiteApi.getSupportPage('faqs');
  },

  updateFAQs: async (data: CreateSupportPageRequest): Promise<WebsiteApiResponse<Page>> => {
    return await websiteApi.updateSupportPage('faqs', data);
  },

  deleteFAQs: async (): Promise<WebsiteApiResponse<void>> => {
    return await websiteApi.deleteSupportPage('faqs');
  },

  // ===================== PRIVACY POLICY APIs (wrapper) =====================
  getPrivacyPolicy: async (): Promise<WebsiteApiResponse<Page | null>> => {
    return await websiteApi.getSupportPage('privacy-policy');
  },

  updatePrivacyPolicy: async (data: CreateSupportPageRequest): Promise<WebsiteApiResponse<Page>> => {
    return await websiteApi.updateSupportPage('privacy-policy', data);
  },

  deletePrivacyPolicy: async (): Promise<WebsiteApiResponse<void>> => {
    return await websiteApi.deleteSupportPage('privacy-policy');
  },

  // ===================== TERMS & CONDITIONS APIs (wrapper) =====================
  getTermsConditions: async (): Promise<WebsiteApiResponse<Page | null>> => {
    return await websiteApi.getSupportPage('terms-and-conditions');
  },

  updateTermsConditions: async (data: CreateSupportPageRequest): Promise<WebsiteApiResponse<Page>> => {
    return await websiteApi.updateSupportPage('terms-and-conditions', data);
  },

  deleteTermsConditions: async (): Promise<WebsiteApiResponse<void>> => {
    return await websiteApi.deleteSupportPage('terms-and-conditions');
  },

  // ===================== SITEMAP APIs (wrapper) =====================
  getSitemap: async (): Promise<WebsiteApiResponse<Page | null>> => {
    return await websiteApi.getSupportPage('sitemap');
  },

  updateSitemap: async (data: CreateSupportPageRequest): Promise<WebsiteApiResponse<Page>> => {
    return await websiteApi.updateSupportPage('sitemap', data);
  },

  deleteSitemap: async (): Promise<WebsiteApiResponse<void>> => {
    return await websiteApi.deleteSupportPage('sitemap');
  },

  // ===================== PROMOTION APIs =====================
  getPromotions: async (limit = 20, offset = 0): Promise<WebsiteListResponse<Promotion>> => {
    const url = `${WEBSITE_PROMOTIONS}?limit=${limit}&offset=${offset}`;
    const response = await apiMethods.get<WebsiteListResponse<Promotion>>(url);
    return response.data;
  },

  getPromotion: async (id: string): Promise<WebsiteApiResponse<Promotion>> => {
    const response = await apiMethods.get<WebsiteApiResponse<Promotion>>(`${WEBSITE_PROMOTIONS}/${id}`);
    return response.data;
  },

  createPromotion: async (data: CreatePromotionRequest): Promise<WebsiteApiResponse<Promotion>> => {
    const response = await apiMethods.post<WebsiteApiResponse<Promotion>>(WEBSITE_PROMOTIONS, data);
    return response.data;
  },

  updatePromotion: async (id: string, data: UpdatePromotionRequest): Promise<WebsiteApiResponse<Promotion>> => {
    const response = await apiMethods.put<WebsiteApiResponse<Promotion>>(`${WEBSITE_PROMOTIONS}/${id}`, data);
    return response.data;
  },

  deletePromotion: async (id: string): Promise<WebsiteApiResponse<void>> => {
    const response = await apiMethods.delete<WebsiteApiResponse<void>>(`${WEBSITE_PROMOTIONS}/${id}`);
    return response.data;
  },
};