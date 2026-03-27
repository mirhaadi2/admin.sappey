import { useState } from 'react';
import { Plus, Trash, Pencil } from '@phosphor-icons/react';
import {
  useAdminCategoriesList,
  useAdminCreateCategory,
  useAdminUpdateCategory,
  useAdminDeleteCategory,
} from '@/api/exports';
import { Button, Table, ConfirmDialog } from '@/components';
import type { AdminCategory } from '@/api/admin/categories/types';

const CategoriesPage = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', slug: '', description: '' });
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { data, isLoading } = useAdminCategoriesList({ page: 1, limit: 50 });
  const createCategory = useAdminCreateCategory();
  const updateCategory = useAdminUpdateCategory();
  const deleteCategory = useAdminDeleteCategory();

  const categories = (data?.data.categories || []) as AdminCategory[];

  const openCreateModal = () => {
    setEditingCategoryId(null);
    setForm({ name: '', slug: '', description: '' });
    setShowCreateModal(true);
  };

  const handleEdit = (category: any) => {
    setEditingCategoryId(category.id);
    setForm({ name: category.name || '', slug: category.slug || '', description: category.description || '' });
    setShowCreateModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      slug: form.slug || undefined,
      description: form.description || undefined,
    };

    if (editingCategoryId) {
      await updateCategory.mutateAsync({ id: editingCategoryId, data: payload });
    } else {
      await createCategory.mutateAsync(payload);
    }

    setShowCreateModal(false);
  };

  const handleDeleteConfirm = () => {
    if (selectedCategoryId) {
      deleteCategory.mutate(selectedCategoryId, {
        onSuccess: () => setShowDeleteConfirm(false),
      });
    }
  };

  const columns = [
    {
      key: 'name',
      header: 'Category Name',
      width: '300px',
      render: (name: string) => (
        <span className="font-semibold text-slate-900">{name}</span>
      ),
    },
    {
      key: 'slug',
      header: 'Slug',
      render: (slug: string) => (
        <span className="text-slate-600 font-mono text-sm">{slug}</span>
      ),
    },
    {
      key: 'description',
      header: 'Description',
      render: (description: string) => (
        <span className="text-slate-500 text-sm">{description || '-'}</span>
      ),
    },
    {
      key: 'isActive',
      header: 'Status',
      align: 'center' as const,
      render: (isActive: boolean) => (
        <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold ${
          isActive
            ? 'bg-emerald-100 text-emerald-700'
            : 'bg-slate-100 text-slate-700'
        }`}>
          {isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
  ];

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-900">Categories</h1>
            <p className="text-slate-500 text-sm font-medium">
              Manage all product categories on the platform.
            </p>
          </div>
          <Button
            variant="primary"
            icon={<Plus weight="bold" />}
            onClick={openCreateModal}
          >
            Add Category
          </Button>
        </div>

        <Table<AdminCategory>
          data={categories}
          columns={columns}
          isLoading={isLoading}
          rowActions={(category) => (
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                icon={<Pencil />}
                onClick={() => handleEdit(category)}
              >
                Edit
              </Button>
              <Button
                variant="danger"
                size="sm"
                icon={<Trash />}
                onClick={() => {
                  setSelectedCategoryId(category.id);
                  setShowDeleteConfirm(true);
                }}
              />
            </div>
          )}
        />
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-xl p-6 border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-4">{editingCategoryId ? 'Edit Category' : 'Add Category'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Category Name *</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({...form, name: e.target.value})}
                  required
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  placeholder="e.g., Electronics"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Slug</label>
                <input
                  value={form.slug}
                  onChange={(e) => setForm({...form, slug: e.target.value})}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  placeholder="e.g., electronics"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({...form, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
                  placeholder="Enter category description..."
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                  type="button"
                >
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  {editingCategoryId ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Category"
        description="Are you sure you want to delete this category? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={deleteCategory.isPending}
        isDangerous
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </>
  );
}

export default CategoriesPage;