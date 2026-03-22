import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, Eye } from 'lucide-react';
import { useAdminSellers } from '../hooks/useAdminSellers';

function SellersPage() {
  const {
    sellers,
    total,
    loading,
    error,
    fetchSellers,
    approveSeller,
    rejectSeller,
    clearError,
  } = useAdminSellers();

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [rejectReason, setRejectReason] = useState<{ [key: number]: string }>({});
  const [showRejectForm, setShowRejectForm] = useState<number | null>(null);

  useEffect(() => {
    const status = filterStatus === 'all' ? undefined : filterStatus;
    fetchSellers(status);
  }, [filterStatus]);

  const handleApprove = async (sellerId: number) => {
    if (confirm('Approve this seller?')) {
      try {
        await approveSeller(sellerId);
      } catch (err) {
        console.error('Failed to approve seller');
      }
    }
  };

  const handleReject = async (sellerId: number) => {
    const reason = rejectReason[sellerId];
    if (!reason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }
    try {
      await rejectSeller(sellerId, reason);
      setShowRejectForm(null);
      setRejectReason({ ...rejectReason, [sellerId]: '' });
    } catch (err) {
      console.error('Failed to reject seller');
    }
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      APPROVED: 'bg-green-100 text-green-700',
      PENDING: 'bg-yellow-100 text-yellow-700',
      REJECTED: 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Seller Management</h1>

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
        <button
          onClick={() => setFilterStatus('all')}
          className={`px-4 py-2 rounded-lg transition-colors font-medium ${
            filterStatus === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          All Sellers
        </button>
        <button
          onClick={() => setFilterStatus('PENDING')}
          className={`px-4 py-2 rounded-lg transition-colors font-medium ${
            filterStatus === 'PENDING'
              ? 'bg-yellow-600 text-white'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => setFilterStatus('APPROVED')}
          className={`px-4 py-2 rounded-lg transition-colors font-medium ${
            filterStatus === 'APPROVED'
              ? 'bg-green-600 text-white'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          Approved
        </button>
        <button
          onClick={() => setFilterStatus('REJECTED')}
          className={`px-4 py-2 rounded-lg transition-colors font-medium ${
            filterStatus === 'REJECTED'
              ? 'bg-red-600 text-white'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          Rejected
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading sellers...</div>
        ) : sellers.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg font-semibold">No sellers found</p>
            <p className="text-sm mt-2">No sellers match the selected filter</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Business Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Type</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Rating</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Orders</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sellers.map((seller) => (
                  <tr key={seller.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 text-gray-900 font-medium">{seller.businessName}</td>
                    <td className="py-4 px-4 text-gray-600 text-sm">{seller.businessType}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(seller.status)}`}>
                        {seller.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {seller.rating > 0 ? `${seller.rating.toFixed(1)} ⭐` : 'No rating'}
                    </td>
                    <td className="py-4 px-4 text-gray-600">{seller.totalOrders}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View details">
                          <Eye size={18} />
                        </button>

                        {seller.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleApprove(seller.id)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Approve"
                            >
                              <CheckCircle size={18} />
                            </button>
                            <button
                              onClick={() => setShowRejectForm(showRejectForm === seller.id ? null : seller.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Reject"
                            >
                              <XCircle size={18} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Rejection form */}
            {showRejectForm !== null && (
              <div className="border-t border-gray-200 mt-4 pt-4">
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Reject {sellers.find((s) => s.id === showRejectForm)?.businessName}
                  </h4>
                  <textarea
                    placeholder="Provide a reason for rejection..."
                    value={rejectReason[showRejectForm] || ''}
                    onChange={(e) =>
                      setRejectReason({ ...rejectReason, [showRejectForm]: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 mb-3"
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleReject(showRejectForm)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Confirm Rejection
                    </button>
                    <button
                      onClick={() => setShowRejectForm(null)}
                      className="px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {!loading && sellers.length > 0 && (
          <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-gray-200">
            <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
              Previous
            </button>
            <span className="text-sm text-gray-600">Showing {sellers.length} of {total}</span>
            <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SellersPage;
