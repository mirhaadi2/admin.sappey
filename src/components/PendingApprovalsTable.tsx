import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, AlertCircle, Clock, FileText } from 'lucide-react';
import { adminClient } from '../api/admin';
import { Seller } from '../api/types';

export default function PendingApprovalsTable() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState<{ [key: string]: string }>({});
  const [showRejectModal, setShowRejectModal] = useState<string | null>(null);

  useEffect(() => {
    fetchPendingSellers();
  }, []);

  const fetchPendingSellers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminClient.listSellers('PENDING', 1, 50);
      setSellers(response.data || []);
    } catch (err: any) {
      setError('Failed to load pending sellers');
      console.error('Error fetching pending sellers:', err);
    } finally {
      setLoading(false);
    }
  };
  console.log(sellers,'sellers')

  const handleApproveSeller = async (sellerId: string) => {
    try {
      setActionLoading(sellerId);
      await adminClient.approveSeller(sellerId as any);
      setSellers(sellers.filter((s) => s.id !== sellerId));
    } catch (err: any) {
      setError('Failed to approve seller');
      console.error('Error approving seller:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectSeller = async (sellerId: string) => {
    const reason = rejectReason[sellerId] || 'No reason provided';

    try {
      setActionLoading(sellerId);
      await adminClient.rejectSeller(sellerId as any, reason);
      setSellers(sellers.filter((s) => s.id !== sellerId));
      setShowRejectModal(null);
      setRejectReason({});
    } catch (err: any) {
      setError('Failed to reject seller');
      console.error('Error rejecting seller:', err);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading pending approvals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="text-yellow-600" size={24} />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Pending Seller Approvals</h2>
              <p className="text-sm text-gray-600">Review and approve new seller registrations</p>
            </div>
          </div>
          <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
            {sellers.length} Pending
          </span>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <AlertCircle className="text-red-600" size={20} />
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {sellers.length === 0 ? (
        <div className="p-12 text-center">
          <CheckCircle2 className="mx-auto text-green-500 opacity-20 mb-3" size={48} />
          <p className="text-gray-600 font-medium">No pending approvals</p>
          <p className="text-sm text-gray-500 mt-1">All seller applications have been reviewed</p>
        </div>
      ) : (
        /* Table */
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Business Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Owner</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Business Reg. No</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">GST Number</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Applied On</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sellers?.map((seller) => (
                <tr key={seller.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{seller.businessName}</p>
                    <p className="text-sm text-gray-600">{seller.businessType}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">TBD</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <FileText size={16} className="text-gray-400" />
                      <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">REG</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">Verified</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(seller.createdAt).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleApproveSeller(seller.id)}
                        disabled={actionLoading === seller.id}
                        className="flex items-center gap-1 px-3 py-2 bg-green-50 text-green-700 border border-green-200 rounded-lg hover:bg-green-100 disabled:opacity-50 transition-colors text-sm font-medium"
                      >
                        <CheckCircle2 size={16} />
                        {actionLoading === seller.id ? 'Processing...' : 'Approve'}
                      </button>
                      <button
                        onClick={() => setShowRejectModal(seller.id)}
                        disabled={actionLoading === seller.id}
                        className="flex items-center gap-1 px-3 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 disabled:opacity-50 transition-colors text-sm font-medium"
                      >
                        <XCircle size={16} />
                        Reject
                      </button>

                      {/* Reject Modal */}
                      {showRejectModal === seller.id && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reject Seller</h3>
                            <p className="text-sm text-gray-600 mb-4">
                              Are you sure you want to reject{' '}
                              <strong>{seller.businessName}</strong>'s application?
                            </p>

                            <textarea
                              value={rejectReason[seller.id] || ''}
                              onChange={(e) => setRejectReason({ ...rejectReason, [seller.id]: e.target.value })}
                              placeholder="Provide a reason for rejection (optional)..."
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none text-sm resize-none h-24 mb-4"
                            />

                            <div className="flex gap-3">
                              <button
                                onClick={() => setShowRejectModal(null)}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleRejectSeller(seller.id)}
                                disabled={actionLoading === seller.id}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
                              >
                                {actionLoading === seller.id ? 'Processing...' : 'Reject'}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Future Feature Note */}
      <div className="border-t border-gray-200 bg-blue-50 p-4 mx-6 my-6 rounded-lg">
        <p className="text-sm text-blue-900 font-medium">📋 Upcoming Feature</p>
        <p className="text-sm text-blue-800 mt-1">
          Document upload for GST certificates will be added soon, allowing sellers to submit verification documents directly through the portal.
        </p>
      </div>
    </div>
  );
}
