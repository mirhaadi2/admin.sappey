import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { websiteApi } from '../client';
import {
  Banner,
  Hero,
  Section,
  Testimonial,
  InstagramPost,
  WebsiteSetting,
  WebsitePage,
  Page,
  PageType,
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
  WebsiteApiResponse,
} from '../types';

// ===================== BANNER HOOKS =====================
export const useWebsiteBanners = () => {
  const query = useQuery({
    queryKey: ['website-banners'],
    queryFn: () => websiteApi.getBanners(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    banners: query.data?.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};

export const useWebsiteBannerMutations = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: websiteApi.createBanner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['website-banners'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBannerRequest }) =>
      websiteApi.updateBanner(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['website-banners'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: websiteApi.deleteBanner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['website-banners'] });
    },
  });

  return {
    createBanner: createMutation.mutateAsync,
    updateBanner: updateMutation.mutateAsync,
    deleteBanner: deleteMutation.mutateAsync,
    createLoading: createMutation.isPending,
    updateLoading: updateMutation.isPending,
    deleteLoading: deleteMutation.isPending,
  };
};

// ===================== HERO HOOKS =====================
export const useWebsiteHero = () => {
  const query = useQuery({
    queryKey: ['website-hero'],
    queryFn: () => websiteApi.getHero(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    heroes: query.data?.data ?? [] as Hero[],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};

export const useWebsiteHeroMutations = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: websiteApi.createHero,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['website-hero'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateHeroRequest }) =>
      websiteApi.updateHero(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['website-hero'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: websiteApi.deleteHero,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['website-hero'] });
    },
  });

  return {
    createHero: createMutation.mutateAsync,
    updateHero: updateMutation.mutateAsync,
    deleteHero: deleteMutation.mutateAsync,
    createLoading: createMutation.isPending,
    updateLoading: updateMutation.isPending,
    deleteLoading: deleteMutation.isPending,
  };
};

// ===================== SECTION HOOKS =====================
export const useWebsiteSections = (type?: string) => {
  const query = useQuery({
    queryKey: ['website-sections', type],
    queryFn: () => websiteApi.getSections(type),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    sections: query.data?.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};

export const useWebsiteSectionMutations = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: websiteApi.createSection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['website-sections'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSectionRequest }) =>
      websiteApi.updateSection(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['website-sections'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: websiteApi.deleteSection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['website-sections'] });
    },
  });

  return {
    createSection: createMutation.mutateAsync,
    updateSection: updateMutation.mutateAsync,
    deleteSection: deleteMutation.mutateAsync,
    createLoading: createMutation.isPending,
    updateLoading: updateMutation.isPending,
    deleteLoading: deleteMutation.isPending,
  };
};

// ===================== TESTIMONIAL HOOKS =====================
export const useWebsiteTestimonials = () => {
  const query = useQuery({
    queryKey: ['website-testimonials'],
    queryFn: () => websiteApi.getTestimonials(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    testimonials: query.data?.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};

export const useWebsiteTestimonialMutations = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: websiteApi.createTestimonial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['website-testimonials'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTestimonialRequest }) =>
      websiteApi.updateTestimonial(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['website-testimonials'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: websiteApi.deleteTestimonial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['website-testimonials'] });
    },
  });

  return {
    createTestimonial: createMutation.mutateAsync,
    updateTestimonial: updateMutation.mutateAsync,
    deleteTestimonial: deleteMutation.mutateAsync,
    createLoading: createMutation.isPending,
    updateLoading: updateMutation.isPending,
    deleteLoading: deleteMutation.isPending,
  };
};

// ===================== INSTAGRAM HOOKS =====================
export const useWebsiteInstagramPosts = () => {
  const query = useQuery({
    queryKey: ['website-instagram'],
    queryFn: () => websiteApi.getInstagramPosts(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    instagramPosts: query.data?.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};

export const useWebsiteInstagramMutations = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: websiteApi.createInstagramPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['website-instagram'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateInstagramPostRequest }) =>
      websiteApi.updateInstagramPost(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['website-instagram'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: websiteApi.deleteInstagramPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['website-instagram'] });
    },
  });

  return {
    createInstagramPost: createMutation.mutateAsync,
    updateInstagramPost: updateMutation.mutateAsync,
    deleteInstagramPost: deleteMutation.mutateAsync,
    createLoading: createMutation.isPending,
    updateLoading: updateMutation.isPending,
    deleteLoading: deleteMutation.isPending,
  };
};

// ===================== WEBSITE PAGE HOOKS =====================
export const useWebsitePages = () => {
  const query = useQuery<WebsiteApiResponse<WebsitePage[]>, Error>({
    queryKey: ['website-pages-admin'],
    queryFn: () => websiteApi.getWebsitePages(),
    staleTime: 1000 * 60 * 5,
  });

  return {
    pages: query.data?.data || [] as WebsitePage[],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};

export const useWebsitePageMutations = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: websiteApi.createWebsitePage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['website-pages-admin'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateWebsitePageRequest }) =>
      websiteApi.updateWebsitePage(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['website-pages-admin'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => websiteApi.deleteWebsitePage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['website-pages-admin'] });
    },
  });

  return {
    createWebsitePage: createMutation.mutateAsync,
    updateWebsitePage: updateMutation.mutateAsync,
    deleteWebsitePage: deleteMutation.mutateAsync,
    createLoading: createMutation.isPending,
    updateLoading: updateMutation.isPending,
    deleteLoading: deleteMutation.isPending,
  };
};

// ===================== ABOUT US HOOKS =====================
export const useAboutUs = () => {
  const query = useQuery<WebsiteApiResponse<Page | null>, Error>({
    queryKey: ['website-about-us-admin'],
    queryFn: () => websiteApi.getAboutUs(),
    staleTime: 1000 * 60 * 5,
  });

  return {
    aboutUs: query.data?.data || null,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};

export const useAboutUsMutations = () => {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: websiteApi.updateAboutUs,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['website-about-us-admin'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: websiteApi.deleteAboutUs,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['website-about-us-admin'] });
    },
  });

  return {
    updateAboutUs: updateMutation.mutateAsync,
    deleteAboutUs: deleteMutation.mutateAsync,
    updateLoading: updateMutation.isPending,
    deleteLoading: deleteMutation.isPending,
  };
};

// ===================== SHIPPING POLICY HOOKS =====================
export const useShippingPolicy = () => {
  const query = useQuery<WebsiteApiResponse<Page | null>, Error>({
    queryKey: ['website-shipping-policy-admin'],
    queryFn: () => websiteApi.getShippingPolicy(),
    staleTime: 1000 * 60 * 5,
  });

  return {
    shippingPolicy: query.data?.data || null,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};

export const useShippingPolicyMutations = () => {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: websiteApi.updateShippingPolicy,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['website-shipping-policy-admin'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: websiteApi.deleteShippingPolicy,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['website-shipping-policy-admin'] });
    },
  });

  return {
    updateShippingPolicy: updateMutation.mutateAsync,
    deleteShippingPolicy: deleteMutation.mutateAsync,
    updateLoading: updateMutation.isPending,
    deleteLoading: deleteMutation.isPending,
  };
};

// ===================== RETURNS & REFUNDS HOOKS =====================
export const useReturnsRefunds = () => {
  const query = useQuery<WebsiteApiResponse<Page | null>, Error>({
    queryKey: ['website-returns-refunds-admin'],
    queryFn: () => websiteApi.getReturnsRefunds(),
    staleTime: 1000 * 60 * 5,
  });

  return {
    returnsRefunds: query.data?.data || null,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};

export const useReturnsRefundsMutations = () => {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: websiteApi.updateReturnsRefunds,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['website-returns-refunds-admin'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: websiteApi.deleteReturnsRefunds,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['website-returns-refunds-admin'] });
    },
  });

  return {
    updateReturnsRefunds: updateMutation.mutateAsync,
    deleteReturnsRefunds: deleteMutation.mutateAsync,
    updateLoading: updateMutation.isPending,
    deleteLoading: deleteMutation.isPending,
  };
};

// ===================== FAQs HOOKS =====================
export const useFAQs = () => {
  const query = useQuery<WebsiteApiResponse<Page | null>, Error>({
    queryKey: ['website-faqs-admin'],
    queryFn: () => websiteApi.getFAQs(),
    staleTime: 1000 * 60 * 5,
  });

  return {
    faqs: query.data?.data || null,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};

export const useFAQsMutations = () => {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: websiteApi.updateFAQs,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['website-faqs-admin'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: websiteApi.deleteFAQs,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['website-faqs-admin'] });
    },
  });

  return {
    updateFAQs: updateMutation.mutateAsync,
    deleteFAQs: deleteMutation.mutateAsync,
    updateLoading: updateMutation.isPending,
    deleteLoading: deleteMutation.isPending,
  };
};

// ===================== PRIVACY POLICY HOOKS =====================
export const usePrivacyPolicy = () => {
  const query = useQuery<WebsiteApiResponse<Page | null>, Error>({
    queryKey: ['website-privacy-policy-admin'],
    queryFn: () => websiteApi.getPrivacyPolicy(),
    staleTime: 1000 * 60 * 5,
  });

  return {
    privacyPolicy: query.data?.data || null,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};

export const usePrivacyPolicyMutations = () => {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: websiteApi.updatePrivacyPolicy,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['website-privacy-policy-admin'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: websiteApi.deletePrivacyPolicy,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['website-privacy-policy-admin'] });
    },
  });

  return {
    updatePrivacyPolicy: updateMutation.mutateAsync,
    deletePrivacyPolicy: deleteMutation.mutateAsync,
    updateLoading: updateMutation.isPending,
    deleteLoading: deleteMutation.isPending,
  };
};

// ===================== TERMS & CONDITIONS HOOKS =====================
export const useTermsConditions = () => {
  const query = useQuery<WebsiteApiResponse<Page | null>, Error>({
    queryKey: ['website-terms-conditions-admin'],
    queryFn: () => websiteApi.getTermsConditions(),
    staleTime: 1000 * 60 * 5,
  });

  return {
    termsConditions: query.data?.data || null,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};

export const useTermsConditionsMutations = () => {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: websiteApi.updateTermsConditions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['website-terms-conditions-admin'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: websiteApi.deleteTermsConditions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['website-terms-conditions-admin'] });
    },
  });

  return {
    updateTermsConditions: updateMutation.mutateAsync,
    deleteTermsConditions: deleteMutation.mutateAsync,
    updateLoading: updateMutation.isPending,
    deleteLoading: deleteMutation.isPending,
  };
};

// ===================== SITEMAP HOOKS =====================
export const useSitemap = () => {
  const query = useQuery<WebsiteApiResponse<Page | null>, Error>({
    queryKey: ['website-sitemap-admin'],
    queryFn: () => websiteApi.getSitemap(),
    staleTime: 1000 * 60 * 5,
  });

  return {
    sitemap: query.data?.data || null,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};

export const useSitemapMutations = () => {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: websiteApi.updateSitemap,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['website-sitemap-admin'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: websiteApi.deleteSitemap,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['website-sitemap-admin'] });
    },
  });

  return {
    updateSitemap: updateMutation.mutateAsync,
    deleteSitemap: deleteMutation.mutateAsync,
    updateLoading: updateMutation.isPending,
    deleteLoading: deleteMutation.isPending,
  };
};

// ===================== PROMOTION HOOKS =====================
export const useWebsitePromotions = () => {
  const query = useQuery({
    queryKey: ['website-promotions'],
    queryFn: () => websiteApi.getPromotions(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  return {
    promotions: query.data?.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};

export const useWebsitePromotionMutations = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: websiteApi.createPromotion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['website-promotions'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePromotionRequest }) =>
      websiteApi.updatePromotion(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['website-promotions'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: websiteApi.deletePromotion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['website-promotions'] });
    },
  });

  return {
    createPromotion: createMutation.mutateAsync,
    updatePromotion: updateMutation.mutateAsync,
    deletePromotion: deleteMutation.mutateAsync,
    createLoading: createMutation.isPending,
    updateLoading: updateMutation.isPending,
    deleteLoading: deleteMutation.isPending,
  };
};