/**
 * Protected Route Component
 * Restricts access to authenticated admins only
 * Redirects unauthenticated users to login
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuthContext } from '../contexts/AdminAuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAdminAuthContext();

  // While checking authentication status
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="inline-block">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // User not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // User authenticated, render children
  return <>{children}</>;
};

export default ProtectedRoute;
