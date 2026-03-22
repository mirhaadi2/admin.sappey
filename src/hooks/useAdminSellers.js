import { useState, useCallback } from 'react';
import adminClient from '../api/admin';
export const useAdminSellers = () => {
    const [sellers, setSellers] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const fetchSellers = useCallback(async (status, page, limit) => {
        setLoading(true);
        setError(null);
        try {
            const { sellers: data, total } = await adminClient.listSellers(status, page, limit);
            setSellers(data);
            setTotal(total);
        }
        catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to fetch sellers'));
        }
        finally {
            setLoading(false);
        }
    }, []);
    const getSeller = useCallback(async (id) => {
        setLoading(true);
        setError(null);
        try {
            return await adminClient.getSeller(id);
        }
        catch (err) {
            const error = err instanceof Error ? err : new Error('Failed to fetch seller');
            setError(error);
            throw error;
        }
        finally {
            setLoading(false);
        }
    }, []);
    const approveSeller = useCallback(async (id) => {
        setLoading(true);
        setError(null);
        try {
            const updated = await adminClient.approveSeller(id);
            setSellers((prev) => prev.map((s) => (s.id === id ? updated : s)));
        }
        catch (err) {
            const error = err instanceof Error ? err : new Error('Failed to approve seller');
            setError(error);
            throw error;
        }
        finally {
            setLoading(false);
        }
    }, []);
    const rejectSeller = useCallback(async (id, reason) => {
        setLoading(true);
        setError(null);
        try {
            const updated = await adminClient.rejectSeller(id, reason);
            setSellers((prev) => prev.map((s) => (s.id === id ? updated : s)));
        }
        catch (err) {
            const error = err instanceof Error ? err : new Error('Failed to reject seller');
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
