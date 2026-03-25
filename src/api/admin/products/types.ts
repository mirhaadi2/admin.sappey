export interface AdminProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  discountedPrice?: number;
  discountedPercent?: number;
  sku?: string;
  weight?: number;
  gst_rate?: number;
  images: string[];
  imageUrl?: string;
  sellerId: string;
  sellerName: string;
  category: string;
  categoryName?: string;
  status: 'draft' | 'published';
  isFeatured: boolean;
  stock: number;
  variants?: Array<{ id?: string; sku?: string; price: number; weight?: number; status?: 'ACTIVE' | 'INACTIVE' }>;
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
    data: AdminProduct[];
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
  slug?: string;
  description: string;
  price: number | string;
  discountedPrice?: number | string | null;
  sku?: string;
  weight?: number;
  gst_rate?: number;
  status?: 'ACTIVE' | 'INACTIVE';
  category: string;
  images?: string[];
  sellerId?: string;
  variants?: Array<{ price: number; weight?: number; status?: 'ACTIVE' | 'INACTIVE' }>;
}

export interface AdminProductUpdateInput {
  name?: string;
  description?: string;
  price?: number;
  discountedPrice?: number;
  sku?: string;
  weight?: number;
  gst_rate?: number;
  status?: 'ACTIVE' | 'INACTIVE';
  category?: string;
  images?: string[];
  stock?: number;
  variants?: Array<{ price: number; weight?: number; status?: 'ACTIVE' | 'INACTIVE' }>;
}
