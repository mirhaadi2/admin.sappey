import { useState, useCallback } from 'react';
import { PlatformStats } from '../api/types';
import adminClient from '../api/admin';

interface UseAdminStatsResult {
  stats: PlatformStats | null;
  loading: boolean;
  error: Error | null;
  fetchStats: () => Promise<void>;
  clearError: () => void;
}

export const useAdminStats = (): UseAdminStatsResult => {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminClient.getStats();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch statistics'));
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    stats,
    loading,
    error,
    fetchStats,
    clearError,
  };
};
