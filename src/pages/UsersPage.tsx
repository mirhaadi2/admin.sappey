import { useEffect, useState } from 'react';
import { Search, Ban, AlertCircle } from 'lucide-react';
import { useAdminUsers } from '../hooks/useAdminUsers';

function UsersPage() {
  const {
    users,
    total,
    loading,
    error,
    fetchUsers,
    banUser,
    updateUserStatus,
    clearError,
  } = useAdminUsers();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleBan = async (userId: number) => {
    const reason = prompt('Enter reason for banning this user:');
    if (reason) {
      try {
        await banUser(userId, reason);
      } catch (err) {
        console.error('Failed to ban user');
      }
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">User Management</h1>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <AlertCircle size={20} />
          <p>{error.message}</p>
          <button
            onClick={clearError}
            className="ml-auto text-sm underline hover:no-underline"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="flex gap-4 flex-wrap">
        <div className="flex-1 min-w-xs relative">
          <Search className="absolute left-4 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="BANNED">Banned</option>
        </select>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg font-semibold">No users found</p>
            <p className="text-sm mt-2">No users match your search criteria</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Email</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Phone</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Orders</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Total Spent</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 text-gray-900 font-medium">{user.name}</td>
                    <td className="py-4 px-4 text-gray-600 text-sm">{user.email}</td>
                    <td className="py-4 px-4 text-gray-600 text-sm">{user.phoneNumber}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          user.status === 'ACTIVE'
                            ? 'bg-green-100 text-green-700'
                            : user.status === 'INACTIVE'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-600">{user.totalOrders}</td>
                    <td className="py-4 px-4 text-gray-600 font-medium">₹{user.totalSpent}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center gap-2">
                        {user.status !== 'BANNED' && (
                          <button
                            onClick={() => handleBan(user.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Ban user"
                          >
                            <Ban size={18} />
                          </button>
                        )}
                        <button className="px-3 py-1 text-sm bg-gray-200 text-gray-900 rounded hover:bg-gray-300 transition-colors">
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && users.length > 0 && (
          <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-gray-200">
            <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
              Previous
            </button>
            <span className="text-sm text-gray-600">Showing {users.length} of {total}</span>
            <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default UsersPage;
