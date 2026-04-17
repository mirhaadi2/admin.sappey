// Admin Customers API Types
export interface AdminCustomer {
  id: string;
  email: string;
  name: string;
  phone?: string;
  status: 'active' | 'suspended' | 'banned';
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

export interface AdminCustomersResponse {
  success: boolean;
  data: {
    data: AdminCustomer[];
    total: number;
    page: number;
    limit: number;
  };
}

export interface AdminCustomerResponse {
  success: boolean;
  data: AdminCustomer;
}

export interface AdminCustomersListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface AdminCustomerCreateInput {
  email: string;
  name?: string;
  phone?: string;
}

export interface AdminCustomerUpdateInput {
  email?: string;
  name?: string;
  phone?: string;
  status?: 'active' | 'suspended' | 'banned';
}
