import { useState } from 'react';
import { Plus, Trash, Pencil } from '@phosphor-icons/react';
import {
  useAdminCategoriesList,
  useAdminCreateCategory,
  useAdminUpdateCategory,
  useAdminDeleteCategory,
} from '@/api/exports';
import type { AdminCategory } from '@/api/admin/categories/types';

function CategoriesPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', slug: '', description: '' });

  const { data, isLoading } = useAdminCategoriesList({ page: 1, limit: 20 });
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Categories</h1>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={16} weight="bold" /> Add Category
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Loading categories...</div>
        ) : categories.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No categories found.</div>
        ) : (
          <table className="w-full text-left divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600">Name</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600">Slug</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600">Status</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {categories?.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{cat.name}</td>
                  <td className="px-4 py-3">{cat.slug}</td>
                  <td className="px-4 py-3">{cat.isActive ? 'Active' : 'Inactive'}</td>
                  <td className="px-4 py-3 flex gap-2">
                    <button
                      onClick={() => handleEdit(cat)}
                      className="px-2 py-1 text-sm text-blue-600 border border-blue-100 rounded hover:bg-blue-50"
                    >
                      <Pencil size={16} /> Edit
                    </button>
                    <button
                      onClick={() => deleteCategory.mutate(cat.id)}
                      className="px-2 py-1 text-sm text-red-600 border border-red-100 rounded hover:bg-red-50"
                    >
                      <Trash size={16} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-xl p-6">
            <h2 className="text-xl font-bold mb-4">{editingCategoryId ? 'Edit Category' : 'Add Category'}</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({...form, name: e.target.value})}
                  required
                  className="mt-1 w-full border border-gray-300 rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Slug</label>
                <input
                  value={form.slug}
                  onChange={(e) => setForm({...form, slug: e.target.value})}
                  className="mt-1 w-full border border-gray-300 rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({...form, description: e.target.value})}
                  className="mt-1 w-full border border-gray-300 rounded-lg p-2"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CategoriesPage;
