import { useState, useCallback } from 'react';
import adminClient from '../api/admin';
export const useAdminStats = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const fetchStats = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await adminClient.getStats();
            setStats(data);
        }
        catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to fetch statistics'));
        }
        finally {
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
