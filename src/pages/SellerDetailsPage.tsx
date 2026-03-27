import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import {
    ArrowLeft,
    CheckCircle,
    X,
    Warning,
    Buildings,
    User,
    Envelope,
    Phone,
    MapPin,
    CreditCard,
    FileText,
    Calendar,
    CurrencyInr,
    Package,
    Star,
    Clock,
    Prohibit,
    Eye,
    WarningCircle as AlertCircle,
} from "@phosphor-icons/react";
import {
    useAdminSellerDetail,
    useAdminApproveSeller,
    useAdminRejectSeller,
} from "@/api/exports";
import { Button } from "@/components/Button";
import { Badge, ErrorAlert, Card, CardHeader, CardBody, Toast } from "@/components";

function SellerDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [rejectReason, setRejectReason] = useState("");
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState<"success" | "error">("success");
    const [showToast, setShowToast] = useState(false);

    const queryClient = useQueryClient();
    const { data: seller, isLoading, error } = useAdminSellerDetail(id!);
    const approveSeller = useAdminApproveSeller();
    const rejectSeller = useAdminRejectSeller();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="flex flex-col items-center justify-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                    <p className="text-slate-600 font-medium">
                        Loading seller details...
                    </p>
                </div>
            </div>
        );
    }

    if (error || !seller) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        icon={<ArrowLeft size={16} />}
                        onClick={() => navigate(-1)}
                    >
                        Back
                    </Button>
                </div>
                <ErrorAlert
                    title="Error Loading Seller"
                    message={error?.message || "Failed to load seller details"}
                />
            </div>
        );
    }

    const handleApprove = async () => {
        if (!seller) return;
        try {
            setActionLoading("approve");
            await approveSeller.mutateAsync({ id: seller.data.id });
            queryClient.invalidateQueries({ queryKey: ["admin", "seller", id] });
            queryClient.invalidateQueries({ queryKey: ["admin", "sellers"] });
            setToastMessage(`${seller.data.businessName} has been approved successfully.`);
            setToastType("success");
            setShowToast(true);
        } catch (err) {
            console.error("Error approving seller:", err);
            setToastMessage("Failed to approve seller. Please try again.");
            setToastType("error");
            setShowToast(true);
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async () => {
        if (!seller || !rejectReason.trim()) return;
        try {
            setActionLoading("reject");
            await rejectSeller.mutateAsync({
                id: seller.data.id,
                data: { reason: rejectReason },
            });
            setShowRejectModal(false);
            setRejectReason("");
            queryClient.invalidateQueries({ queryKey: ["admin", "seller", id] });
            queryClient.invalidateQueries({ queryKey: ["admin", "sellers"] });
            setToastMessage(`${seller.data.businessName} has been rejected.`);
            setToastType("success");
            setShowToast(true);
        } catch (err) {
            console.error("Error rejecting seller:", err);
            setToastMessage("Failed to reject seller. Please try again.");
            setToastType("error");
            setShowToast(true);
        } finally {
            setActionLoading(null);
        }
    };

    const getStatusBadge = (status: string) => {
        const variants: {
            [key: string]: "success" | "warning" | "danger" | "info";
        } = {
            APPROVED: "success",
            PENDING: "warning",
            REJECTED: "danger",
            SUSPENDED: "danger",
        };
        return variants[status] || "info";
    };

    const getBusinessTypeLabel = (type: string) => {
        const labels: { [key: string]: string } = {
            SOLE_PROPRIETOR: "Sole Proprietor",
            PARTNERSHIP: "Partnership",
            COMPANY: "Company",
            INDIVIDUAL: "Individual",
        };
        return labels[type] || type;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        icon={<ArrowLeft size={16} />}
                        onClick={() => navigate(-1)}
                    >
                        Back
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">
                            Seller Details
                        </h1>
                        <p className="text-slate-500 text-sm">
                            Complete information about {seller.data.businessName}
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                {seller.data.verificationStatus === "pending" && (
                    <div className="flex gap-3">
                        <Button
                            variant="success"
                            icon={<CheckCircle size={16} />}
                            onClick={handleApprove}
                            disabled={actionLoading === "approve"}
                        >
                            {actionLoading === "approve" ? "Approving..." : "Approve Seller"}
                        </Button>
                        <Button
                            variant="danger"
                            icon={<X size={16} />}
                            onClick={() => setShowRejectModal(true)}
                            disabled={actionLoading === "reject"}
                        >
                            Reject Seller
                        </Button>
                    </div>
                )}
            </div>

            {/* Status Banner */}
            <Card
                className={`border-l-4 ${seller.data.verificationStatus === "approved"
                        ? "border-l-green-500 bg-green-50"
                        : seller.data.verificationStatus === "rejected"
                            ? "border-l-red-500 bg-red-50"
                            : "border-l-yellow-500 bg-yellow-50"
                    }`}
            >
                <CardBody>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {seller.data.verificationStatus === "approved" && (
                                <CheckCircle size={24} className="text-green-600" />
                            )}
                            {seller.data.verificationStatus === "rejected" && (
                                <X size={24} className="text-red-600" />
                            )}
                            {seller.data.verificationStatus === "pending" && (
                                <Clock size={24} className="text-yellow-600" />
                            )}
                            <div>
                                <h3 className="font-semibold text-slate-900">
                                    Status:{" "}
                                    {seller.data.verificationStatus.charAt(0).toUpperCase() +
                                        seller.data.verificationStatus.slice(1)}
                                </h3>
                                <p className="text-sm text-slate-600">
                                    {seller.data.verificationStatus === "approved" &&
                                        "This seller is approved and can sell on the platform"}
                                    {seller.data.verificationStatus === "rejected" &&
                                        "This seller application was rejected"}
                                    {seller.data.verificationStatus === "pending" &&
                                        "This seller is waiting for approval"}
                                </p>
                            </div>
                        </div>
                        <Badge
                            variant={getStatusBadge(
                                seller.data.verificationStatus.toUpperCase(),
                            )}
                            size="lg"
                        >
                            {seller.data.verificationStatus.toUpperCase()}
                        </Badge>
                    </div>
                </CardBody>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Business Information */}
                    <Card>
                        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <Buildings size={18} className="text-blue-600" />
                                Business Information
                            </h3>
                        </CardHeader>
                        <CardBody className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-500 uppercase tracking-wide mb-1">
                                        Business Name
                                    </label>
                                    <p className="text-lg font-semibold text-slate-900">
                                        {seller.data.businessName}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-500 uppercase tracking-wide mb-1">
                                        Business Type
                                    </label>
                                    <p className="text-slate-700">
                                        {getBusinessTypeLabel(seller.data.businessType || "")}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-500 uppercase tracking-wide mb-1">
                                        Business ID Type
                                    </label>
                                    <p className="text-slate-700">
                                        {seller.data.businessIdType || "Not specified"}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-500 uppercase tracking-wide mb-1">
                                        Registration Number
                                    </label>
                                    <p className="text-slate-700 font-mono">
                                        {seller.data.businessRegistrationNo}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-500 uppercase tracking-wide mb-1">
                                        Business Phone
                                    </label>
                                    <p className="text-slate-700">{seller.data.businessPhone}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-500 uppercase tracking-wide mb-1">
                                        GST Number
                                    </label>
                                    <p className="text-slate-700">
                                        {seller.data.gstNumber || "Not provided"}
                                    </p>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-slate-500 uppercase tracking-wide mb-1">
                                        Business Address
                                    </label>
                                    <p className="text-slate-700">
                                        {seller.data.businessAddress}
                                    </p>
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    {/* Owner Information */}
                    <Card>
                        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <User size={18} className="text-green-600" />
                                Owner Information
                            </h3>
                        </CardHeader>
                        <CardBody className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-500 uppercase tracking-wide mb-1">
                                        Owner Name
                                    </label>
                                    <p className="text-lg font-semibold text-slate-900">
                                        {seller.data.ownerName}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-500 uppercase tracking-wide mb-1">
                                        Owner Email
                                    </label>
                                    <p className="text-slate-700">{seller.data.ownerEmail}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-500 uppercase tracking-wide mb-1">
                                        Personal Phone
                                    </label>
                                    <p className="text-slate-700">
                                        {seller.data.phone || "Not provided"}
                                    </p>
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    {/* Banking Information */}
                    <Card>
                        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <CreditCard size={18} className="text-purple-600" />
                                Banking Information
                            </h3>
                        </CardHeader>
                        <CardBody className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-500 uppercase tracking-wide mb-1">
                                        Account Name
                                    </label>
                                    <p className="text-slate-700">
                                        {seller.data.bankAccountName}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-500 uppercase tracking-wide mb-1">
                                        Account Number
                                    </label>
                                    <p className="text-slate-700 font-mono">
                                        {seller.data.bankAccountNumber}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-500 uppercase tracking-wide mb-1">
                                        IFSC Code
                                    </label>
                                    <p className="text-slate-700 font-mono">
                                        {seller.data.bankIfscCode}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-500 uppercase tracking-wide mb-1">
                                        Commission Rate
                                    </label>
                                    <p className="text-slate-700">
                                        {seller.data.commissionRate}%
                                    </p>
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    {/* Additional Information */}
                    <Card>
                        <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50">
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <FileText size={18} className="text-gray-600" />
                                Additional Information
                            </h3>
                        </CardHeader>
                        <CardBody className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-500 uppercase tracking-wide mb-1">
                                        Onboarding Step
                                    </label>
                                    <p className="text-slate-700">
                                        Step {seller.data.onboardingStep}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-500 uppercase tracking-wide mb-1">
                                        Created At
                                    </label>
                                    <p className="text-slate-700">
                                        {new Date(seller.data.createdAt).toLocaleDateString(
                                            "en-IN",
                                            {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            },
                                        )}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-500 uppercase tracking-wide mb-1">
                                        Last Updated
                                    </label>
                                    <p className="text-slate-700">
                                        {new Date(seller.data.updatedAt).toLocaleDateString(
                                            "en-IN",
                                            {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            },
                                        )}
                                    </p>
                                </div>
                                {seller.data.approvedAt && (
                                    <div>
                                        <label className="block text-sm font-medium text-slate-500 uppercase tracking-wide mb-1">
                                            Approved At
                                        </label>
                                        <p className="text-slate-700">
                                            {new Date(seller.data.approvedAt).toLocaleDateString(
                                                "en-IN",
                                                {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                },
                                            )}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {seller.data.rejectedReason && (
                                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                                    <div className="flex items-start gap-3">
                                        <AlertCircle size={20} className="text-red-600 mt-0.5" />
                                        <div>
                                            <h4 className="font-semibold text-red-900">
                                                Rejection Reason
                                            </h4>
                                            <p className="text-red-800 mt-1">
                                                {seller.data.rejectedReason}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {seller.data.metadata &&
                                Object.keys(seller.data.metadata).length > 0 && (
                                    <div className="mt-4">
                                        <label className="block text-sm font-medium text-slate-500 uppercase tracking-wide mb-2">
                                            Metadata
                                        </label>
                                        <pre className="text-xs text-slate-600 bg-slate-50 p-3 rounded border overflow-x-auto">
                                            {JSON.stringify(seller.data.metadata, null, 2)}
                                        </pre>
                                    </div>
                                )}
                        </CardBody>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Statistics */}
                    <Card>
                        <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50">
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <CurrencyInr size={20} className="text-orange-600" />
                                Statistics
                            </h3>
                        </CardHeader>
                        <CardBody className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Package size={16} className="text-slate-500" />
                                    <span className="text-sm text-slate-600">Products</span>
                                </div>
                                <span className="font-semibold text-slate-900">
                                    {seller.data.products || 0}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <FileText size={16} className="text-slate-500" />
                                    <span className="text-sm text-slate-600">Orders</span>
                                </div>
                                <span className="font-semibold text-slate-900">
                                    {seller.data.orders || 0}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <CurrencyInr size={16} className="text-slate-500" />
                                    <span className="text-sm text-slate-600">Revenue</span>
                                </div>
                                <span className="font-semibold text-slate-900">
                                    ₹{seller.data.revenue?.toLocaleString() || 0}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Star size={16} className="text-slate-500" />
                                    <span className="text-sm text-slate-600">Rating</span>
                                </div>
                                <span className="font-semibold text-slate-900">N/A</span>
                            </div>
                        </CardBody>
                    </Card>

                    {/* Quick Actions */}
                    <Card>
                        <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50">
                            <h3 className="text-lg font-bold text-slate-900">
                                Quick Actions
                            </h3>
                        </CardHeader>
                        <CardBody className="space-y-3">
                            <Button
                                variant="outline"
                                className="w-full justify-start"
                                icon={<Package size={16} />}
                            >
                                View Products
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full justify-start"
                                icon={<FileText size={16} />}
                            >
                                View Orders
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full justify-start"
                                icon={<Envelope size={16} />}
                            >
                                Send Message
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full justify-start"
                                icon={<Prohibit size={16} />}
                            >
                                Suspend Account
                            </Button>
                        </CardBody>
                    </Card>
                </div>
            </div>

            {/* Reject Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Reject Seller Application
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Are you sure you want to reject{" "}
                            <strong>{seller.data.businessName}</strong>'s application?
                        </p>

                        <textarea
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Provide a reason for rejection (required)..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none text-sm resize-none h-24 mb-4"
                            required
                        />

                        <div className="flex gap-3">
                            <Button
                                variant="ghost"
                                onClick={() => {
                                    setShowRejectModal(false);
                                    setRejectReason("");
                                }}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="danger"
                                onClick={handleReject}
                                disabled={actionLoading === "reject" || !rejectReason.trim()}
                                className="flex-1"
                            >
                                {actionLoading === "reject"
                                    ? "Rejecting..."
                                    : "Reject Application"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notification */}
            {showToast && (
                <Toast
                    message={toastMessage}
                    type={toastType}
                    onClose={() => setShowToast(false)}
                />
            )}
        </div>
    );
}

export default SellerDetailsPage;
