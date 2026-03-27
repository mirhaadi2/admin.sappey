import React, { useMemo, useState } from "react";
import { Plus, Eye, Pencil, Trash } from "@phosphor-icons/react";
import {
  useAdminUsersList,
  useAdminCreateUser,
  useAdminUpdateUser,
  useAdminDeleteUser,
  useAdminBanUser,
  useAdminUnbanUser,
} from "@/api/exports";
import type { AdminUser } from "@/api/admin/users/types";
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
  const [showUserModal, setShowUserModal] = useState<
    "create" | "edit" | "view" | null
  >(null);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
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

  const { data: usersData, isLoading, error } = useAdminUsersList(params);
  const createUser = useAdminCreateUser();
  const updateUser = useAdminUpdateUser();
  const deleteUser = useAdminDeleteUser();
  const banUser = useAdminBanUser();
  const unbanUser = useAdminUnbanUser();

  const users = usersData?.data || [];

  const openCreateModal = () => {
    setSelectedUser(null);
    setFormInitialValues({ email: "", name: "", phone: "", status: "active" });
    setShowUserModal("create");
  };

  const openEditModal = (user: AdminUser) => {
    setSelectedUser(user);
    setFormInitialValues({
      email: user.email,
      name: user.name || "",
      phone: user.phone || "",
      status: user.status as "active" | "banned",
    });
    setShowUserModal("edit");
  };

  const openViewModal = (user: AdminUser) => {
    setSelectedUser(user);
    setShowUserModal("view");
  };

  const handleDelete = (user: AdminUser) => {
    setSelectedUser(user);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!selectedUser) return;
    await deleteUser.mutateAsync(selectedUser.id);
    setShowDeleteConfirm(false);
    setSelectedUser(null);
  };

  const toggleBan = async (user: AdminUser) => {
    if (user.status === "banned") {
      await unbanUser.mutateAsync(user.id);
    } else {
      await banUser.mutateAsync(user.id);
    }
  };

  const tableColumns = [
    { key: "email", header: "Email", width: "30%" },
    { key: "name", header: "Name", width: "20%" },
    { key: "phone", header: "Phone", width: "15%" },
    {
      key: "status",
      header: "Status",
      render: (value: string) => (
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
      render: (createdAt: string) => new Date(createdAt).toLocaleDateString(),
      width: "15%",
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
          data={users}
          columns={tableColumns}
          isLoading={isLoading}
          error={error ? (error as any).message || String(error) : null}
          emptyMessage="No users found"
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
          rowActions={(user: AdminUser) => (
            <div className="flex items-center justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                icon={<Eye size={14} />}
                onClick={() => openViewModal(user)}
              />
              <Button
                variant="outline"
                size="sm"
                icon={<Pencil size={14} />}
                onClick={() => openEditModal(user)}
              />
              {/* <Button variant="secondary" size="sm" onClick={() => toggleBan(user)}>
              {user.status === 'banned' ? 'Unban' : 'Ban'}
            </Button> */}
              <Button
                variant="danger"
                size="sm"
                icon={<Trash size={14} />}
                onClick={() => handleDelete(user)}
              />
            </div>
          )}
        />

        <Pagination
          page={page}
          limit={limit}
          total={usersData?.total || 0}
          onPageChange={(next) => setPage(next)}
          onLimitChange={(nextLimit) => {
            setLimit(nextLimit);
            setPage(1);
          }}
        />
      </div>
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete User"
        description="This operation cannot be undone. Continue?"
        confirmText="Delete"
        isDangerous
        isLoading={deleteUser.isPending}
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />

      {showUserModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900">
                {showUserModal === "create" && "Create User"}
                {showUserModal === "edit" && "Edit User"}
                {showUserModal === "view" && "User Details"}
              </h2>
              <button
                onClick={() => setShowUserModal(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ×
              </button>
            </div>

            {showUserModal === "view" && selectedUser && (
              <div className="space-y-3 text-sm text-slate-700">
                <div>
                  <div className="font-semibold">Email</div>
                  <div>{selectedUser.email}</div>
                </div>
                <div>
                  <div className="font-semibold">Name</div>
                  <div>{selectedUser.name}</div>
                </div>
                <div>
                  <div className="font-semibold">Phone</div>
                  <div>{selectedUser.phone || "—"}</div>
                </div>
                <div>
                  <div className="font-semibold">Status</div>
                  <div>{selectedUser.status}</div>
                </div>
                <div>
                  <div className="font-semibold">Joined</div>
                  <div>{new Date(selectedUser.createdAt).toLocaleString()}</div>
                </div>
              </div>
            )}

            {(showUserModal === "create" || showUserModal === "edit") && (
              <UserForm
                key={
                  showUserModal === "edit"
                    ? (selectedUser?.id ?? "edit")
                    : "create"
                }
                isEdit={showUserModal === "edit"}
                isSubmitting={createUser.isPending || updateUser.isPending}
                defaultValues={formInitialValues}
                onCancel={() => setShowUserModal(null)}
                onSubmit={(values: UserFormValues) => {
                  if (showUserModal === "create") {
                    createUser
                      .mutateAsync({
                        email: values.email,
                        name: values.name,
                        phone: values.phone || undefined,
                      })
                      .then(() => {
                        setShowUserModal(null);
                        setPage(1);
                      });
                  } else if (showUserModal === "edit" && selectedUser) {
                    updateUser
                      .mutateAsync({
                        id: selectedUser.id,
                        data: {
                          name: values.name,
                          phone: values.phone || undefined,
                          status: values.status as any,
                        },
                      })
                      .then(() => {
                        setShowUserModal(null);
                        setSelectedUser(null);
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
