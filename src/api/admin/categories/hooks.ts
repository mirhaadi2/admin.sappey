import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminCategoriesApi } from './client';
import type {
  AdminCategoriesListParams,
  AdminCategoryCreateInput,
  AdminCategoryUpdateInput,
} from './types';

export const useAdminCategoriesList = (params?: AdminCategoriesListParams) => {
  return useQuery({
    queryKey: ['admin', 'categories', params],
    queryFn: () => adminCategoriesApi.listCategories(params),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};

export const useAdminCategoryDetail = (id: string) => {
  return useQuery({
    queryKey: ['admin', 'category', id],
    queryFn: () => adminCategoriesApi.getCategory(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

export const useAdminCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AdminCategoryCreateInput) => adminCategoriesApi.createCategory(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] }),
  });
};

export const useAdminUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AdminCategoryUpdateInput }) =>
      adminCategoriesApi.updateCategory(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] }),
  });
};

export const useAdminDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminCategoriesApi.deleteCategory(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] }),
  });
};