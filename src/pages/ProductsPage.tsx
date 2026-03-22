import React, { useState } from 'react';
import { Plus, Trash, WarningCircle, CircleNotch, Warning, MagnifyingGlass, Eye, Star } from '@phosphor-icons/react';
import {
  useAdminProductsList,
  useAdminDeleteProduct,
  useAdminPublishProduct,
  useAdminUnpublishProduct,
  useAdminFeatureProduct,
  useAdminUnfeatureProduct,
} from '@/api/exports';
import type { AdminProductsListParams } from '@/api/exports';

function ProductsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'all' | 'draft' | 'published'>('all');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const params: AdminProductsListParams = {
    page,
    limit: 10,
    search: search || undefined,
    status: status === 'all' ? undefined : (status as 'draft' | 'published'),
  };

  const { data: productsData, isLoading: loadingProducts, error: productsError } = useAdminProductsList(params);
  const { mutate: deleteProduct, isPending: isDeletingProduct } = useAdminDeleteProduct();
  const { mutate: publishProduct, isPending: isPublishingProduct } = useAdminPublishProduct();
  const { mutate: unpublishProduct, isPending: isUnpublishingProduct } = useAdminUnpublishProduct();
  const { mutate: featureProduct, isPending: isFeaturingProduct } = useAdminFeatureProduct();
  const { mutate: unfeatureProduct, isPending: isUnfeaturingProduct } = useAdminUnfeatureProduct();
  const handleDelete = (productId: string) => {
    setSelectedProductId(productId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (selectedProductId) {
      deleteProduct(selectedProductId, {
        onSuccess: () => {
          setShowDeleteConfirm(false);
          setSelectedProductId(null);
        },
      });
    }
  };

  const handlePublishToggle = (productId: string, isPublished: boolean) => {
    if (isPublished) {
      unpublishProduct(productId);
    } else {
      publishProduct(productId);
    }
  };

  const handleFeatureToggle = (productId: string, isFeatured: boolean) => {
    if (isFeatured) {
      unfeatureProduct(productId);
    } else {
      featureProduct(productId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Products Management</h1>
            <p className="text-slate-600 mt-1">Manage all products in the catalog</p>
          </div>
          <button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all">
            <Plus size={20} weight="bold" />
            Create Product
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Search</label>
              <div className="relative">
                <MagnifyingGlass className="absolute left-3 top-3 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="By product name..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value as any);
                  setPage(1);
                }}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="all">All Products</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearch('');
                  setStatus('all');
                  setPage(1);
                }}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          {loadingProducts ? (
            <div className="flex items-center justify-center h-64">
              <CircleNotch size={32} className="text-amber-600 animate-spin" />
            </div>
          ) : productsError ? (
            <div className="p-8 flex items-center gap-4 text-red-600 bg-red-50 border-t border-red-200">
              <Warning size={24} />
              <div>
                <p className="font-medium">Error loading products</p>
                <p className="text-sm">{(productsError as any).message || 'Please try again'}</p>
              </div>
            </div>
          ) : !productsData?.data || productsData.data?.length === 0 ? (
            <div className="p-8 text-center text-slate-600">
              <p>No products found</p>
            </div>
          ) : (
            <>
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Product Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Seller</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Price</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Stock</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Views</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Rating</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-slate-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {productsData?.data?.map((product) => (
                    <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{product?.name}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{product?.sellerName}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">${product?.price?.toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{product?.stock}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                            product?.status === 'published'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          <span className={`w-2 h-2 rounded-full ${product?.status === 'published' ? 'bg-green-600' : 'bg-blue-600'}`} />
                          {product?.status === 'published' ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        <div className="flex items-center gap-1">
                          <Eye size={16} className="text-slate-400" />
                          {product?.views}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        <div className="flex items-center gap-1">
                          <Star size={16} className="text-amber-500" weight="fill" />
                          {product?.rating?.toFixed(1)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() =>
                              handlePublishToggle(product?.id, product?.status === 'published')
                            }
                            disabled={isPublishingProduct || isUnpublishingProduct}
                            className={`p-2 rounded-lg transition-colors ${
                              product?.status === 'published'
                                ? 'text-green-600 hover:bg-green-50'
                                : 'text-blue-600 hover:bg-blue-50'
                            } disabled:opacity-50`}
                            title={product?.status === 'published' ? 'Unpublish' : 'Publish'}
                          >
                            {isPublishingProduct || isUnpublishingProduct ? (
                              <CircleNotch size={18} className="animate-spin" />
                            ) : (
                              <WarningCircle size={18} />
                            )}
                          </button>
                          <button
                            onClick={() =>
                              handleFeatureToggle(product?.id, product?.isFeatured)
                            }
                            disabled={isFeaturingProduct || isUnfeaturingProduct}
                            className={`p-2 rounded-lg transition-colors ${
                              product?.isFeatured
                                ? 'text-amber-600 hover:bg-amber-50'
                                : 'text-slate-400 hover:bg-slate-100'
                            } disabled:opacity-50`}
                            title={product?.isFeatured ? 'Unfeature' : 'Feature'}
                          >
                            {isFeaturingProduct || isUnfeaturingProduct ? (
                              <CircleNotch size={18} className="animate-spin" />
                            ) : (
                              <Star size={18} weight={product?.isFeatured ? 'fill' : 'regular'} />
                            )}
                          </button>
                          <button
                            onClick={() => handleDelete(product?.id)}
                            disabled={isDeletingProduct}
                            className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                            title="Delete"
                          >
                            {isDeletingProduct && selectedProductId === product?.id ? (
                              <CircleNotch size={18} className="animate-spin" />
                            ) : (
                              <Trash size={18} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              {productsData?.data && (
                <div className="px-6 py-4 flex items-center justify-between border-t border-slate-200">
                  <p className="text-sm text-slate-600">
                    Showing {(page - 1) * 10 + 1} to{' '}
                    {Math.min(page * 10, productsData?.total)} of{' '}
                    {productsData?.total} products
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setPage(page + 1)}
                      disabled={page * 10 >= (productsData?.total || 0)}
                      className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Delete Product?</h3>
            <p className="text-slate-600 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeletingProduct}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {isDeletingProduct ? (
                  <>
                    <CircleNotch className="inline animate-spin mr-2" size={16} />
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductsPage;
