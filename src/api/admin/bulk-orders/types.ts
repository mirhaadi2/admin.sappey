export interface AdminBulkOrder {
  id: string;
  bulkOrderNumber: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  product: string;
  estimatedQuantity: string;
  additionalRequirements?: string;
  status: 'pending' | 'contacted' | 'quoted' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface AdminBulkOrdersResponse {
  success: boolean;
  data: AdminBulkOrder[];
}

export interface AdminBulkOrderResponse {
  success: boolean;
  data: AdminBulkOrder;
}

export interface AdminBulkOrdersListParams {
  page?: number;
  limit?: number;
  status?: 'pending' | 'contacted' | 'quoted' | 'confirmed' | 'completed' | 'cancelled';
  search?: string;
}

export interface AdminBulkOrderStatusInput {
  status: 'pending' | 'contacted' | 'quoted' | 'confirmed' | 'completed' | 'cancelled';
}