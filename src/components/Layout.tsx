import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  Gauge,
  UserCircle,
  Buildings,
  ShoppingBagOpen,
  Package,
  Tag,
  ChartBar,
  Gear,
  SignOut,
  ListMagnifyingGlass,
  Bell,
  CaretLeft,
  CaretRight,
  Globe,
  QrCode,
  Stack,
  PuzzlePiece,
} from '@phosphor-icons/react';
import { useAdminAuthContext } from '../contexts/AdminAuthContext';

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, signOutLoading } = useAdminAuthContext();

  const handleLogout = () => {
    signOut();
    // After logout, auth state will update and ProtectedRoute will redirect to login.
    // Prevent manual navigation race with auth cache updates by leaving redirect to route guard.
  };

  const navItems = [
    { label: 'Dashboard', path: '/', icon: <Gauge size={20} weight="duotone" /> },
    { label: 'Customers', path: '/customers', icon: <UserCircle size={20} weight="duotone" /> },
    { label: 'Sellers', path: '/sellers', icon: <Buildings size={20} weight="duotone" /> },
    { label: 'Orders', path: '/orders', icon: <ShoppingBagOpen size={20} weight="duotone" /> },
    { label: 'Products', path: '/products', icon: <Package size={20} weight="duotone" /> },
    { label: 'Inventory', path: '/inventory', icon: <Stack size={20} weight="duotone" /> },
    { label: 'Categories', path: '/categories', icon: <Tag size={20} weight="duotone" /> },
    { label: 'Integrations', path: '/integrations', icon: <PuzzlePiece size={20} weight="duotone" /> },
    { label: 'Website', path: '/website', icon: <Globe size={20} weight="duotone" /> },
    { label: 'Tools', path: '/tools', icon: <QrCode size={20} weight="duotone" /> },
    { label: 'Reports', path: '/reports', icon: <ChartBar size={20} weight="duotone" /> },
    { label: 'Settings', path: '/settings', icon: <Gear size={20} weight="duotone" /> },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen bg-slate-50">
      <aside
        className={`${sidebarOpen ? 'w-72' : 'w-20'} bg-white border-r border-slate-200 shadow-lg transition-all duration-300 flex flex-col`}
      >
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          {sidebarOpen ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-lg">
                A
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-slate-900">Sappey Admin</h1>
                <p className="text-xs text-slate-500">Management Portal</p>
              </div>
            </div>
          ) : (
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-lg">A</div>
          )}
          <button
            className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center"
            onClick={() => setSidebarOpen((open) => !open)}
          >
            {sidebarOpen ? <CaretLeft size={20} weight="bold" /> : <CaretRight size={20} weight="bold" />}
          </button>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 ${
                isActive(item.path)
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className={`${isActive(item.path) ? 'text-white' : 'text-slate-500'}`}>{item.icon}</div>
              {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <button
            onClick={handleLogout}
            disabled={signOutLoading}
            className="flex items-center gap-3 w-full p-3 rounded-xl text-slate-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <SignOut size={20} weight="duotone" />
            {sidebarOpen && <span className="font-medium">{signOutLoading ? 'Logging out...' : 'Logout'}</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="h-16 sticky top-0 bg-white border-b border-slate-200 z-20 flex items-center justify-between px-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-100 rounded-xl px-3 py-2">
              <ListMagnifyingGlass size={18} className="text-slate-500" />
              <input
                type="text"
                placeholder="Search...
"
                className="bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100">
              <Bell size={20} />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"></span>
            </button>
            <div className="flex items-center gap-2 p-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-md">
              <span className="w-8 h-8 rounded-full bg-white text-blue-700 flex items-center justify-center font-bold">A</span>
              {sidebarOpen && <span className="text-sm font-semibold">Admin</span>}
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default Layout;
