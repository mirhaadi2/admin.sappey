/**
 * Admin Dashboard API Hooks
 * React Query hooks for dashboard statistics
 */

import { useQuery } from '@tanstack/react-query';
import { adminDashboardApi } from '../client';
import type { StatsQueryParams } from '../types';

export const useAdminDashboardStats = (params?: StatsQueryParams) => {
  return useQuery({
    queryKey: ['admin', 'dashboard', 'stats', params],
    queryFn: () => adminDashboardApi.getStats(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};

export const useAdminDashboardKeyMetrics = () => {
  return useQuery({
    queryKey: ['admin', 'dashboard', 'metrics'],
    queryFn: () => adminDashboardApi.getKeyMetrics(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};

export const useAdminDashboardTrendData = (params?: StatsQueryParams) => {
  return useQuery({
    queryKey: ['admin', 'dashboard', 'trends', params],
    queryFn: () => adminDashboardApi.getTrendData(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};
