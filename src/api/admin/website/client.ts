import { apiMethods } from '../../index';
import {
  WEBSITE_BANNERS,
  WEBSITE_HERO,
  WEBSITE_SECTIONS,
  WEBSITE_TESTIMONIALS,
  WEBSITE_INSTAGRAM,
  WEBSITE_SETTINGS,
  WEBSITE_PAGES,
} from './endpoints';
import {
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
    const response = await apiMethods.get<WebsiteApiResponse<Hero | null>>(WEBSITE_HERO);
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
};