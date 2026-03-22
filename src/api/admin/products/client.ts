import { apiMethods } from '../../index';
import {
  ADMIN_PRODUCTS_LIST,
  ADMIN_PRODUCTS_GET,
  ADMIN_PRODUCTS_CREATE,
  ADMIN_PRODUCTS_UPDATE,
  ADMIN_PRODUCTS_DELETE,
  ADMIN_PRODUCTS_PUBLISH,
  ADMIN_PRODUCTS_UNPUBLISH,
  ADMIN_PRODUCTS_FEATURE,
  ADMIN_PRODUCTS_UNFEATURE,
} from './endpoints';
import {
  AdminProduct,
  AdminProductsResponse,
  AdminProductResponse,
  AdminProductsListParams,
  AdminProductCreateInput,
  AdminProductUpdateInput,
} from './types';

export const adminProductsApi = {
  // Fetch products list
  listProducts: async (params?: AdminProductsListParams): Promise<AdminProductsResponse> => {
    const response = await apiMethods.get<AdminProductsResponse>(ADMIN_PRODUCTS_LIST, params);
    return response.data;
  },

  // Get single product
  getProduct: async (id: string): Promise<AdminProductResponse> => {
    const response = await apiMethods.get<AdminProductResponse>(ADMIN_PRODUCTS_GET(id));
    return response.data;
  },

  // Create product
  createProduct: async (data: AdminProductCreateInput): Promise<AdminProductResponse> => {
    const response = await apiMethods.post<AdminProductResponse>(ADMIN_PRODUCTS_CREATE, data);
    return response.data;
  },

  // Update product
  updateProduct: async (id: string, data: AdminProductUpdateInput): Promise<AdminProductResponse> => {
    const response = await apiMethods.put<AdminProductResponse>(ADMIN_PRODUCTS_UPDATE(id), data);
    return response.data;
  },

  // Delete product
  deleteProduct: async (id: string): Promise<{ success: boolean }> => {
    const response = await apiMethods.delete<{ success: boolean }>(ADMIN_PRODUCTS_DELETE(id));
    return response.data;
  },

  // Publish product
  publishProduct: async (id: string): Promise<AdminProductResponse> => {
    const response = await apiMethods.post<AdminProductResponse>(ADMIN_PRODUCTS_PUBLISH(id), {});
    return response.data;
  },

  // Unpublish product
  unpublishProduct: async (id: string): Promise<AdminProductResponse> => {
    const response = await apiMethods.post<AdminProductResponse>(ADMIN_PRODUCTS_UNPUBLISH(id), {});
    return response.data;
  },

  // Feature product
  featureProduct: async (id: string): Promise<AdminProductResponse> => {
    const response = await apiMethods.post<AdminProductResponse>(ADMIN_PRODUCTS_FEATURE(id), {});
    return response.data;
  },

  // Unfeature product
  unfeatureProduct: async (id: string): Promise<AdminProductResponse> => {
    const response = await apiMethods.post<AdminProductResponse>(ADMIN_PRODUCTS_UNFEATURE(id), {});
    return response.data;
  },
};
