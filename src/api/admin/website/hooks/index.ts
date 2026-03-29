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
    hero: query.data?.data || null,
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