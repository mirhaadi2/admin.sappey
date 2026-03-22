import { jsx as _jsx } from "react/jsx-runtime";
/**
 * Admin Auth Context
 * Provides portal-isolated authentication state management
 * Similar to website-frontend's AuthContext pattern
 */
import React, { createContext, useContext } from 'react';
import { useAdminAuth } from '../api/admin';
const AdminAuthContext = createContext(undefined);
export const AdminAuthProvider = ({ children }) => {
    // Use the authentication API hook
    const { user, isLoading, isAuthenticated, loginMutation, logoutMutation, } = useAdminAuth();
    const signIn = (email, password) => {
        loginMutation.mutate({ email, password });
    };
    const signOut = () => {
        logoutMutation.mutate(undefined);
    };
    // Handle successful authentication
    React.useEffect(() => {
        if (user && loginMutation.isSuccess) {
            // Optionally redirect after successful auth
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 500);
        }
    }, [user, loginMutation.isSuccess]);
    const value = {
        user,
        loading: isLoading,
        isLoading,
        isAuthenticated,
        signIn,
        signOut,
        signInError: loginMutation.error,
        signOutError: logoutMutation.error,
        signInLoading: loginMutation.isPending,
        signOutLoading: logoutMutation.isPending,
    };
    return (_jsx(AdminAuthContext.Provider, { value: value, children: children }));
};
/**
 * Hook to use Admin Auth Context
 */
export const useAdminAuthContext = () => {
    const context = useContext(AdminAuthContext);
    if (!context) {
        throw new Error('useAdminAuthContext must be used within AdminAuthProvider');
    }
    return context;
};
