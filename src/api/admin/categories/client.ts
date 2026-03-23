import { apiMethods } from '../../index';
import {
  ADMIN_CATEGORIES_LIST,
  ADMIN_CATEGORIES_GET,
  ADMIN_CATEGORIES_CREATE,
  ADMIN_CATEGORIES_UPDATE,
  ADMIN_CATEGORIES_DELETE,
} from './endpoints';
import type {
  AdminCategoriesListResponse,
  AdminCategoryResponse,
  AdminCategoriesListParams,
  AdminCategoryCreateInput,
  AdminCategoryUpdateInput,
} from './types';

export const adminCategoriesApi = {
  listCategories: async (params?: AdminCategoriesListParams): Promise<AdminCategoriesListResponse> => {
    const response = await apiMethods.get<AdminCategoriesListResponse>(ADMIN_CATEGORIES_LIST, { params });
    return response.data;
  },

  getCategory: async (id: string): Promise<AdminCategoryResponse> => {
    const response = await apiMethods.get<AdminCategoryResponse>(ADMIN_CATEGORIES_GET(id));
    return response.data;
  },

  createCategory: async (data: AdminCategoryCreateInput): Promise<AdminCategoryResponse> => {
    const response = await apiMethods.post<AdminCategoryResponse>(ADMIN_CATEGORIES_CREATE, data);
    return response.data;
  },

  updateCategory: async (id: string, data: AdminCategoryUpdateInput): Promise<AdminCategoryResponse> => {
    const response = await apiMethods.patch<AdminCategoryResponse>(ADMIN_CATEGORIES_UPDATE(id), data);
    return response.data;
  },

  deleteCategory: async (id: string): Promise<void> => {
    await apiMethods.delete(ADMIN_CATEGORIES_DELETE(id));
  },
};