/**
 * Admin Dashboard API Client
 * Raw API calls for dashboard statistics
 */

import { apiMethods } from '../../index';
import {
  ADMIN_DASHBOARD_STATS,
  ADMIN_DASHBOARD_SUMMARY,
  ADMIN_DASHBOARD_TRENDS,
} from './endpoints';
import {
  DashboardStatsResponse,
  PlatformStats,
  StatsQueryParams,
} from './types';

export const adminDashboardApi = {
  // Fetch platform statistics with trends
  getStats: async (params?: StatsQueryParams): Promise<DashboardStatsResponse> => {
    const response = await apiMethods.get<DashboardStatsResponse>(ADMIN_DASHBOARD_STATS, params);
    return response.data;
  },

  // Fetch only key metrics (summary)
  getKeyMetrics: async (): Promise<DashboardStatsResponse> => {
    const response = await apiMethods.get<DashboardStatsResponse>(ADMIN_DASHBOARD_SUMMARY);
    return response.data;
  },

  // Fetch trend data for charts
  getTrendData: async (params?: StatsQueryParams): Promise<{ success: boolean; data: { userGrowthTrend: any[]; orderTrend: any[] } }> => {
    const response = await apiMethods.get<any>(ADMIN_DASHBOARD_TRENDS, params);
    return response.data;
  },
};
