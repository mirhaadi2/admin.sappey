import React, { useMemo, useState } from 'react';
import { Package, Eye } from '@phosphor-icons/react';
import {
  useAdminBulkOrdersList,
  useAdminUpdateBulkOrderStatus,
} from '@/api/exports';
import type { AdminBulkOrder, AdminBulkOrdersListParams } from '@/api/admin/bulk-orders/types';
import { Button, Table, ConfirmDialog, Toast } from '@/components';
import type { TableColumn } from '@/components/Table';
import { formatDate } from '@/utils/order';

function BulkOrdersPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<AdminBulkOrder | null>(null);
  const [statusInput, setStatusInput] = useState<'pending' | 'contacted' | 'quoted' | 'confirmed' | 'completed' | 'cancelled'>('pending');
  const [showConfirm, setShowConfirm] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const params = useMemo(
    (): AdminBulkOrdersListParams => ({
      page,
      limit,
      search: search || undefined,
      status: status === 'all' ? undefined : (status as any),
    }),
    [page, limit, search, status]
  );

  const { data: bulkOrdersData, isLoading, error, refetch } = useAdminBulkOrdersList(params);
  const updateStatus = useAdminUpdateBulkOrderStatus();

  const bulkOrders = bulkOrdersData?.data || [];

  const handleActionClick = (order: AdminBulkOrder) => {
    setSelectedOrder(order);
    setStatusInput(order.status);
    setShowConfirm(true);
  };

  const confirmAction = async () => {
    if (!selectedOrder) return;

    try {
      await updateStatus.mutateAsync({
        id: selectedOrder.id,
        data: { status: statusInput },
      });
      setToastMessage({ type: 'success', message: 'Bulk order status updated successfully' });
      setShowConfirm(false);
      await refetch();
    } catch (err: unknown) {
      setToastMessage({ type: 'error', message: (err instanceof Error) ? err.message : 'Status update failed' });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return { bg: 'bg-yellow-100', text: 'text-yellow-800' };
      case 'contacted':
        return { bg: 'bg-blue-100', text: 'text-blue-800' };
      case 'quoted':
        return { bg: 'bg-purple-100', text: 'text-purple-800' };
      case 'confirmed':
        return { bg: 'bg-indigo-100', text: 'text-indigo-800' };
      case 'completed':
        return { bg: 'bg-green-100', text: 'text-green-800' };
      case 'cancelled':
        return { bg: 'bg-red-100', text: 'text-red-800' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-800' };
    }
  };

const tableColumns: Array<TableColumn<AdminBulkOrder>> = [
    {
      key: 'bulkOrderNumber',
      header: 'Order #',
      width: '8%', // Reduced from 15%
      column: true,
      render: (value: unknown, _order: AdminBulkOrder) => (
        <span className="font-medium text-slate-900">{value as string}</span>
      ),
    },
    {
      key: 'companyName',
      header: 'Company',
      width: '15%', // Reduced from 20%
      column: true,
      render: (value: unknown, _order: AdminBulkOrder) => (
        <span className="text-slate-900">{value as string}</span>
      ),
    },
    {
      key: 'contactPerson',
      header: 'Contact Person',
      width: '12%', // Reduced from 15%
      column: true,
      render: (value: unknown, _order: AdminBulkOrder) => (
        <span className="text-slate-700">{value as string}</span>
      ),
    },
    {
      key: 'email',
      header: 'Contact Email',
      width: '16%', // Reduced from 20%
      column: false,
      render: (value: unknown, _order: AdminBulkOrder) => (
        <span className="text-slate-700 truncate block" title={value as string}>
          {value as string}
        </span>
      ),
    },
    {
      key: 'product',
      header: 'Product',
      column: true,
      width: '18%', // Reduced from 20%
      render: (value: unknown, _order: AdminBulkOrder) => (
        <span className="text-slate-700 truncate block" title={value as string}>
          {value as string}
        </span>
      ),
    },
    {
      key: 'estimatedQuantity',
      header: 'Qty', // Shortened header
      width: '11%', // Reduced from 10%
      column: true,
      render: (value: unknown, _order: AdminBulkOrder) => (
        <span className="text-slate-900 font-medium">{value as string}</span>
      ),
    },
    {
      key: 'additionalRequirements',
      header: 'Requirements',
      width: '20%',
      column: false,
      render: (value: unknown, _order: AdminBulkOrder) => (
        <span className="text-slate-700 truncate block" title={value as string}>
          {value as string || '-'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      column: false,
      width: '10%', // Reduced from 12%
      render: (value: unknown, _order: AdminBulkOrder) => {
        const { bg, text } = getStatusColor(value as string);
        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${bg} ${text}`}>
            {(value as string).charAt(0).toUpperCase() + (value as string).slice(1)}
          </span>
        );
      },
    },
    {
      key: 'createdAt',
      header: 'Date',
      column: true,
      width: '10%', // Reduced from 20%
      render: (value: unknown, _order: AdminBulkOrder) => (
        <span className="text-slate-600 text-sm">{formatDate(value as string)}</span>
      ),
    },
  ];

  return (
    <>
      <div className="space-y-6 min-h-screen bg-slate-50 pb-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Bulk Orders Management</h1>
            <p className="text-slate-500 text-sm font-medium">Manage and track bulk order inquiries</p>
          </div>
        </div>

        <Table
          data={bulkOrders}
          columns={tableColumns}
          isLoading={isLoading}
          error={error ? (error as any).message || String(error) : null}
          emptyMessage="No bulk orders found"
          searchValue={search}
          onSearchChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          filterConfig={{
            searchPlaceholder: 'Search by order #, company, contact...',
            filters: [
              {
                key: 'status',
                label: 'Status',
                type: 'select',
                options: [
                  { label: 'Pending', value: 'pending' },
                  { label: 'Contacted', value: 'contacted' },
                  { label: 'Quoted', value: 'quoted' },
                  { label: 'Confirmed', value: 'confirmed' },
                  { label: 'Completed', value: 'completed' },
                  { label: 'Cancelled', value: 'cancelled' },
                ],
              },
            ],
          }}
          filterValues={{ status }}
          onFilterChange={(key, value) => {
            if (key === 'status') {
              setStatus(value as string);
              setPage(1);
            }
          }}
          rowActions={(order: AdminBulkOrder) => (
            <div className="flex items-center justify-end gap-2">
              {/* <Button
                variant="outline"
                size="sm"
                icon={<Eye size={14} />}
                onClick={() => {
                  // TODO: Implement view details modal or page
                  console.log('View details for:', order);
                }}
                title="View Details"
              /> */}
              <Button
                variant="outline"
                size="sm"
                icon={<Package size={14} />}
                onClick={() => handleActionClick(order)}
                title="Update Status"
              >
                Status
              </Button>
            </div>
          )}
        />
      </div>

      {/* Status Update Confirmation Modal */}
      <ConfirmDialog
        isOpen={showConfirm}
        title="Update Bulk Order Status"
        description={`Update status for order #${selectedOrder?.bulkOrderNumber} to ${statusInput}?`}
        isLoading={updateStatus.isPending}
        confirmText="Update Status"
        onConfirm={confirmAction}
        onCancel={() => {
          setShowConfirm(false);
          setSelectedOrder(null);
        }}
      >
        <div className="mt-4">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            New Status
          </label>
          <select
            value={statusInput}
            onChange={(e) => setStatusInput(e.target.value as any)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="pending">Pending</option>
            <option value="contacted">Contacted</option>
            <option value="quoted">Quoted</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </ConfirmDialog>

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

export default BulkOrdersPage;