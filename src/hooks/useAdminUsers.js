import { useState, useCallback } from 'react';
import adminClient from '../api/admin';
export const useAdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const fetchUsers = useCallback(async (page, limit, search) => {
        setLoading(true);
        setError(null);
        try {
            const { users: data, total } = await adminClient.listUsers(page, limit, search);
            setUsers(data);
            setTotal(total);
        }
        catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to fetch users'));
        }
        finally {
            setLoading(false);
        }
    }, []);
    const getUser = useCallback(async (id) => {
        setLoading(true);
        setError(null);
        try {
            return await adminClient.getUser(id);
        }
        catch (err) {
            const error = err instanceof Error ? err : new Error('Failed to fetch user');
            setError(error);
            throw error;
        }
        finally {
            setLoading(false);
        }
    }, []);
    const updateUserStatus = useCallback(async (id, status) => {
        setLoading(true);
        setError(null);
        try {
            const updated = await adminClient.updateUserStatus(id, status);
            setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
        }
        catch (err) {
            const error = err instanceof Error ? err : new Error('Failed to update user');
            setError(error);
            throw error;
        }
        finally {
            setLoading(false);
        }
    }, []);
    const banUser = useCallback(async (id, reason) => {
        setLoading(true);
        setError(null);
        try {
            const updated = await adminClient.banUser(id, reason);
            setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
        }
        catch (err) {
            const error = err instanceof Error ? err : new Error('Failed to ban user');
            setError(error);
            throw error;
        }
        finally {
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
