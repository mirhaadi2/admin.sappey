import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, AlertCircle, Clock, FileText } from 'lucide-react';
import { adminClient } from '../api/admin';
export default function PendingApprovalsTable() {
    const [sellers, setSellers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState(null);
    const [rejectReason, setRejectReason] = useState({});
    const [showRejectModal, setShowRejectModal] = useState(null);
    useEffect(() => {
        fetchPendingSellers();
    }, []);
    const fetchPendingSellers = async () => {
        try {
            setLoading(true);
            setError(null);
            const { sellers } = await adminClient.listSellers('PENDING', 1, 50);
            setSellers(sellers);
        }
        catch (err) {
            setError('Failed to load pending sellers');
            console.error('Error fetching pending sellers:', err);
        }
        finally {
            setLoading(false);
        }
    };
    const handleApproveSeller = async (sellerId) => {
        try {
            setActionLoading(sellerId);
            await adminClient.approveSeller(sellerId);
            setSellers(sellers.filter((s) => s.id !== sellerId));
        }
        catch (err) {
            setError('Failed to approve seller');
            console.error('Error approving seller:', err);
        }
        finally {
            setActionLoading(null);
        }
    };
    const handleRejectSeller = async (sellerId) => {
        const reason = rejectReason[sellerId] || 'No reason provided';
        try {
            setActionLoading(sellerId);
            await adminClient.rejectSeller(sellerId, reason);
            setSellers(sellers.filter((s) => s.id !== sellerId));
            setShowRejectModal(null);
            setRejectReason({});
        }
        catch (err) {
            setError('Failed to reject seller');
            console.error('Error rejecting seller:', err);
        }
        finally {
            setActionLoading(null);
        }
    };
    if (loading) {
        return (_jsx("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200 p-6", children: _jsx("div", { className: "flex items-center justify-center h-64", children: _jsx("p", { className: "text-gray-500", children: "Loading pending approvals..." }) }) }));
    }
    return (_jsxs("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200", children: [_jsx("div", { className: "border-b border-gray-200 p-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Clock, { className: "text-yellow-600", size: 24 }), _jsxs("div", { children: [_jsx("h2", { className: "text-lg font-semibold text-gray-900", children: "Pending Seller Approvals" }), _jsx("p", { className: "text-sm text-gray-600", children: "Review and approve new seller registrations" })] })] }), _jsxs("span", { className: "bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium", children: [sellers.length, " Pending"] })] }) }), error && (_jsxs("div", { className: "mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3", children: [_jsx(AlertCircle, { className: "text-red-600", size: 20 }), _jsx("p", { className: "text-red-800", children: error })] })), sellers.length === 0 ? (_jsxs("div", { className: "p-12 text-center", children: [_jsx(CheckCircle2, { className: "mx-auto text-green-500 opacity-20 mb-3", size: 48 }), _jsx("p", { className: "text-gray-600 font-medium", children: "No pending approvals" }), _jsx("p", { className: "text-sm text-gray-500 mt-1", children: "All seller applications have been reviewed" })] })) : (
            /* Table */
            _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { className: "bg-gray-50 border-b border-gray-200", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-4 text-left text-sm font-semibold text-gray-700", children: "Business Name" }), _jsx("th", { className: "px-6 py-4 text-left text-sm font-semibold text-gray-700", children: "Owner" }), _jsx("th", { className: "px-6 py-4 text-left text-sm font-semibold text-gray-700", children: "Business Reg. No" }), _jsx("th", { className: "px-6 py-4 text-left text-sm font-semibold text-gray-700", children: "GST Number" }), _jsx("th", { className: "px-6 py-4 text-left text-sm font-semibold text-gray-700", children: "Applied On" }), _jsx("th", { className: "px-6 py-4 text-left text-sm font-semibold text-gray-700", children: "Actions" })] }) }), _jsx("tbody", { className: "divide-y divide-gray-200", children: sellers.map((seller) => (_jsxs("tr", { className: "hover:bg-gray-50 transition-colors", children: [_jsxs("td", { className: "px-6 py-4", children: [_jsx("p", { className: "font-medium text-gray-900", children: seller.businessName }), _jsx("p", { className: "text-sm text-gray-600", children: seller.businessType })] }), _jsx("td", { className: "px-6 py-4 text-sm text-gray-600", children: "TBD" }), _jsx("td", { className: "px-6 py-4", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(FileText, { size: 16, className: "text-gray-400" }), _jsx("span", { className: "text-sm font-mono bg-gray-100 px-2 py-1 rounded", children: "REG" })] }) }), _jsx("td", { className: "px-6 py-4", children: _jsx("span", { className: "text-sm bg-green-100 text-green-800 px-2 py-1 rounded", children: "Verified" }) }), _jsx("td", { className: "px-6 py-4 text-sm text-gray-600", children: new Date(seller.createdAt).toLocaleDateString('en-IN', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                        }) }), _jsx("td", { className: "px-6 py-4", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("button", { onClick: () => handleApproveSeller(seller.id), disabled: actionLoading === seller.id, className: "flex items-center gap-1 px-3 py-2 bg-green-50 text-green-700 border border-green-200 rounded-lg hover:bg-green-100 disabled:opacity-50 transition-colors text-sm font-medium", children: [_jsx(CheckCircle2, { size: 16 }), actionLoading === seller.id ? 'Processing...' : 'Approve'] }), _jsxs("button", { onClick: () => setShowRejectModal(seller.id), disabled: actionLoading === seller.id, className: "flex items-center gap-1 px-3 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 disabled:opacity-50 transition-colors text-sm font-medium", children: [_jsx(XCircle, { size: 16 }), "Reject"] }), showRejectModal === seller.id && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: _jsxs("div", { className: "bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Reject Seller" }), _jsxs("p", { className: "text-sm text-gray-600 mb-4", children: ["Are you sure you want to reject", ' ', _jsx("strong", { children: seller.businessName }), "'s application?"] }), _jsx("textarea", { value: rejectReason[seller.id] || '', onChange: (e) => setRejectReason({ ...rejectReason, [seller.id]: e.target.value }), placeholder: "Provide a reason for rejection (optional)...", className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none text-sm resize-none h-24 mb-4" }), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { onClick: () => setShowRejectModal(null), className: "flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors", children: "Cancel" }), _jsx("button", { onClick: () => handleRejectSeller(seller.id), disabled: actionLoading === seller.id, className: "flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 transition-colors", children: actionLoading === seller.id ? 'Processing...' : 'Reject' })] })] }) }))] }) })] }, seller.id))) })] }) })), _jsxs("div", { className: "border-t border-gray-200 bg-blue-50 p-4 mx-6 my-6 rounded-lg", children: [_jsx("p", { className: "text-sm text-blue-900 font-medium", children: "\uD83D\uDCCB Upcoming Feature" }), _jsx("p", { className: "text-sm text-blue-800 mt-1", children: "Document upload for GST certificates will be added soon, allowing sellers to submit verification documents directly through the portal." })] })] }));
}
