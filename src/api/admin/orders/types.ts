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
  customerPhone: string;
  taxAmount: number;
  sellerId: string;
  sellerName: string;
  items: AdminOrderItem[];
  shippingAddressPhone: string;
  shippingAddressLine1: string;
  shippingAddressLine2?: string;
  shippingCity: string;
  shippingState: string;
  shippingPostalCode: string;
  shippingCountry: string;
  shippingCost: number;
  paymentMethod: string;
  finalAmount: number;
  status:'pending' |'CONFIRMED' |'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  disputed: boolean;
  totalAmount: number;
  shippingAddress: string;
  estimatedDelivery?: string;
  createdAt: string;
  updatedAt: string;
  refundedAt?: string;
  metadata?: {
    promotion?: {
      id: string;
      title: string;
      type: 'free_gift' | 'percentage' | 'fixed_amount';
      discountAmount: number;
    };
    appliedAt: string;
    [key: string]: any; // Allows for future "lots of things"
  };
}

export interface AdminOrdersResponse {
  success: boolean;
  data: {
    data: AdminOrder[];
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
  trackingNumber?: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  notes?: string;
  statusReason?: string;
}

export interface AdminOrderRefundInput {
  reason: string;
  amount?: number;
}

export interface AdminOrderDisputeInput {
  reason: string;
  resolution?: string;
}
