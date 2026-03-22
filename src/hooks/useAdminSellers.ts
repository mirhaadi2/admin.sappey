import { useState, useCallback } from 'react';
import { Seller } from '../api/types';
import adminClient from '../api/admin';

interface UseAdminSellersResult {
  sellers: Seller[];
  total: number;
  loading: boolean;
  error: Error | null;
  fetchSellers: (status?: string, page?: number, limit?: number) => Promise<void>;
  getSeller: (id: number) => Promise<Seller>;
  approveSeller: (id: number) => Promise<void>;
  rejectSeller: (id: number, reason: string) => Promise<void>;
  clearError: () => void;
}

export const useAdminSellers = (): UseAdminSellersResult => {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchSellers = useCallback(async (status?: string, page?: number, limit?: number) => {
    setLoading(true);
    setError(null);
    try {
      const { sellers: data, total } = await adminClient.listSellers(status, page, limit);
      setSellers(data);
      setTotal(total);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch sellers'));
    } finally {
      setLoading(false);
    }
  }, []);

  const getSeller = useCallback(async (id: number): Promise<Seller> => {
    setLoading(true);
    setError(null);
    try {
      return await adminClient.getSeller(id);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch seller');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const approveSeller = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await adminClient.approveSeller(id);
      setSellers((prev) => prev.map((s) => (s.id === id ? updated : s)));
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to approve seller');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const rejectSeller = useCallback(async (id: number, reason: string) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await adminClient.rejectSeller(id, reason);
      setSellers((prev) => prev.map((s) => (s.id === id ? updated : s)));
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to reject seller');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    sellers,
    total,
    loading,
    error,
    fetchSellers,
    getSeller,
    approveSeller,
    rejectSeller,
    clearError,
  };
};
