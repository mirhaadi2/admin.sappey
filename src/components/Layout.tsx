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
  ShoppingCart,
} from '@phosphor-icons/react';
import { useAdminAuthContext } from '../contexts/AdminAuthContext';

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
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
    { label: 'Bulk Orders', path: '/bulk-orders', icon: <ShoppingCart size={20} weight="duotone" /> },
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
        className={`hidden md:flex ${sidebarOpen ? 'w-72' : 'w-20'} bg-white border-r border-slate-200 shadow-lg transition-all duration-300 flex-col min-h-0 overflow-hidden`}
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

        <nav className="flex-1 min-h-0 px-2 py-4 space-y-2 overflow-y-auto">
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

        <div className="p-2 border-t border-slate-200">
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

      {mobileNavOpen && (
        <div className="fixed inset-0 z-40 bg-black/30 md:hidden" onClick={() => setMobileNavOpen(false)} />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 shadow-lg transition-transform duration-300 md:hidden ${mobileNavOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-lg">
              A
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900">Sappey Admin</h1>
              <p className="text-xs text-slate-500">Management Portal</p>
            </div>
          </div>
          <button
            className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center"
            onClick={() => setMobileNavOpen(false)}
          >
            <CaretLeft size={20} weight="bold" />
          </button>
        </div>

        <nav className="flex-1 min-h-0 px-2 py-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileNavOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 ${
                isActive(item.path)
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className={`${isActive(item.path) ? 'text-white' : 'text-slate-500'}`}>{item.icon}</div>
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-2 border-t border-slate-200">
          <button
            onClick={() => {
              handleLogout();
              setMobileNavOpen(false);
            }}
            disabled={signOutLoading}
            className="flex items-center gap-3 w-full p-3 rounded-xl text-slate-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <SignOut size={20} weight="duotone" />
            <span className="font-medium">{signOutLoading ? 'Logging out...' : 'Logout'}</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 min-h-0 overflow-auto">
        <div className="h-16 sticky top-0 bg-white border-b border-slate-200 z-20 flex items-center justify-between px-4 md:px-6 shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <button
              className="md:hidden p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 flex-shrink-0"
              onClick={() => setMobileNavOpen((open) => !open)}
            >
              <ListMagnifyingGlass size={20} />
            </button>
            <div className="hidden sm:flex items-center gap-2 bg-slate-100 rounded-xl px-3 py-2 min-w-0 flex-1 max-w-xs">
              <ListMagnifyingGlass size={18} className="text-slate-500 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400 min-w-0 flex-1"
              />
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <button className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 flex-shrink-0">
              <Bell size={20} />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"></span>
            </button>
            <div className="flex items-center gap-2 p-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-md min-w-0">
              <span className="w-8 h-8 rounded-full bg-white text-blue-700 flex items-center justify-center font-bold flex-shrink-0">A</span>
              <span className="hidden md:inline text-sm font-semibold truncate">Admin</span>
            </div>
          </div>
        </div>

        <div className="p-4 md:p-6 lg:p-8 overflow-x-hidden">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default Layout;
