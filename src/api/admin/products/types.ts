/**
 * Admin Product Variant Detail
 * Comprehensive variant information with timestamps
 */
export interface AdminProductVariantDetail {
  id: string;
  sku?: string;
  price: number;
  weight?: number;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

/**
 * Admin Product Seller Offering
 * Information about sellers offering this product
 */
export interface AdminProductSellerOffering {
  sellerPrice: number;
  sellerWeight?: number;
  sellerBusinessName: string;
  sellerOwnerName: string;
  sellerOwnerEmail: string;
  sellerBusinessPhone: string;
  sellerCommissionRate?: number;
  totalStock: number;
  availableStock: number;
  reservedStock: number;
  soldStock: number;
  reorderLevel: number;
  lastRestockedAt?: string;
}

/**
 * Admin Product
 * Complete product information with variants
 */
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
  isNew: boolean;
  isCustomerFavourites: boolean;
  isBestseller: boolean;
  stock: number;
  /**
   * Number of variants for this product
   * Available in both list and detail views
   */
  variantsCount: number;
  /**
   * Detailed variant information
   * Populated in product detail view
   */
  variants?: AdminProductVariantDetail[];
  /**
   * Seller offerings for this product
   * Populated in product detail view
   */
  sellerOfferings?: AdminProductSellerOffering[];
  sellerOfferingsPagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
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
  gst_rate?: number;
  status?: 'ACTIVE' | 'INACTIVE';
  category: string;
  images?: string[];
  stock?: number;
  variants?: Array<{
    price: number;
    discountedPrice?: number;
    discountedPercent?: number;
    weight?: number;
    weightUnit?: 'G' | 'KG';
    status?: 'ACTIVE' | 'INACTIVE';
  }>;
}

export interface AdminProductUpdateInput {
  name?: string;
  description?: string;
  gst_rate?: number;
  status?: 'ACTIVE' | 'INACTIVE';
  category?: string;
  images?: string[];
  stock?: number;
  variants?: Array<{
    price: number;
    discountedPrice?: number;
    discountedPercent?: number;
    weight?: number;
    weightUnit?: 'G' | 'KG';
    status?: 'ACTIVE' | 'INACTIVE';
  }>;
}
