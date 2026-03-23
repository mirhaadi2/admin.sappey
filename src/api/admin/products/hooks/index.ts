import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminProductsApi } from '../client';
import type { AdminProductsListParams, AdminProductCreateInput, AdminProductUpdateInput } from '../types';

export const useAdminProductsList = (params?: AdminProductsListParams) => {
  return useQuery({
    queryKey: ['admin', 'products', params],
    queryFn: () => adminProductsApi.listProducts(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};

export const useAdminProductDetail = (id: string) => {
  return useQuery({
    queryKey: ['admin', 'product', id],
    queryFn: () => adminProductsApi.getProduct(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

export const useAdminCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AdminProductCreateInput) => adminProductsApi.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
    },
  });
};

export const useAdminUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AdminProductUpdateInput }) =>
      adminProductsApi.updateProduct(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'product', variables.id] });
    },
  });
};

export const useAdminDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminProductsApi.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
    },
  });
};

export const useAdminPublishProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminProductsApi.publishProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
    },
  });
};

export const useAdminUnpublishProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminProductsApi.unpublishProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
    },
  });
};

export const useAdminFeatureProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminProductsApi.featureProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
    },
  });
};

export const useAdminUnfeatureProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminProductsApi.unfeatureProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
    },
  });
};
