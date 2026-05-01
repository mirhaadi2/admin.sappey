/**
 * Order Utility Functions
 * Helper functions for order formatting and status management
 */

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d?.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getOrderStatusColor(
  status: string
): {
  bg: string;
  text: string;
  icon?: string;
} {
  switch (status) {
    case 'pending':
      return {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
      };
    case 'processing':
      return {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
      };
    case 'shipped':
      return {
        bg: 'bg-indigo-100',
        text: 'text-indigo-800',
      };
    case 'delivered':
      return {
        bg: 'bg-green-100',
        text: 'text-green-800',
      };
    case 'cancelled':
      return {
        bg: 'bg-red-100',
        text: 'text-red-800',
      };
    case 'refunded':
      return {
        bg: 'bg-purple-100',
        text: 'text-purple-800',
      };
    default:
      return {
        bg: 'bg-slate-100',
        text: 'text-slate-800',
      };
  }
}

export function getOrderStatusLabel(status: string): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function canUpdateOrderStatus(currentStatus: string): boolean {
  return !['delivered', 'cancelled', 'refunded'].includes(currentStatus);
}

export function canRefundOrder(status: string): boolean {
  return ['delivered', 'shipped', 'processing'].includes(status);
}

export function canCancelOrder(status: string): boolean {
  return ['pending', 'processing'].includes(status);
}

export function getNextOrderStatuses(currentStatus: string): string[] {
  const transitions: Record<string, string[]> = {
    pending: ['processing', 'cancelled'],
    processing: ['shipped', 'cancelled'],
    shipped: ['delivered', 'cancelled'],
    delivered: [],
    cancelled: [],
    refunded: [],
  };

  return transitions[currentStatus] || [];
}

export function calculateRefundPercentage(refundAmount: number, totalAmount: number): number {
  if (totalAmount === 0) return 0;
  return (refundAmount / totalAmount) * 100;
}

export function isFullRefund(refundAmount: number, totalAmount: number): boolean {
  return refundAmount >= totalAmount;
}

export function getOrderDaysAgo(createdDate: string | Date): number {
  const created = typeof createdDate === 'string' ? new Date(createdDate) : createdDate;
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - created.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export function calculateShippingTime(
  createdDate: string | Date,
  estimatedDelivery: string | Date
): number {
  const created = typeof createdDate === 'string' ? new Date(createdDate) : createdDate;
  const estimated = typeof estimatedDelivery === 'string' ? new Date(estimatedDelivery) : estimatedDelivery;
  const diffTime = estimated.getTime() - created.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export function formatOrderNumber(orderNumber: string): string {
  return `#${orderNumber}`;
}

export function truncateText(text: string, length: number = 50): string {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}
