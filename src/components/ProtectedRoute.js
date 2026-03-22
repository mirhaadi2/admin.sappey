import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Navigate } from 'react-router-dom';
import { useAdminAuthContext } from '../contexts/AdminAuthContext';
export const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useAdminAuthContext();
    // While checking authentication status
    if (isLoading) {
        return (_jsx("div", { className: "flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "inline-block", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" }) }), _jsx("p", { className: "mt-4 text-gray-600 font-medium", children: "Loading..." })] }) }));
    }
    // User not authenticated, redirect to login
    if (!isAuthenticated) {
        return _jsx(Navigate, { to: "/login", replace: true });
    }
    // User authenticated, render children
    return _jsx(_Fragment, { children: children });
};
export default ProtectedRoute;
