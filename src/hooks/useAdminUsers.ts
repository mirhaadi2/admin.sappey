import { useState, useCallback } from 'react';
import { User } from '../api/types';
import adminClient from '../api/admin';

interface UseUsersResult {
  users: User[];
  total: number;
  loading: boolean;
  error: Error | null;
  fetchUsers: (page?: number, limit?: number, search?: string) => Promise<void>;
  getUser: (id: number) => Promise<User>;
  updateUserStatus: (id: number, status: string) => Promise<void>;
  banUser: (id: number, reason: string) => Promise<void>;
  clearError: () => void;
}

export const useAdminUsers = (): UseUsersResult => {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchUsers = useCallback(async (page?: number, limit?: number, search?: string) => {
    setLoading(true);
    setError(null);
    try {
      const { users: data, total } = await adminClient.listUsers(page, limit, search);
      setUsers(data);
      setTotal(total);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch users'));
    } finally {
      setLoading(false);
    }
  }, []);

  const getUser = useCallback(async (id: number): Promise<User> => {
    setLoading(true);
    setError(null);
    try {
      return await adminClient.getUser(id);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch user');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUserStatus = useCallback(async (id: number, status: string) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await adminClient.updateUserStatus(id, status);
      setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update user');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const banUser = useCallback(async (id: number, reason: string) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await adminClient.banUser(id, reason);
      setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to ban user');
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
    users,
    total,
    loading,
    error,
    fetchUsers,
    getUser,
    updateUserStatus,
    banUser,
    clearError,
  };
};
