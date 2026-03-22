export interface AdminSeller {
  id: string;
  email: string;
  name: string;
  businessName: string;
  businessLicense?: string;
  verificationStatus: 'pending' | 'approved' | 'rejected';
  status: 'active' | 'suspended';
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  products: number;
  orders: number;
  revenue: number;
  createdAt: string;
  updatedAt: string;
  lastActive?: string;
}

export interface AdminSellersResponse {
  success: boolean;
  data: {
    data: AdminSeller[];
    total: number;
    page: number;
    limit: number;
  };
}

export interface AdminSellerResponse {
  success: boolean;
  data: AdminSeller;
}

export interface AdminSellersListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'active' | 'suspended';
  verificationStatus?: 'pending' | 'approved' | 'rejected';
  sortBy?: 'createdAt' | 'revenue' | 'orders';
  sortOrder?: 'asc' | 'desc';
}

export interface AdminSellerCreateInput {
  email: string;
  name: string;
  businessName: string;
  phone?: string;
  password: string;
}

export interface AdminSellerUpdateInput {
  name?: string;
  businessName?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

export interface AdminSellerVerificationInput {
  reason?: string;
}
