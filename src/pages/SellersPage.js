import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, Eye } from 'lucide-react';
import { useAdminSellers } from '../hooks/useAdminSellers';
function SellersPage() {
    const { sellers, total, loading, error, fetchSellers, approveSeller, rejectSeller, clearError, } = useAdminSellers();
    const [filterStatus, setFilterStatus] = useState('all');
    const [rejectReason, setRejectReason] = useState({});
    const [showRejectForm, setShowRejectForm] = useState(null);
    useEffect(() => {
        const status = filterStatus === 'all' ? undefined : filterStatus;
        fetchSellers(status);
    }, [filterStatus]);
    const handleApprove = async (sellerId) => {
        if (confirm('Approve this seller?')) {
            try {
                await approveSeller(sellerId);
            }
            catch (err) {
                console.error('Failed to approve seller');
            }
        }
    };
    const handleReject = async (sellerId) => {
        const reason = rejectReason[sellerId];
        if (!reason.trim()) {
            alert('Please provide a rejection reason');
            return;
        }
        try {
            await rejectSeller(sellerId, reason);
            setShowRejectForm(null);
            setRejectReason({ ...rejectReason, [sellerId]: '' });
        }
        catch (err) {
            console.error('Failed to reject seller');
        }
    };
    const getStatusColor = (status) => {
        const colors = {
            APPROVED: 'bg-green-100 text-green-700',
            PENDING: 'bg-yellow-100 text-yellow-700',
            REJECTED: 'bg-red-100 text-red-700',
        };
        return colors[status] || 'bg-gray-100 text-gray-700';
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Seller Management" }), error && (_jsxs("div", { className: "flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700", children: [_jsx(AlertCircle, { size: 20 }), _jsx("p", { children: error.message }), _jsx("button", { onClick: clearError, className: "ml-auto text-sm underline hover:no-underline", children: "Dismiss" })] })), _jsxs("div", { className: "flex gap-4 flex-wrap", children: [_jsx("button", { onClick: () => setFilterStatus('all'), className: `px-4 py-2 rounded-lg transition-colors font-medium ${filterStatus === 'all'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`, children: "All Sellers" }), _jsx("button", { onClick: () => setFilterStatus('PENDING'), className: `px-4 py-2 rounded-lg transition-colors font-medium ${filterStatus === 'PENDING'
                            ? 'bg-yellow-600 text-white'
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`, children: "Pending" }), _jsx("button", { onClick: () => setFilterStatus('APPROVED'), className: `px-4 py-2 rounded-lg transition-colors font-medium ${filterStatus === 'APPROVED'
                            ? 'bg-green-600 text-white'
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`, children: "Approved" }), _jsx("button", { onClick: () => setFilterStatus('REJECTED'), className: `px-4 py-2 rounded-lg transition-colors font-medium ${filterStatus === 'REJECTED'
                            ? 'bg-red-600 text-white'
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`, children: "Rejected" })] }), _jsxs("div", { className: "bg-white p-6 rounded-lg shadow-sm border border-gray-200", children: [loading ? (_jsx("div", { className: "text-center py-12 text-gray-500", children: "Loading sellers..." })) : sellers.length === 0 ? (_jsxs("div", { className: "text-center py-12 text-gray-500", children: [_jsx("p", { className: "text-lg font-semibold", children: "No sellers found" }), _jsx("p", { className: "text-sm mt-2", children: "No sellers match the selected filter" })] })) : (_jsxs("div", { className: "overflow-x-auto", children: [_jsxs("table", { className: "w-full", children: [_jsx("thead", { className: "border-b border-gray-200 bg-gray-50", children: _jsxs("tr", { children: [_jsx("th", { className: "text-left py-3 px-4 font-semibold text-gray-900", children: "Business Name" }), _jsx("th", { className: "text-left py-3 px-4 font-semibold text-gray-900", children: "Type" }), _jsx("th", { className: "text-left py-3 px-4 font-semibold text-gray-900", children: "Status" }), _jsx("th", { className: "text-left py-3 px-4 font-semibold text-gray-900", children: "Rating" }), _jsx("th", { className: "text-left py-3 px-4 font-semibold text-gray-900", children: "Orders" }), _jsx("th", { className: "text-center py-3 px-4 font-semibold text-gray-900", children: "Actions" })] }) }), _jsx("tbody", { children: sellers.map((seller) => (_jsxs("tr", { className: "border-b border-gray-100 hover:bg-gray-50", children: [_jsx("td", { className: "py-4 px-4 text-gray-900 font-medium", children: seller.businessName }), _jsx("td", { className: "py-4 px-4 text-gray-600 text-sm", children: seller.businessType }), _jsx("td", { className: "py-4 px-4", children: _jsx("span", { className: `inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(seller.status)}`, children: seller.status }) }), _jsx("td", { className: "py-4 px-4 text-gray-600", children: seller.rating > 0 ? `${seller.rating.toFixed(1)} ⭐` : 'No rating' }), _jsx("td", { className: "py-4 px-4 text-gray-600", children: seller.totalOrders }), _jsx("td", { className: "py-4 px-4", children: _jsxs("div", { className: "flex items-center justify-center gap-2", children: [_jsx("button", { className: "p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors", title: "View details", children: _jsx(Eye, { size: 18 }) }), seller.status === 'PENDING' && (_jsxs(_Fragment, { children: [_jsx("button", { onClick: () => handleApprove(seller.id), className: "p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors", title: "Approve", children: _jsx(CheckCircle, { size: 18 }) }), _jsx("button", { onClick: () => setShowRejectForm(showRejectForm === seller.id ? null : seller.id), className: "p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors", title: "Reject", children: _jsx(XCircle, { size: 18 }) })] }))] }) })] }, seller.id))) })] }), showRejectForm !== null && (_jsx("div", { className: "border-t border-gray-200 mt-4 pt-4", children: _jsxs("div", { className: "bg-red-50 p-4 rounded-lg border border-red-200", children: [_jsxs("h4", { className: "font-semibold text-gray-900 mb-2", children: ["Reject ", sellers.find((s) => s.id === showRejectForm)?.businessName] }), _jsx("textarea", { placeholder: "Provide a reason for rejection...", value: rejectReason[showRejectForm] || '', onChange: (e) => setRejectReason({ ...rejectReason, [showRejectForm]: e.target.value }), className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 mb-3", rows: 3 }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => handleReject(showRejectForm), className: "px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors", children: "Confirm Rejection" }), _jsx("button", { onClick: () => setShowRejectForm(null), className: "px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors", children: "Cancel" })] })] }) }))] })), !loading && sellers.length > 0 && (_jsxs("div", { className: "flex items-center justify-center gap-2 mt-4 pt-4 border-t border-gray-200", children: [_jsx("button", { className: "px-4 py-2 border border-gray-300 rounded hover:bg-gray-50", children: "Previous" }), _jsxs("span", { className: "text-sm text-gray-600", children: ["Showing ", sellers.length, " of ", total] }), _jsx("button", { className: "px-4 py-2 border border-gray-300 rounded hover:bg-gray-50", children: "Next" })] }))] })] }));
}
export default SellersPage;
