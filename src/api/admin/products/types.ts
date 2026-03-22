export interface AdminProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  sellerId: string;
  sellerName: string;
  category: string;
  status: 'draft' | 'published';
  isFeatured: boolean;
  stock: number;
  orders: number;
  views: number;
  rating: number;
  reviews: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdminProductsResponse {
  success: boolean;
  data: {
    products: AdminProduct[];
    total: number;
    page: number;
    limit: number;
  };
}

export interface AdminProductResponse {
  success: boolean;
  data: AdminProduct;
}

export interface AdminProductsListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'draft' | 'published';
  category?: string;
  sellerId?: string;
  sortBy?: 'createdAt' | 'price' | 'orders' | 'rating';
  sortOrder?: 'asc' | 'desc';
}

export interface AdminProductCreateInput {
  name: string;
  description: string;
  price: number;
  category: string;
  images?: string[];
  sellerId: string;
}

export interface AdminProductUpdateInput {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  images?: string[];
  stock?: number;
}
