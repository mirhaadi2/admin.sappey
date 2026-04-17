import React, { useMemo, useState } from "react";
import { Plus, Eye, Pencil, Trash } from "@phosphor-icons/react";
import {
  useAdminCustomersList,
  useAdminCreateCustomer,
  useAdminUpdateCustomer,
  useAdminDeleteCustomer,
  useAdminBanCustomer,
  useAdminUnbanCustomer,
} from "@/api/exports";
import type { AdminCustomer } from "@/api/admin/customers/types";
import {
  Button,
  Table,
  Pagination,
  ConfirmDialog,
  UserForm,
  type UserFormValues,
} from "@/components";

function CustomersPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "banned">("all");
  const [showCustomerModal, setShowCustomerModal] = useState<
    "create" | "edit" | "view" | null
  >(null);
  const [selectedCustomer, setSelectedCustomer] = useState<AdminCustomer | null>(null);
  const [formInitialValues, setFormInitialValues] = useState<
    Partial<UserFormValues>
  >({
    email: "",
    name: "",
    phone: "",
    status: "active",
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const params = useMemo(
    () => ({
      page,
      limit,
      search: search || undefined,
      status: status === "all" ? undefined : status,
    }),
    [page, limit, search, status],
  );

  const { data: customersData, isLoading, error } = useAdminCustomersList(params);
  const createCustomer = useAdminCreateCustomer();
  const updateCustomer = useAdminUpdateCustomer();
  const deleteCustomer = useAdminDeleteCustomer();
  const banCustomer = useAdminBanCustomer();
  const unbanCustomer = useAdminUnbanCustomer();

  const customers = customersData?.data || [];

  const openCreateModal = () => {
    setSelectedCustomer(null);
    setFormInitialValues({ email: "", name: "", phone: "", status: "active" });
    setShowCustomerModal("create");
  };

  const openEditModal = (customer: AdminCustomer) => {
    setSelectedCustomer(customer);
    setFormInitialValues({
      email: customer.email,
      name: customer.name || "",
      phone: customer.phone || "",
      status: customer.status as "active" | "banned",
    });
    setShowCustomerModal("edit");
  };

  const openViewModal = (customer: AdminCustomer) => {
    setSelectedCustomer(customer);
    setShowCustomerModal("view");
  };

  const handleDelete = (customer: AdminCustomer) => {
    setSelectedCustomer(customer);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!selectedCustomer) return;
    await deleteCustomer.mutateAsync(selectedCustomer.id);
    setShowDeleteConfirm(false);
    setSelectedCustomer(null);
  };

  const toggleBan = async (customer: AdminCustomer) => {
    if (customer.status === "banned") {
      await unbanCustomer.mutateAsync(customer.id);
    } else {
      await banCustomer.mutateAsync(customer.id);
    }
  };

  const tableColumns = [
    { key: "email", header: "Email", width: "30%", column: true },
    { key: "name", header: "Name", width: "20%", column: true },
    { key: "phone", header: "Phone", width: "15%", column: true },
    {
      key: "status",
      header: "Status",
      render: (value: string, _row: any) => (
        <span
          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
            value === "active"
              ? "bg-emerald-100 text-emerald-800"
              : "bg-rose-100 text-rose-800"
          }`}
        >
          {value === "active" ? "Active" : "Banned"}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Joined",
      render: (createdAt: string, _row: any) => new Date(createdAt).toLocaleDateString(),
      width: "15%",
      column: false
    },
  ];

  return (
    <>
      <div className="space-y-6 min-h-screen bg-slate-50">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Customers Management
            </h1>
            <p className="text-slate-500 text-sm font-medium">
              Search, view, edit, and manage customers with full control.
            </p>
          </div>

          <Button
            variant="primary"
            icon={<Plus size={16} />}
            onClick={openCreateModal}
          >
            Create Customer
          </Button>
        </div>

        <Table
          data={customers}
          columns={tableColumns}
          isLoading={isLoading}
          error={error ? (error as any).message || String(error) : null}
          emptyMessage="No customers found"
          searchValue={search}
          onSearchChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          filterConfig={{
            searchPlaceholder: "Search customers...",
            filters: [
              {
                key: "status",
                label: "Status: All",
                type: "select",
                options: [
                  { label: "Active", value: "active" },
                  { label: "Banned", value: "banned" },
                ],
              },
            ],
          }}
          filterValues={{ status }}
          onFilterChange={(key, value) => {
            if (key === "status") {
              setStatus(value as "all" | "active" | "banned");
              setPage(1);
            }
          }}
          rowActions={(customer: AdminCustomer) => (
            <div className="flex items-center justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                icon={<Eye size={14} />}
                onClick={() => openViewModal(customer)}
              />
              <Button
                variant="outline"
                size="sm"
                icon={<Pencil size={14} />}
                onClick={() => openEditModal(customer)}
              />
              {/* <Button variant="secondary" size="sm" onClick={() => toggleBan(customer)}>
              {customer.status === 'banned' ? 'Unban' : 'Ban'}
            </Button> */}
              <Button
                variant="danger"
                size="sm"
                icon={<Trash size={14} />}
                onClick={() => handleDelete(customer)}
              />
            </div>
          )}
        />

        <Pagination
          page={page}
          limit={limit}
          total={customersData?.total || 0}
          onPageChange={(next) => setPage(next)}
          onLimitChange={(nextLimit) => {
            setLimit(nextLimit);
            setPage(1);
          }}
        />
      </div>
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Customer"
        description="This operation cannot be undone. Continue?"
        confirmText="Delete"
        isDangerous
        isLoading={deleteCustomer.isPending}
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />

      {showCustomerModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.08)] p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900">
                {showCustomerModal === "create" && "Create Customer"}
                {showCustomerModal === "edit" && "Edit Customer"}
                {showCustomerModal === "view" && "Customer Details"}
              </h2>
              <button
                onClick={() => setShowCustomerModal(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ×
              </button>
            </div>

            {showCustomerModal === "view" && selectedCustomer && (
              <div className="space-y-3 text-sm text-slate-700">
                <div>
                  <div className="font-semibold">Email</div>
                  <div>{selectedCustomer.email}</div>
                </div>
                <div>
                  <div className="font-semibold">Name</div>
                  <div>{selectedCustomer.name}</div>
                </div>
                <div>
                  <div className="font-semibold">Phone</div>
                  <div>{selectedCustomer.phone || "—"}</div>
                </div>
                <div>
                  <div className="font-semibold">Status</div>
                  <div>{selectedCustomer.status}</div>
                </div>
                <div>
                  <div className="font-semibold">Joined</div>
                  <div>{new Date(selectedCustomer.createdAt).toLocaleString()}</div>
                </div>
              </div>
            )}

            {(showCustomerModal === "create" || showCustomerModal === "edit") && (
              <UserForm
                key={
                  showCustomerModal === "edit"
                    ? (selectedCustomer?.id ?? "edit")
                    : "create"
                }
                isEdit={showCustomerModal === "edit"}
                isSubmitting={createCustomer.isPending || updateCustomer.isPending}
                defaultValues={formInitialValues}
                onCancel={() => setShowCustomerModal(null)}
                onSubmit={(values: UserFormValues) => {
                  if (showCustomerModal === "create") {
                    createCustomer
                      .mutateAsync({
                        email: values.email,
                        name: values.name,
                        phone: values.phone || undefined,
                      })
                      .then(() => {
                        setShowCustomerModal(null);
                        setPage(1);
                      });
                  } else if (showCustomerModal === "edit" && selectedCustomer) {
                    updateCustomer
                      .mutateAsync({
                        id: selectedCustomer.id,
                        data: {
                          name: values.name,
                          phone: values.phone || undefined,
                          status: values.status as any,
                        },
                      })
                      .then(() => {
                        setShowCustomerModal(null);
                        setSelectedCustomer(null);
                      });
                  }
                }}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default CustomersPage;
