/**
 * Guest Route Component
 * Restricts access to unauthenticated users only
 * Redirects authenticated users to dashboard
 * Used for login/signup pages
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuthContext } from '../contexts/AdminAuthContext';

interface GuestRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export const GuestRoute: React.FC<GuestRouteProps> = ({
  children,
  redirectTo = '/dashboard'
}) => {
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

  // User is authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // User not authenticated, render children (login page)
  return <>{children}</>;
};

export default GuestRoute;