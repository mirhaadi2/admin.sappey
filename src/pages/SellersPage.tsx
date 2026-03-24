import React, { useMemo, useState } from 'react';
import { Plus, Eye, Pencil, Trash, CheckCircle, XCircle } from '@phosphor-icons/react';
import {
  useAdminSellersList,
  useAdminCreateSeller,
  useAdminUpdateSeller,
  useAdminDeleteSeller,
  useAdminApproveSeller,
  useAdminRejectSeller,
  useAdminSuspendSeller,
  useAdminRestoreSeller,
} from '@/api/exports';
import type { AdminSeller } from '@/api/admin/sellers/types';
import { Button, Table, Pagination, ConfirmDialog, SellerForm, type SellerFormValues } from '@/components';

function SellersPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'all' | 'active' | 'suspended'>('all');
  const [verificationStatus, setVerificationStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [showSellerModal, setShowSellerModal] = useState<'create' | 'edit' | 'view' | null>(null);
  const [selectedSeller, setSelectedSeller] = useState<AdminSeller | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const params = useMemo(
    () => ({
      page,
      limit,
      search: search || undefined,
      status: status === 'all' ? undefined : status,
      verificationStatus: verificationStatus === 'all' ? undefined : verificationStatus,
    }),
    [page, limit, search, status, verificationStatus],
  );

  const { data: sellersData, isLoading, error } = useAdminSellersList(params);
  const createSeller = useAdminCreateSeller();
  const updateSeller = useAdminUpdateSeller();
  const deleteSeller = useAdminDeleteSeller();
  const approveSeller = useAdminApproveSeller();
  const rejectSeller = useAdminRejectSeller();
  const suspendSeller = useAdminSuspendSeller();
  const restoreSeller = useAdminRestoreSeller();

  const sellers = sellersData?.data || [];

  const openCreateModal = () => {
    setShowSellerModal('create');
  };

  const openEditModal = (seller: AdminSeller) => {
    setSelectedSeller(seller);
    setShowSellerModal('edit');
  };

  const openViewModal = (seller: AdminSeller) => {
    setSelectedSeller(seller);
    setShowSellerModal('view');
  };

  const handleDelete = (seller: AdminSeller) => {
    setSelectedSeller(seller);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!selectedSeller) return;
    await deleteSeller.mutateAsync(selectedSeller.id);
    setShowDeleteConfirm(false);
    setSelectedSeller(null);
  };

  const localeStatus = (value: string) => {
    const normalized = (value || '').toString().toLowerCase();
    return normalized === 'active' ? 'Active' : normalized === 'suspended' ? 'Suspended' : normalized;
  };

  const columns = [
    { key: 'businessName', header: 'Business', width: '25%' },
    { key: 'name', header: 'Seller Name', width: '15%' },
    { key: 'email', header: 'Email', width: '20%' },
    { key: 'phone', header: 'Phone', width: '10%' },
    {
      key: 'status',
      header: 'Status',
      render: (value: string) => {
        const normalized = value?.toLowerCase() || 'pending';
        const color = normalized === 'pending' ? 'bg-yellow-100 text-amber-800' : normalized === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800';
        return <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${color}`}>{normalized.charAt(0).toUpperCase() + normalized.slice(1)}</span>;
      },
    },
    {
      key: 'createdAt',
      header: 'Joined',
      render: (value: string) => new Date(value).toLocaleDateString(),
      width: '12%',
    },
  ];

  return (
    <div className="space-y-6 min-h-screen bg-slate-50">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Seller Management</h1>
          <p className="text-slate-500 text-sm font-medium">Search, filter, and manage your sellers with approvals and controls.</p>
        </div>

        <Button variant="primary" icon={<Plus size={16} />} onClick={openCreateModal}>
          Add Seller
        </Button>
      </div>

      <Table
        data={sellers}
        columns={columns}
        isLoading={isLoading}
        error={error ? ((error as any).message || String(error)) : null}
        emptyMessage="No sellers found"
        searchValue={search}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        filterConfig={{
          searchPlaceholder: 'Search sellers...',
          filters: [
            { key: 'status', label: 'Status: All', type: 'select', options: [{ label: 'Active', value: 'active' }, { label: 'Suspended', value: 'suspended' }] },
            { key: 'verificationStatus', label: 'Verification: All', type: 'select', options: [{ label: 'Pending', value: 'pending' }, { label: 'Approved', value: 'approved' }, { label: 'Rejected', value: 'rejected' }] },
          ],
        }}
        filterValues={{ status, verificationStatus }}
        onFilterChange={(key, value) => {
          if (key === 'status') {
            setStatus(value as 'all' | 'active' | 'suspended');
          }
          if (key === 'verificationStatus') {
            setVerificationStatus(value as 'all' | 'pending' | 'approved' | 'rejected');
          }
          setPage(1);
        }}
        rowActions={(seller: AdminSeller) => (
          <div className="flex items-center justify-end gap-2">
            <Button variant="outline" size="sm" icon={<Eye size={14} />} onClick={() => openViewModal(seller)} />
            <Button variant="outline" size="sm" icon={<Pencil size={14} />} onClick={() => openEditModal(seller)} />
            {seller.verificationStatus === 'pending' && (
              <>
                <Button variant="success" size="sm" icon={<CheckCircle size={14} />} onClick={() => approveSeller.mutateAsync({ id: seller.id })}>
                  Approve
                </Button>
                <Button variant="danger" size="sm" icon={<XCircle size={14} />} onClick={() => rejectSeller.mutateAsync({ id: seller.id, data: { reason: 'Not meeting requirements' } })}>
                  Reject
                </Button>
              </>
            )}
            {seller.status === 'suspended' ? (
              <Button variant="secondary" size="sm" onClick={() => restoreSeller.mutateAsync(seller.id)}>
                Restore
              </Button>
            ) : (
              <Button variant="secondary" size="sm" onClick={() => suspendSeller.mutateAsync({ id: seller.id })}>
                Suspend
              </Button>
            )}
            <Button variant="danger" size="sm" icon={<Trash size={14} />} onClick={() => handleDelete(seller)} />
          </div>
        )}
      />

      <Pagination
        page={page}
        limit={limit}
        total={sellersData?.total || 0}
        onPageChange={(next) => setPage(next)}
        onLimitChange={(nextLimit) => {
          setLimit(nextLimit);
          setPage(1);
        }}
      />

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Seller"
        description="This operation cannot be undone. Continue?"
        confirmText="Delete"
        isDangerous
        isLoading={deleteSeller.isPending}
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />

      {showSellerModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900">
                {showSellerModal === 'create' && 'Create Seller'}
                {showSellerModal === 'edit' && 'Edit Seller'}
                {showSellerModal === 'view' && 'Seller Details'}
              </h2>
              <button onClick={() => setShowSellerModal(null)} className="text-slate-400 hover:text-slate-600">
                ×
              </button>
            </div>

            {showSellerModal === 'view' && selectedSeller && (
              <div className="space-y-3 text-sm text-slate-700">
                <div><div className="font-semibold">Business Name</div><div>{selectedSeller.businessName}</div></div>
                <div><div className="font-semibold">Email</div><div>{selectedSeller.email}</div></div>
                <div><div className="font-semibold">Owner</div><div>{selectedSeller.name}</div></div>
                <div><div className="font-semibold">Phone</div><div>{selectedSeller.phone || '—'}</div></div>
                <div><div className="font-semibold">Status</div><div>{localeStatus(selectedSeller.status)}</div></div>
                <div><div className="font-semibold">Verification</div><div>{selectedSeller.verificationStatus}</div></div>
                <div><div className="font-semibold">Joined</div><div>{new Date(selectedSeller.createdAt).toLocaleString()}</div></div>
              </div>
            )}

            {(showSellerModal === 'create' || showSellerModal === 'edit') && (
              <SellerForm
                isEdit={showSellerModal === 'edit'}
                isSubmitting={createSeller.isPending || updateSeller.isPending}
                defaultValues={selectedSeller ? {
                  email: selectedSeller.email,
                  name: selectedSeller.name,
                  businessName: selectedSeller.businessName,
                  phone: selectedSeller.phone || '',
                  address: selectedSeller.address || '',
                  city: selectedSeller.city || '',
                  state: selectedSeller.state || '',
                  zipCode: selectedSeller.zipCode || '',
                } : undefined}
                onCancel={() => setShowSellerModal(null)}
                onSubmit={(values: SellerFormValues) => {
                  if (showSellerModal === 'create') {
                    createSeller.mutateAsync({
                      email: values.email,
                      name: values.name,
                      businessName: values.businessName,
                      businessLicense: values.businessLicense,
                      phone: values.phone || undefined,
                    }).then(() => {
                      setShowSellerModal(null);
                      setPage(1);
                    });
                  } else if (showSellerModal === 'edit' && selectedSeller) {
                    updateSeller.mutateAsync({
                      id: selectedSeller.id,
                      data: {
                        name: values.name,
                        businessName: values.businessName,
                        phone: values.phone || undefined,
                        address: values.address || undefined,
                        city: values.city || undefined,
                        state: values.state || undefined,
                        zipCode: values.zipCode || undefined,
                      },
                    }).then(() => {
                      setShowSellerModal(null);
                      setSelectedSeller(null);
                    });
                  }
                }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default SellersPage;
