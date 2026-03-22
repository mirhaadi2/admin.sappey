// User types
export interface User {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  status: 'ACTIVE' | 'INACTIVE' | 'BANNED';
  totalOrders: number;
  totalSpent: number;
  createdAt: string;
  updatedAt: string;
}

// Seller types
export interface Seller {
  id: number;
  userId: number;
  businessName: string;
  businessType: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  rating: number;
  totalOrders: number;
  totalRevenue: number;
  createdAt: string;
  updatedAt: string;
}

// Order types
export interface AdminOrder {
  id: number;
  orderNumber: string;
  buyerId: number;
  buyerName: string;
  total: number;
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  createdAt: string;
}

// Product types
export interface AdminProduct {
  id: number;
  name: string;
  seller: Seller;
  price: number;
  stock: number;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}

// Statistics types
export interface PlatformStats {
  totalUsers: number;
  totalSellers: number;
  totalOrders: number;
  totalRevenue: number;
  activeProducts: number;
  mensualRevenue: number;
  mensualOrders: number;
  userGrowthTrend: ChartDataPoint[];
  orderTrend: ChartDataPoint[];
}

export interface ChartDataPoint {
  date: string;
  value: number;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface ListResponse<T> {
  success: boolean;
  data: T[];
  total: number;
}
