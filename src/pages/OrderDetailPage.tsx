import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  MapPin,
  Calendar,
  User,
  ShoppingCart,
  Warning,
  CreditCard,
  Receipt,
  Truck,
  Phone,
  Envelope,
} from "@phosphor-icons/react";
import {
  useAdminOrderDetail,
  useAdminUpdateOrderStatus,
  useAdminRefundOrder,
  useAdminCancelOrder,
  useAdminDisputeOrder,
} from "@/api/exports";
import { useDelhiveryApi } from "@/api/integrations/delhivery";
import {
  Button,
  StatusBadge,
  ConfirmDialog,
  Toast,
  Card,
  ErrorAlert,
} from "@/components";

function OrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  // API Hooks
  const {
    data: orderResponse,
    isLoading,
    error,
  } = useAdminOrderDetail(orderId || "");
  const updateOrderStatus = useAdminUpdateOrderStatus();
  const refundOrderMutation = useAdminRefundOrder();
  const cancelOrderMutation = useAdminCancelOrder();
  const disputeOrderMutation = useAdminDisputeOrder();
  const { createShipment } = useDelhiveryApi();

  // Local UI State
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [showCreateShipmentModal, setShowCreateShipmentModal] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [trackingNumber, setTrackingNumber] = useState(""); // Add this
  const [statusReason, setStatusReason] = useState(""); // Add this
  const [refundReason, setRefundReason] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [disputeReason, setDisputeReason] = useState("");
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const order = orderResponse?.data;

  // Permission Logic
  const canUpdate =
    order &&
    !["delivered", "cancelled", "refunded"].includes(
      order.status.toLowerCase(),
    );
  const canRefund =
    order && ["delivered", "shipped"].includes(order.status.toLowerCase());
  const canCancel =
    order &&
    !["delivered", "cancelled", "refunded", "shipped"].includes(
      order.status.toLowerCase(),
    );
  const canDispute = order && !order.disputed;
  const canCreateShipment =
    order &&
    ["processing", "packed"].includes(order.status.toLowerCase());

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4" />
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
            Fetching Shipment Data...
          </p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-7xl mx-auto space-y-4">
          <button
            onClick={() => navigate("/orders")}
            className="inline-flex items-center gap-2 text-orange-600 font-bold uppercase text-xs tracking-widest"
          >
            <ArrowLeft size={20} weight="bold" /> Back to Orders
          </button>
          <ErrorAlert message={error?.message || "Order not found"} />
        </div>
      </div>
    );
  }

  const handleStatusChange = async () => {
    if (!orderId || !newStatus) return;
    try {
      await updateOrderStatus.mutateAsync({
        id: orderId,
        data: {
          status: newStatus as any,
          trackingNumber: trackingNumber || undefined, // New field
          statusReason: statusReason || undefined, // New field
        },
      });
      setShowStatusModal(false);
      // Reset fields
      setNewStatus("");
      setTrackingNumber("");
      setStatusReason("");
      setToast({
        type: "success",
        message: "Order status updated successfully",
      });
    } catch (err: unknown) {
      setToast({
        type: "error",
        message: (err instanceof Error) ? err.message : "Failed to update status",
      });
    }
  };

  const totalWeightInGrams = order?.items?.reduce((total, item) => {
    // Extract numeric value (e.g., "300.00") and unit (e.g., "G")
    const weightMatch = item?.weight?.match(/([\d.]+)\s*([a-zA-Z]+)/);

    if (!weightMatch) return total;

    let value = parseFloat(weightMatch[1]);
    const unit = weightMatch[2].toUpperCase();
    const quantity = item.quantity || 0;

    // Convert to grams based on unit
    if (unit === 'KG') {
      value = value * 1000;
    } else if (unit === 'G' || unit === 'GM') {
      value = value; // Already in grams
    }

    return total + (value * quantity);
  }, 0);

  console.log(`Total weight: ${totalWeightInGrams} grams`);

  const handleCreateShipment = async () => {
    if (!order) return;
    const paymentMethod = order?.paymentMethod && order?.paymentMethod === "Prepaid" ? "Prepaid" : "COD";
    console.log(totalWeightInGrams, 'Calculated total weight in grams [handleCreateShipment]');
    try {
      const shipmentData = {
        orderNumber: order?.orderNumber,
        customerName: order.customerName,
        address: `${order.shippingAddressLine1}${order.shippingAddressLine2 ? `, ${order.shippingAddressLine2}` : ''}`,
        pincode: order.shippingPostalCode,
        city: order.shippingCity,
        state: order.shippingState,
        country: order.shippingCountry,
        phone: order.shippingAddressPhone,
        orderId: order.id,
        weight: totalWeightInGrams?.toString(), // Delhivery expects weight in grams as a string
        isPrepaid: paymentMethod === 'COD' ? false : true,
        products: order.items.map((item: any) => ({
          name: item.productName,
          // sku: item.sku,
          quantity: item.quantity,
          price: item.discountedPrice || item.unitPrice,
          weight: item.weight,
        })),
        totalAmount: Math.round(order.finalAmount),
        totalItems: order.items.length,

      };

      const result = await createShipment(shipmentData);
      setShowCreateShipmentModal(false);
      setToast({
        type: "success",
        message: "Shipment created successfully",
      });
      // Optionally refresh the order data
    } catch (err: unknown) {
      setToast({
        type: "error",
        message: (err instanceof Error) ? err.message : "Failed to create shipment",
      });
    }
  };

  const handleRefund = async () => {
    if (!orderId || !refundReason) return;
    try {
      await refundOrderMutation.mutateAsync({
        id: orderId,
        data: { reason: refundReason },
      });
      setShowRefundModal(false);
      setToast({ type: "success", message: "Refund processed" });
    } catch (err: unknown) {
      setToast({ type: "error", message: (err instanceof Error) ? err.message : "Failed to cancel order" });
    }
  };

  const handleCancel = async () => {
    if (!orderId) return;
    try {
      await cancelOrderMutation.mutateAsync({
        id: orderId,
        reason: cancelReason || undefined,
      });
      setShowCancelModal(false);
      setToast({ type: "success", message: "Order cancelled" });
    } catch (err: any) {
      setToast({ type: "error", message: err.message });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-12">
      <div className="space-y-6">
        {/* Top Navigation & Toast */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => navigate("/orders")}
            className="group flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors font-black text-[10px] uppercase tracking-[0.2em]"
          >
            <ArrowLeft size={16} weight="bold" /> Back to Dashboard
          </button>
          {toast && (
            <Toast
              type={toast.type}
              message={toast.message}
              onClose={() => setToast(null)}
            />
          )}
        </div>

        {/* Order Hero Header */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                Order No.: {order?.orderNumber}
              </h1>
              <StatusBadge
                status={order?.status}
                color={order?.status === "CONFIRMED" ? "success" : "warning"}
              />
            </div>
            <p className="text-slate-400 text-sm font-medium">
              Ref ID: {order.id}
            </p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <Button
              variant="outline"
              className="flex-1 md:flex-none border-slate-200"
              onClick={() => window.print()}
            >
              Invoice
            </Button>
            {canCreateShipment && (
              <Button
                variant="secondary"
                className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700"
                onClick={() => setShowCreateShipmentModal(true)}
              >
                Create Shipment
              </Button>
            )}
            <Button
              variant="primary"
              className="flex-1 md:flex-none bg-orange-600 hover:bg-orange-700"
              onClick={() => setShowStatusModal(true)}
            >
              Update Status
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content (Items & Addresses) */}
          <div className="lg:col-span-2 space-y-8">
            {/* 1. Shipment Items */}
            <Card className="overflow-hidden border-slate-200">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                  <Package
                    size={18}
                    weight="duotone"
                    className="text-blue-500"
                  />{" "}
                  Items in Shipment
                </h2>
                <span className="text-xs font-bold text-slate-400">
                  {order.items.length} units
                </span>
              </div>
              <div className="divide-y divide-slate-100">
                {order?.items?.map((item: any) => (
                  <div key={item.id} className="p-6 flex items-center gap-6">
                    <div className="h-20 w-20 bg-slate-100 rounded-[24px] overflow-hidden border border-brand-brown/10 shadow-[0_20px_50px_rgba(0,0,0,0.08)] flex-shrink-0">
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="h-full w-full object-cover"
                        onError={(e) =>
                        (e.currentTarget.src =
                          "https://placehold.co/200x200?text=Product")
                        }
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-900 truncate">
                        {item.productName}
                      </h3>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                          SKU: {item.sku}
                        </span>
                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-tighter">
                          Weight: {item.weight}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-400">
                            {item.quantity} x ₹{item.discountedPrice || item.unitPrice}
                          </span>
                          {item.discountedPercent && item.discountedPercent > 0 && (
                            <span className="text-[10px] font-black px-1.5 py-0.5 bg-rose-50 text-rose-600 rounded">
                              -{item.discountedPercent}%
                            </span>
                          )}
                        </div>
                        {item.discountedPercent && item.discountedPercent > 0 && (
                          <span className="text-[10px] line-through text-slate-400">
                            ₹{(item.unitPrice * item.quantity).toFixed(2)}
                          </span>
                        )}
                        <p className="text-sm font-black text-slate-900">
                          ₹{item.discountedPrice ? (item.discountedPrice * item.quantity).toFixed(2) : (item.unitPrice * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* 2. Logistics & Financials Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Shipping Address */}
              <Card className="p-6 border-slate-200">
                {/* <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500 mb-6 flex items-center gap-2">
                  <MapPin size={18} weight="fill" /> Delivery Destination
                </h3> */}
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 mb-6 flex items-center gap-2">
                  <MapPin size={18} weight="fill" /> Delivery Destination
                </h3>
                <div className="space-y-1">
                  <p className="text-lg font-black text-slate-900 mb-2">
                    {order.customerName}
                  </p>
                  <p className="text-sm font-bold text-slate-600 leading-relaxed">
                    {order.shippingAddressLine1}
                    <br />
                    {order.shippingAddressLine2 && (
                      <>
                        {order.shippingAddressLine2}
                        <br />
                      </>
                    )}
                    {order.shippingCity}, {order.shippingState} —{" "}
                    {order.shippingPostalCode}
                    <br />
                    <span className="text-blue-500 uppercase tracking-widest text-[10px]">
                      {order.shippingCountry}
                    </span>
                  </p>
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-3 text-slate-500">
                    <Phone size={16} weight="bold" />
                    <span className="text-sm font-bold">
                      {order.shippingAddressPhone}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Order Summary / Billing */}
              <Card className="p-6 border-slate-200 bg-slate-50/30">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 mb-6 flex items-center gap-2">
                  <Receipt size={18} weight="fill" /> Billing Summary
                </h3>
                <div className="space-y-4 text-sm font-bold">
                  <div className="flex justify-between text-slate-500">
                    <span>Items Total</span>
                    <span>₹{order.totalAmount}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Tax (GST)</span>
                    <span>+ ₹{order.taxAmount}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Logistics Fee</span>
                    <span>
                      {Number(order.shippingCost) === 0
                        ? "FREE"
                        : `₹${order.shippingCost}`}
                    </span>
                  </div>
                  <div className="pt-4 border-t-2 border-dashed border-slate-200 flex justify-between items-end">
                    <span className="text-slate-900">Total Billable</span>
                    <span className="text-2xl font-black text-blue-600 tracking-tighter">
                      ₹{order.finalAmount}
                    </span>
                  </div>
                  <div className="bg-white rounded-xl p-3 border border-slate-200 flex justify-between items-center mt-2">
                    <span className="text-[10px] font-black uppercase text-slate-400">
                      Payment Method
                    </span>
                    <span className="text-[10px] font-black uppercase text-blue-600">
                      {order.paymentMethod}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Right Sidebar (Customer & Timeline) */}
          <div className="space-y-6">
            {/* Customer Details */}
            <Card className="p-6 border-slate-200 bg-slate-50/30">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-6">
                Customer Context
              </h3>
              <div className="flex items-center gap-4 mb-6">
                {/* <div className="h-14 w-14 rounded-2xl bg-orange-600 flex items-center justify-center font-black text-2xl shadow-lg shadow-orange-900/20">
                  {order.customerName.charAt(0)}
                </div> */}
                <div>
                  <p className="font-black text-xl leading-none text-blue-600">
                    {order.customerName}
                  </p>
                  {/* <p className="text-xs font-bold text-blue-600 mt-1">{order.customerId.split('-')[0]}...</p> */}
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500 rounded-lg text-white">
                    <Envelope size={16} />
                  </div>
                  <span className="text-sm font-bold text-blue-600 truncate">
                    {order.customerEmail}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500 rounded-lg text-white">
                    <Phone size={16} />
                  </div>
                  <span className="text-sm font-bold text-blue-600">
                    {order.customerPhone}
                  </span>
                </div>
              </div>
            </Card>

            {/* 3. Promotional & Metadata Insights */}
            {order?.metadata?.promotion && (
              <Card className="p-6 border-blue-100 bg-blue-50/20 overflow-hidden relative">
                {/* Decorative Background Icon */}
                <div className="absolute -right-4 -top-4 opacity-10 text-blue-600 rotate-12">
                  <ShoppingCart size={80} weight="fill" />
                </div>

                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-4 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                  Applied Promotion
                </h3>

                <div className="relative z-10">
                  <p className="text-sm font-black text-slate-900 leading-tight">
                    {order?.metadata?.promotion?.title}
                  </p>

                  <div className="mt-3 flex items-center gap-2">
                    <span className="px-2 py-1 bg-blue-600 text-[9px] font-black text-white rounded uppercase tracking-tighter">
                      {order?.metadata?.promotion?.type?.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 italic">
                      Applied: {new Date(order?.metadata?.appliedAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Logic for different promotion types */}
                  {order?.metadata?.promotion?.type === 'free_gift' && (
                    <div className="mt-4 p-3 bg-white/60 rounded-xl border border-blue-100 border-dashed">
                      <p className="text-[10px] font-bold text-blue-800">
                        LOGISTICS ACTION REQUIRED:
                      </p>
                      <p className="text-xs font-black text-slate-700 mt-1">
                        Add 100g Bonus Pouch to Shipment
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Future Metadata expansion placeholder */}
            {Object.keys(order?.metadata || {}).filter(k => k !== 'promotion' && k !== 'appliedAt').length > 0 && (
              <Card className="p-4 border-slate-200 bg-slate-100/50">
                <h3 className="text-[9px] font-black uppercase text-slate-400 mb-2">Extended Metadata</h3>
                <pre className="text-[10px] text-slate-500 font-mono overflow-x-auto">
                  {JSON.stringify(order.metadata, null, 2)}
                </pre>
              </Card>
            )}

            {/* Logistics Timeline */}
            <Card className="p-6 border-slate-200">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2">
                <Calendar size={18} weight="bold" /> Event Timeline
              </h3>
              <div className="relative space-y-6 pl-6 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
                <div className="relative">
                  <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-blue-600 ring-4 ring-blue-100" />
                  <p className="text-xs font-black text-slate-900">
                    Order Placed
                  </p>
                  <p className="text-[10px] font-bold text-slate-400">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-slate-200" />
                  <p className="text-xs font-black text-slate-400">
                    Current Status
                  </p>
                  <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                    {order.status}
                  </p>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6 border-slate-200">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-4">
                Admin Controls
              </h3>
              <div className="space-y-3">
                {canUpdate && (
                  <Button
                    variant="primary"
                    className="w-full bg-orange-600 py-6 font-black"
                    onClick={() => setShowStatusModal(true)}
                  >
                    Update Status
                  </Button>
                )}
                {canCancel && (
                  <Button
                    variant="outline"
                    className="w-full text-red-500 border-red-100 hover:bg-red-50"
                    onClick={() => setShowCancelModal(true)}
                  >
                    Cancel Order
                  </Button>
                )}
                {canRefund && (
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={() => setShowRefundModal(true)}
                  >
                    Issue Refund
                  </Button>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Confirmation Dialogs */}
      <ConfirmDialog
        isOpen={showStatusModal}
        title="Update Logistics State"
        description="Transition this shipment to the next phase."
        onCancel={() => {
          setShowStatusModal(false);
          setNewStatus("");
        }}
        onConfirm={handleStatusChange}
        isLoading={updateOrderStatus.isPending}
      >
        <div className="space-y-4 mt-4 text-left">
          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
              Order State
            </label>
            <select
              className="w-full p-3 rounded-xl border border-slate-200 font-bold text-sm outline-none focus:ring-2 focus:ring-orange-500 bg-white"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <option value="">Select Next Phase...</option>
              <option value="PROCESSING">1. Processing</option>
              <option value="PACKED">2. Shipment Packed</option>
              {/* Add Handover here */}
              <option value="HANDOVER">3. Handover to Courier</option>
              <option value="SHIPPED">4. Shipped (In Transit)</option>
              <option value="OUT_FOR_DELIVERY">5. Out for Delivery</option>
              <option value="DELIVERED">6. Delivered Successfully ✅</option>
              <option value="CANCELLED">7. Cancel Order ❌</option>
              <option value="DELIVERY_FAILED">Delivery Failed ❌</option>
              <option value="RTO">Return to Origin (RTO)</option>
            </select>
          </div>

          {/* Tracking ID: Shows only for Shipped or Out for Delivery */}
          {["HANDOVER", "SHIPPED", "OUT_FOR_DELIVERY"].includes(newStatus) && (
            <div className="animate-in fade-in slide-in-from-top-2">
              <label className="text-[10px] font-black uppercase text-orange-600 ml-1">
                Tracking Number / AWB
              </label>
              <input
                type="text"
                placeholder="Enter AWB Number"
                className="w-full p-3 rounded-xl border border-orange-100 font-bold text-sm outline-none focus:ring-2 focus:ring-orange-500 bg-orange-50/20"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
              />
            </div>
          )}

          {/* Failure Reason: Shows only for Failed or RTO states */}
          {["DELIVERY_FAILED", "RTO"].includes(newStatus) && (
            <div className="animate-in fade-in slide-in-from-top-2">
              <label className="text-[10px] font-black uppercase text-red-500 ml-1">
                Reason for Failure
              </label>
              <select
                className="w-full p-3 rounded-xl border border-red-100 font-bold text-sm outline-none focus:ring-2 focus:ring-red-500 bg-red-50/20"
                value={statusReason}
                onChange={(e) => setStatusReason(e.target.value)}
              >
                <option value="">-- Select Reason --</option>
                <option value="Customer Not Available">
                  Customer Not Available
                </option>
                <option value="Address Not Found">Address Not Found</option>
                <option value="Payment Refused">Payment Refused (COD)</option>
                <option value="Customer Refused">
                  Customer Refused Delivery
                </option>
                <option value="Other">Other</option>
              </select>
            </div>
          )}

          {newStatus === "CANCELLED" && (
            <div className="animate-in fade-in slide-in-from-top-2">
              <label className="text-[10px] font-black uppercase text-red-500 ml-1">
                Cancellation Reason
              </label>
              <select
                className="w-full p-3 rounded-xl border border-red-100 font-bold text-sm outline-none focus:ring-2 focus:ring-red-500 bg-red-50/20"
                value={statusReason}
                onChange={(e) => setStatusReason(e.target.value)}
              >
                <option value="">-- Select Reason --</option>
                <option value="Customer Requested Cancellation">
                  Customer Requested Cancellation
                </option>
                <option value="Inventory Issue">Inventory Issue</option>
                <option value="Payment Issue">Payment Issue</option>
                <option value="Other">Other</option>
              </select>
            </div>
          )}
        </div>
      </ConfirmDialog>

      <ConfirmDialog
        isOpen={showCreateShipmentModal}
        title="Create Shipment"
        description="This will create a shipment with Delhivery for this order. Continue?"
        onCancel={() => setShowCreateShipmentModal(false)}
        onConfirm={handleCreateShipment}
        isLoading={false} // Add loading state if needed
      />

      <ConfirmDialog
        isOpen={showCancelModal}
        title="Cancel Order"
        description="This will permanently cancel the order and release reservation. Continue?"
        isDangerous
        onCancel={() => setShowCancelModal(false)}
        onConfirm={handleCancel}
        isLoading={cancelOrderMutation.isPending}
      />
    </div>
  );
}

export default OrderDetailPage;
