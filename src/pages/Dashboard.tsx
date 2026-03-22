import { useEffect } from 'react';
import { Users, Store, ShoppingCart, TrendingUp, AlertCircle } from 'lucide-react';
import { useAdminStats } from '../hooks/useAdminStats';
import PendingApprovalsTable from '../components/PendingApprovalsTable';

function Dashboard() {
  const { stats, loading, error, fetchStats } = useAdminStats();

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500 text-lg">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <AlertCircle size={20} />
          <p>{error.message}</p>
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Users</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.totalUsers || 0}</p>
            </div>
            <Users className="text-blue-500 opacity-20" size={40} />
          </div>
          <p className="text-xs text-gray-500 mt-3">Active accounts</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Sellers</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.totalSellers || 0}</p>
            </div>
            <Store className="text-purple-500 opacity-20" size={40} />
          </div>
          <p className="text-xs text-gray-500 mt-3">Verified sellers</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Orders</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.totalOrders || 0}</p>
            </div>
            <ShoppingCart className="text-orange-500 opacity-20" size={40} />
          </div>
          <p className="text-xs text-gray-500 mt-3">This month: {stats?.mensualOrders || 0}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Platform Revenue</p>
              <p className="text-3xl font-bold text-gray-900">₹{stats?.totalRevenue?.toLocaleString() || 0}</p>
            </div>
            <TrendingUp className="text-green-500 opacity-20" size={40} />
          </div>
          <p className="text-xs text-gray-500 mt-3">This month: ₹{stats?.mensualRevenue?.toLocaleString() || 0}</p>
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
