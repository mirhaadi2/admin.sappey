import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Package, Warning } from '@phosphor-icons/react';
import {
  useAdminOrdersList,
  useAdminUpdateOrderStatus,
  useAdminRefundOrder,
  useAdminCancelOrder,
  useAdminDisputeOrder,
} from '@/api/exports';
import type { AdminOrder, AdminOrdersListParams } from '@/api/admin/orders/types';
import { Button, Table, Pagination, ConfirmDialog, Toast } from '@/components';
import type { TableColumn } from '@/components/Table';
import { formatCurrency, formatDate, getOrderStatusColor } from '@/utils/order';

function OrdersPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>('all');
  const [disputed, setDisputed] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'createdAt' | 'totalAmount'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [action, setAction] = useState<'refund' | 'cancel' | 'status' | null>(null);
  const [reason, setReason] = useState('');
  const [statusInput, setStatusInput] = useState('processing');
  const [showConfirm, setShowConfirm] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const params = useMemo(
    (): AdminOrdersListParams => ({
      page,
      limit,
      search: search || undefined,
      status: status === 'all' ? undefined : (status as any),
      disputed: disputed === 'disputed' ? true : disputed === 'normal' ? false : undefined,
      sortBy,
      sortOrder,
    }),
    [page, limit, search, status, disputed, sortBy, sortOrder]
  );

  const { data: ordersData, isLoading, error, refetch } = useAdminOrdersList(params);
  const updateStatus = useAdminUpdateOrderStatus();
  const refundMutation = useAdminRefundOrder();
  const cancelMutation = useAdminCancelOrder();
  const disputeMutation = useAdminDisputeOrder();

  const orders = ordersData?.data?.data || [];

  const handleViewDetails = (order: AdminOrder) => {
    navigate(`/orders/${order.id}`, { state: { order } });
  };

  const handleActionClick = (order: AdminOrder, actionType: 'refund' | 'cancel' | 'status') => {
    setSelectedOrder(order);
    setAction(actionType);
    setReason('');
    setStatusInput('processing');
    setShowConfirm(true);
  };

  const confirmAction = async () => {
    if (!selectedOrder) return;

    try {
      if (action === 'refund') {
        await refundMutation.mutateAsync({
          id: selectedOrder.id,
          data: { reason: reason || 'Admin initiated refund' },
        });
        setToastMessage({ type: 'success', message: 'Refund processed successfully' });
      } else if (action === 'cancel') {
        await cancelMutation.mutateAsync({
          id: selectedOrder.id,
          reason: reason || 'Cancelled by admin',
        });
        setToastMessage({ type: 'success', message: 'Order cancelled successfully' });
      } else if (action === 'status') {
        await updateStatus.mutateAsync({
          id: selectedOrder.id,
          data: { status: statusInput as any },
        });
        setToastMessage({ type: 'success', message: 'Order status updated' });
      }
      
      setShowConfirm(false);
      setAction(null);
      await refetch();
    } catch (err: unknown) {
      setToastMessage({ type: 'error', message: (err instanceof Error) ? err.message : 'Action failed' });
    }
  };

  const tableColumns: Array<TableColumn<AdminOrder>> = [
    {
      key: 'orderNumber',
      header: 'Order #',
      width: '12%',
      render: (value: unknown, order: AdminOrder) => (
        <button
          onClick={() => handleViewDetails(order)}
          className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
        >
          {value as string}
        </button>
      ),
    },
    {
      key: 'customerName',
      header: 'Customer',
      width: '15%',
      render: (value: unknown, _order: AdminOrder) => <span className="text-slate-900">{value as string}</span>,
    },
    // {
    //   key: 'sellerName',
    //   header: 'Seller',
    //   width: '15%',
    //   render: (value: string) => <span className="text-slate-700">{value}</span>,
    // },
    {
      key: 'totalAmount',
      header: 'Amount',
      width: '12%',
      render: (value: unknown, _order: AdminOrder) => (
        <span className="font-semibold text-slate-900">{formatCurrency(value as number)}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      width: '15%',
      render: (value: unknown, _order: AdminOrder) => {
        const { bg, text } = getOrderStatusColor(value as string);
        return (
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${bg} ${text}`}>
            {(value as string).charAt(0).toUpperCase() + (value as string).slice(1)}
          </span>
        );
      },
    },
    {
      key: 'disputed',
      header: 'Disputed',
      width: '10%',
      render: (value: unknown, _order: AdminOrder) => (
        <span
          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
            (value as boolean) ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
          }`}
        >
          {(value as boolean) ? (
            <>
              <Warning size={14} /> Yes
            </>
          ) : (
            'No'
          )}
        </span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Date',
      width: '12%',
      render: (value: unknown, _order: AdminOrder) => <span className="text-slate-600 text-sm">{formatDate(value as string)}</span>,
    },
  ];

  return (
    <>
      <div className="space-y-6 min-h-screen bg-slate-50 pb-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Orders Management</h1>
            <p className="text-slate-500 text-sm font-medium">Manage and track all customer orders</p>
          </div>
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'createdAt' | 'totalAmount')}
              className="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="createdAt">Sort by Date</option>
              <option value="totalAmount">Sort by Amount</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-2 border border-slate-300 rounded-lg hover:bg-slate-100 text-sm font-medium"
            >
              {sortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
            </button>
          </div>
        </div>

        <Table
          data={orders}
          columns={tableColumns}
          isLoading={isLoading}
          error={error ? (error as any).message || String(error) : null}
          emptyMessage="No orders found"
          searchValue={search}
          onSearchChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          filterConfig={{
            searchPlaceholder: 'Search by order #, customer, seller...',
            filters: [
              {
                key: 'status',
                label: 'Status',
                type: 'select',
                options: [
                  { label: 'Pending', value: 'pending' },
                  { label: 'Processing', value: 'processing' },
                  { label: 'Shipped', value: 'shipped' },
                  { label: 'Delivered', value: 'delivered' },
                  { label: 'Cancelled', value: 'cancelled' },
                  { label: 'Refunded', value: 'refunded' },
                ],
              },
              {
                key: 'disputed',
                label: 'Disputes',
                type: 'select',
                options: [
                  { label: 'Active Disputes', value: 'disputed' },
                  { label: 'Normal Orders', value: 'normal' },
                ],
              },
            ],
          }}
          filterValues={{ status, disputed }}
          onFilterChange={(key, value) => {
            if (key === 'status') {
              setStatus(value as string);
              setPage(1);
            } else if (key === 'disputed') {
              setDisputed(value as string);
              setPage(1);
            }
          }}
          rowActions={(order: AdminOrder) => (
            <div className="flex items-center justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                icon={<Eye size={14} />}
                onClick={() => handleViewDetails(order)}
                title="View Details"
              />
              {/* {order.status !== 'delivered' && order.status !== 'cancelled' && order.status !== 'refunded' && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleActionClick(order, 'status')}
                    title="Update Status"
                  >
                    <>
                      <Package size={14} /> Status
                    </>
                  </Button>
                </>
              )}
              {(order.status === 'delivered' || order.status === 'processing') && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleActionClick(order, 'refund')}
                  title="Process Refund"
                >
                  Refund
                </Button>
              )} */}
              {order.status !== 'cancelled' && order.status !== 'refunded' && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleActionClick(order, 'cancel')}
                  title="Cancel Order"
                >
                  Cancel
                </Button>
              )}
            </div>
          )}
        />

        <Pagination
          page={page}
          limit={limit}
          total={ordersData?.data?.total || 0}
          onPageChange={(next) => setPage(next)}
          onLimitChange={(nextLimit) => {
            setLimit(nextLimit);
            setPage(1);
          }}
        />
      </div>

      {/* Action Confirmation Modal */}
      <ConfirmDialog
        isOpen={showConfirm}
        title={
          action === 'refund'
            ? 'Process Refund'
            : action === 'cancel'
              ? 'Cancel Order'
              : 'Update Order Status'
        }
        description={
          action === 'refund'
            ? `Process refund for order #${selectedOrder?.orderNumber}? Amount: ${formatCurrency(selectedOrder?.totalAmount || 0)}`
            : action === 'cancel'
              ? `Are you sure you want to cancel order #${selectedOrder?.orderNumber}? This action cannot be undone.`
              : `Update status for order #${selectedOrder?.orderNumber} to ${statusInput}?`
        }
        isDangerous={action === 'cancel'}
        isLoading={
          updateStatus.isPending ||
          refundMutation.isPending ||
          cancelMutation.isPending ||
          disputeMutation.isPending
        }
        confirmText={action === 'refund' ? 'Process Refund' : action === 'cancel' ? 'Cancel' : 'Update'}
        onConfirm={confirmAction}
        onCancel={() => {
          setShowConfirm(false);
          setAction(null);
        }}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <Toast
          type={toastMessage.type}
          message={toastMessage.message}
          onClose={() => setToastMessage(null)}
        />
      )}
    </>
  );
}

export default OrdersPage;
