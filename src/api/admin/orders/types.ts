export interface AdminOrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

export interface AdminOrder {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  sellerId: string;
  sellerName: string;
  items: AdminOrderItem[];
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  disputed: boolean;
  totalAmount: number;
  shippingAddress: string;
  estimatedDelivery?: string;
  createdAt: string;
  updatedAt: string;
  refundedAt?: string;
}

export interface AdminOrdersResponse {
  success: boolean;
  data: {
    orders: AdminOrder[];
    total: number;
    page: number;
    limit: number;
  };
}

export interface AdminOrderResponse {
  success: boolean;
  data: AdminOrder;
}

export interface AdminOrdersListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  disputed?: boolean;
  sellerId?: string;
  customerId?: string;
  sortBy?: 'createdAt' | 'totalAmount';
  sortOrder?: 'asc' | 'desc';
}

export interface AdminOrderStatusInput {
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  notes?: string;
}

export interface AdminOrderRefundInput {
  reason: string;
  amount?: number;
}

export interface AdminOrderDisputeInput {
  reason: string;
  resolution?: string;
}
