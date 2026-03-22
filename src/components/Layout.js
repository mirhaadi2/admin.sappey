import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, BarChart3 } from 'lucide-react';
import { useState } from 'react';
function Layout() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const location = useLocation();
    const navItems = [
        { label: 'Dashboard', path: '/', icon: '📊' },
        { label: 'Users', path: '/users', icon: '👥' },
        { label: 'Sellers', path: '/sellers', icon: '🏪' },
        { label: 'Orders', path: '/orders', icon: '📦' },
        { label: 'Products', path: '/products', icon: '📚' },
        { label: 'Reports', path: '/reports', icon: '📈' },
        { label: 'Settings', path: '/settings', icon: '⚙️' },
    ];
    const isActive = (path) => location.pathname === path;
    return (_jsxs("div", { className: "flex h-screen bg-gray-50", children: [_jsxs("aside", { className: `${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`, children: [_jsxs("div", { className: "p-6 border-b border-gray-200 flex items-center justify-between", children: [sidebarOpen && (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(BarChart3, { className: "text-blue-600", size: 28 }), _jsx("h1", { className: "text-xl font-bold text-blue-600", children: "Sappey Admin" })] })), _jsx("button", { onClick: () => setSidebarOpen(!sidebarOpen), className: "p-2 hover:bg-gray-100 rounded-lg transition-colors", children: sidebarOpen ? _jsx(X, { size: 20 }) : _jsx(Menu, { size: 20 }) })] }), _jsx("nav", { className: "flex-1 p-4 space-y-2", children: navItems.map((item) => (_jsxs(Link, { to: item.path, className: `flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${isActive(item.path)
                                ? 'bg-blue-50 text-blue-600 font-semibold'
                                : 'text-gray-600 hover:bg-gray-50'}`, children: [_jsx("span", { className: "text-xl", children: item.icon }), sidebarOpen && _jsx("span", { children: item.label })] }, item.path))) }), _jsx("div", { className: "p-4 border-t border-gray-200", children: _jsxs("button", { className: "flex items-center gap-4 w-full px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors", children: [_jsx(LogOut, { size: 20 }), sidebarOpen && _jsx("span", { children: "Logout" })] }) })] }), _jsxs("main", { className: "flex-1 overflow-auto", children: [_jsxs("div", { className: "h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8", children: [_jsx("h2", { className: "text-lg font-semibold text-gray-900", children: "Admin Dashboard" }), _jsx("div", { className: "flex items-center gap-4", children: _jsx("div", { className: "w-10 h-10 bg-red-100 rounded-full flex items-center justify-center", children: _jsx("span", { className: "text-red-600 font-semibold", children: "A" }) }) })] }), _jsx("div", { className: "p-8", children: _jsx(Outlet, {}) })] })] }));
}
export default Layout;
