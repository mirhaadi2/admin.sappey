import { useEffect } from 'react';
import { Users, Storefront, ShoppingCart, WarningCircle, CurrencyDollar, ChartBar, Gear, CurrencyInr } from '@phosphor-icons/react';
import { useAdminDashboardStats } from '@/api/exports';
import PendingApprovalsTable from '../components/PendingApprovalsTable';

function Dashboard() {
  const { data: statsResponse, isLoading, error } = useAdminDashboardStats();
  
  const stats = statsResponse?.data || {
    totalUsers: 0,
    totalSellers: 0,
    totalOrders: 0,
    pendingApprovals: 0,
    totalRevenue: 0,
    mensualRevenue: 0,
    activeListings: 0,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-slate-500 text-lg">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Admin Dashboard</h1>
          <p className="text-sm text-slate-500">Overview of platform activity and performance</p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition">
            <ChartBar size={16} weight="duotone" />
            Refresh
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition">
            <Gear size={16} weight="duotone" />
            Settings
          </button>
        </div>
      </header>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700">
          <WarningCircle size={20} />
          <p>An error occurred while fetching dashboard data</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <div className="p-5 rounded-[24px] border border-brand-brown/10 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-500 hover:shadow-[0_30px_60px_rgba(139,115,85,0.15)] hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide">Total Users</p>
              <p className="text-3xl font-bold text-slate-900">{stats?.totalUsers || 0}</p>
            </div>
            <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
              <Users size={28} weight="duotone" />
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-500">Active accounts across all portals</p>
        </div>

        <div className="p-5 rounded-[24px] border border-brand-brown/10 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-500 hover:shadow-[0_30px_60px_rgba(139,115,85,0.15)] hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide">Total Sellers</p>
              <p className="text-3xl font-bold text-slate-900">{stats?.totalSellers || 0}</p>
            </div>
            <div className="p-3 rounded-xl bg-violet-100 text-violet-600">
              <Storefront size={28} weight="duotone" />
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-500">Approved and active sellers</p>
        </div>

        <div className="p-5 rounded-[24px] border border-brand-brown/10 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-500 hover:shadow-[0_30px_60px_rgba(139,115,85,0.15)] hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide">Total Orders</p>
              <p className="text-3xl font-bold text-slate-900">{stats?.totalOrders || 0}</p>
            </div>
            <div className="p-3 rounded-xl bg-amber-100 text-amber-600">
              <ShoppingCart size={28} weight="duotone" />
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-500">Orders processed this month</p>
        </div>

        <div className="p-5 rounded-[24px] border border-brand-brown/10 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-500 hover:shadow-[0_30px_60px_rgba(139,115,85,0.15)] hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide">Platform Revenue</p>
              <p className="text-3xl font-bold text-slate-900">₹{stats?.totalRevenue?.toLocaleString() || 0}</p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-100 text-emerald-600">
              <CurrencyInr size={28} weight="duotone" />
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-500">Revenue this month ₹{stats?.mensualRevenue?.toLocaleString() || 0}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Pending Approvals</h3>
          <p className="text-sm text-gray-600 mb-4">Review and approve new seller applications</p>
          <a href="/sellers" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
            Review Sellers →
          </a>
        </div>

        <div className="bg-red-50 p-6 rounded-lg border border-red-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Open Disputes</h3>
          <p className="text-sm text-gray-600 mb-4">Handle customer and seller disputes</p>
          <button className="text-red-600 hover:text-red-700 font-medium text-sm">
            Manage Disputes →
          </button>
        </div>

        <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Commission Settings</h3>
          <p className="text-sm text-gray-600 mb-4">Configure platform commission rates</p>
          <a href="/settings" className="text-purple-600 hover:text-purple-700 font-medium text-sm">
            Configure →
          </a>
        </div>
      </div>

      {/* Pending Approvals Table */}
      <div>
        <PendingApprovalsTable />
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Trend</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
            <p className="text-gray-500">Sales chart coming soon...</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
            <p className="text-gray-500">Growth chart coming soon...</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="text-center py-12 text-gray-500">
          <p>No recent activity</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
