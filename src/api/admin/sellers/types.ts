export interface AdminSeller {
  id: string;
  // Basic info
  email: string;
  name: string;
  businessName: string;
  businessRegistrationNo: string;
  businessType: string;
  businessIdType?: string;
  gstNumber?: string;
  businessAddress: string;
  businessPhone: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  ownerName: string;
  ownerEmail: string;
  // Banking
  bankAccountName: string;
  bankAccountNumber: string;
  bankIfscCode: string;
  commissionRate: number;
  // Status
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
  verificationStatus: string;
  approvedAt?: string;
  rejectedReason?: string;
  onboardingStep: number;
  metadata?: Record<string, any>;
  // Timestamps
  createdAt: string;
  updatedAt: string;
  // Computed fields
  phone?: string;
  products: number;
  orders: number;
  revenue: number;
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
  businessLicense: string;
  phone?: string;
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
