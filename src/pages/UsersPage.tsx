import React, { useState } from 'react';
import { Plus, Trash, WarningCircle, CircleNotch, Warning, MagnifyingGlass } from '@phosphor-icons/react';
import {
  useAdminUsersList,
  useAdminDeleteUser,
  useAdminBanUser,
  useAdminUnbanUser,
} from '@/api/admin/users/hooks';
import { AdminUsersListParams } from '@/api/admin/users/types';

function UsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'all' | 'active' | 'banned'>('all');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const params: AdminUsersListParams = {
    page,
    limit: 10,
    search: search || undefined,
    status: status === 'all' ? undefined : status,
  };

  const { data: usersData, isLoading: isLoadingUsers, error: usersError } = useAdminUsersList(params);
  const { mutate: deleteUser, isPending: isDeletingUser } = useAdminDeleteUser();
  const { mutate: banUser, isPending: isBanningUser } = useAdminBanUser();
  const { mutate: unbanUser, isPending: isUnbanningUser } = useAdminUnbanUser();

  console.log(usersData,'userData')
  const handleDelete = (userId: string) => {
    setSelectedUserId(userId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (selectedUserId) {
      deleteUser(selectedUserId, {
        onSuccess: () => {
          setShowDeleteConfirm(false);
          setSelectedUserId(null);
        },
      });
    }
  };

  const handleBanToggle = (userId: string, isBanned: boolean) => {
    if (isBanned) {
      unbanUser(userId);
    } else {
      banUser(userId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Users Management</h1>
            <p className="text-slate-600 mt-1">Manage all users in the system</p>
          </div>
          <button className="flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all">
            <Plus size={20} weight="bold" />
            Create User
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Search</label>
              <div className="relative">
                <MagnifyingGlass className="absolute left-3 top-3 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="By email or name..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value as any);
                  setPage(1);
                }}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="all">All Users</option>
                <option value="active">Active</option>
                <option value="banned">Banned</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearch('');
                  setStatus('all');
                  setPage(1);
                }}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          {isLoadingUsers ? (
            <div className="flex items-center justify-center h-64">
              <CircleNotch size={32} className="text-amber-600 animate-spin" />
            </div>
          ) : usersError ? (
            <div className="p-8 flex items-center gap-4 text-red-600 bg-red-50 border-t border-red-200">
              <Warning size={24} />
              <div>
                <p className="font-medium">Error loading users</p>
                <p className="text-sm">{(usersError as any).message || 'Please try again'}</p>
              </div>
            </div>
          ) : !usersData?.data || usersData.data?.length === 0 ? (
            <div className="p-8 text-center text-slate-600">
              <p>No users found</p>
            </div>
          ) : (
            <>
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Phone</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Joined</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-slate-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {usersData?.data?.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{user.email}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{user.name}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{user.phone || '—'}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                            user.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          <span className={`w-2 h-2 rounded-full ${user.status === 'active' ? 'bg-green-600' : 'bg-red-600'}`} />
                          {user.status === 'active' ? 'Active' : 'Banned'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() =>
                              handleBanToggle(user.id, user.status === 'banned')
                            }
                            disabled={isBanningUser || isUnbanningUser}
                            className={`p-2 rounded-lg transition-colors ${
                              user.status === 'banned'
                                ? 'text-green-600 hover:bg-green-50'
                                : 'text-amber-600 hover:bg-amber-50'
                            } disabled:opacity-50`}
                            title={user.status === 'banned' ? 'Unban' : 'Ban'}
                          >
                            {isBanningUser || isUnbanningUser ? (
                              <CircleNotch size={18} className="animate-spin" />
                            ) : user.status === 'banned' ? (
                              <WarningCircle size={18} />
                            ) : (
                              <WarningCircle size={18} />
                            )}
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            disabled={isDeletingUser}
                            className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                            title="Delete"
                          >
                            {isDeletingUser && selectedUserId === user.id ? (
                              <CircleNotch size={18} className="animate-spin" />
                            ) : (
                              <Trash size={18} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              {usersData?.data && (
                <div className="px-6 py-4 flex items-center justify-between border-t border-slate-200">
                  <p className="text-sm text-slate-600">
                    Showing {(page - 1) * 10 + 1} to{' '}
                    {Math.min(page * 10, usersData?.total)} of{' '}
                    {usersData?.total} users
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setPage(page + 1)}
                      disabled={page * 10 >= usersData?.total}
                      className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Delete User?</h3>
            <p className="text-slate-600 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeletingUser}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {isDeletingUser ? (
                  <>
                    <CircleNotch className="inline animate-spin mr-2" size={16} />
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UsersPage;
