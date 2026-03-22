import { useState } from 'react';
import { Plus, Eye, Star, Trash } from '@phosphor-icons/react';
import {
  useAdminProductsList,
  useAdminDeleteProduct,
  useAdminPublishProduct,
  useAdminUnpublishProduct,
  useAdminFeatureProduct,
  useAdminUnfeatureProduct,
  type AdminProductsListParams,
} from '@/api/exports';
import {
  Button,
  Table,
  type TableColumn,
  Pagination,
  ConfirmDialog,
  StatusBadge,
  SearchFilter,
} from '@/components';
import type { AdminProduct } from '@/api/admin/products/types';

function ProductsPageRefactored() {
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

  // Queries & Mutations
  const { data: productsData, isLoading, error } = useAdminProductsList(params);
  const { mutate: deleteProduct, isPending: isDeletingProduct } = useAdminDeleteProduct();
  const { mutate: publishProduct, isPending: isPublishingProduct } = useAdminPublishProduct();
  const { mutate: unpublishProduct, isPending: isUnpublishingProduct } = useAdminUnpublishProduct();
  const { mutate: featureProduct, isPending: isFeaturingProduct } = useAdminFeatureProduct();
  const { mutate: unfeatureProduct, isPending: isUnfeaturingProduct } = useAdminUnfeatureProduct();

  // Handlers
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

  const handlePublishToggle = (product: AdminProduct) => {
    if (product.status === 'published') {
      unpublishProduct(product.id);
    } else {
      publishProduct(product.id);
    }
  };

  const handleFeatureToggle = (product: AdminProduct) => {
    if (product.isFeatured) {
      unfeatureProduct(product.id);
    } else {
      featureProduct(product.id);
    }
  };

  // Table Setup
  const columns: TableColumn<AdminProduct>[] = [
    {
      key: 'name',
      header: 'Product Name',
      width: '200px',
    },
    {
      key: 'sellerName',
      header: 'Seller',
    },
    {
      key: 'price',
      header: 'Price',
      render: (price) => `$${price.toFixed(2)}`,
    },
    {
      key: 'stock',
      header: 'Stock',
      align: 'center',
    },
    {
      key: 'status',
      header: 'Status',
      render: (status) => (
        <StatusBadge
          status={status === 'published' ? 'Published' : 'Draft'}
          color={status === 'published' ? 'success' : 'info'}
        />
      ),
    },
    {
      key: 'views',
      header: 'Views',
      align: 'center',
    },
    {
      key: 'rating',
      header: 'Rating',
      render: (rating) => `${rating.toFixed(1)} ⭐`,
      align: 'center',
    },
  ];

  const products = productsData?.data || [];
  const total = productsData?.total || 0;
  const errorMessage = error ? (error as any).message || 'Failed to load products' : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Products Management</h1>
          <p className="text-slate-600 mt-1">Manage all products in the catalog</p>
        </div>
        <Button variant="primary" size="lg" icon={<Plus size={20} />}>
          Create Product
        </Button>
      </div>

      {/* Search & Filter */}
      <SearchFilter
        searchValue={search}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        filterOptions={[
          { value: 'draft', label: 'Draft' },
          { value: 'published', label: 'Published' },
        ]}
        filterValue={status}
        onFilterChange={(value) => {
          setStatus(value as any);
          setPage(1);
        }}
        filterLabel="Status"
        searchPlaceholder="Search by product name..."
        onReset={() => {
          setSearch('');
          setStatus('all');
          setPage(1);
        }}
      />

      {/* Table */}
      <Table<AdminProduct>
        data={products}
        columns={columns}
        isLoading={isLoading}
        error={errorMessage}
        emptyMessage="No products found"
        rowActions={(product) => (
          <>
            <Button
              variant="outline"
              size="sm"
              isLoading={isPublishingProduct || isUnpublishingProduct}
              onClick={() => handlePublishToggle(product)}
              icon={product.status === 'published' ? '👁️' : '📦'}
            >
              {product.status === 'published' ? 'Unpublish' : 'Publish'}
            </Button>
            <Button
              variant={product.isFeatured ? 'primary' : 'outline'}
              size="sm"
              isLoading={isFeaturingProduct || isUnfeaturingProduct}
              onClick={() => handleFeatureToggle(product)}
              icon={<Star size={16} weight={product.isFeatured ? 'fill' : 'regular'} />}
            >
              {product.isFeatured ? 'Featured' : 'Feature'}
            </Button>
            <Button
              variant="danger"
              size="sm"
              isLoading={isDeletingProduct && selectedProductId === product.id}
              onClick={() => handleDelete(product.id)}
              icon={<Trash size={16} />}
            />
          </>
        )}
      />

      {/* Pagination */}
      {products.length > 0 && (
        <Pagination page={page} limit={10} total={total} onPageChange={setPage} />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Product"
        description="This action cannot be undone. The product will be permanently deleted."
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous
        isLoading={isDeletingProduct}
        onConfirm={confirmDelete}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setSelectedProductId(null);
        }}
      />
    </div>
  );
}

export default ProductsPageRefactored;
