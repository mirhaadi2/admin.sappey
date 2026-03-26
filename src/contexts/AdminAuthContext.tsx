/**
 * Admin Auth Context
 * Provides portal-isolated authentication state management
 * Similar to website-frontend's AuthContext pattern
 */

import React, { createContext, useContext, useState } from 'react';
import { useAdminAuth } from '../api/admin';
import { LoginData, AdminUser } from '../api/admin/types';

interface AdminAuthContextType {
  user: AdminUser | null | undefined;
  loading: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => void;
  signOut: () => void;
  // Error states
  signInError: any;
  signOutError: any;
  // Loading states
  signInLoading: boolean;
  signOutLoading: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

interface AdminAuthProviderProps {
  children: React.ReactNode;
}

export const AdminAuthProvider: React.FC<AdminAuthProviderProps> = ({ children }) => {
  // Use the authentication API hook
  const {
    user,
    isLoading,
    isAuthenticated,
    loginMutation,
    logoutMutation,
  } = useAdminAuth();

  const signIn = (email: string, password: string) => {
    loginMutation.mutate({ email, password });
  };

  const signOut = () => {
    logoutMutation.mutate(undefined);
  };

  // No direct navigation from auth context: let route guards handle redirect control for SPA behavior

  const value: AdminAuthContextType = {
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

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

/**
 * Hook to use Admin Auth Context
 */
export const useAdminAuthContext = (): AdminAuthContextType => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuthContext must be used within AdminAuthProvider');
  }
  return context;
};
