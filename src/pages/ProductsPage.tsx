import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Eye, Star, Trash } from "@phosphor-icons/react";
import {
  useAdminProductsList,
  useAdminDeleteProduct,
  useAdminPublishProduct,
  useAdminUnpublishProduct,
  useAdminFeatureProduct,
  useAdminUnfeatureProduct,
  useAdminCreateProduct,
  useAdminCategoriesList,
  AdminCategory,
} from "@/api/exports";
import { Button, Table, Pagination, ConfirmDialog, Toggle } from "@/components";
import {
  ProductForm,
  type ProductFormValues,
} from "@/components/Product/ProductForm";
import type { AdminProduct } from "@/api/admin/products/types";

function ProductsPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Record<string, any>>({
    status: "all",
  });
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null,
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loadingProductId, setLoadingProductId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Queries
  const {
    data: productsData,
    isLoading,
    error,
  } = useAdminProductsList({
    page,
    limit: 10,
    search: search || undefined,
    status: filters.status === "all" ? undefined : filters.status,
  });
  const { data: categories } = useAdminCategoriesList({ page: 1, limit: 50 });
  const categoriesData = (categories?.data.categories || []) as AdminCategory[];

  // Mutations
  const { mutate: createProduct, isPending: isCreatingProduct } =
    useAdminCreateProduct();
  const { mutate: deleteProduct, isPending: isDeleting } =
    useAdminDeleteProduct();
  const { mutate: publishProduct } = useAdminPublishProduct();
  const { mutate: unpublishProduct } = useAdminUnpublishProduct();
  const { mutate: featureProduct } = useAdminFeatureProduct();
  const { mutate: unfeatureProduct } = useAdminUnfeatureProduct();

  // Handlers
  const handlePublishToggle = (product: AdminProduct) => {
    setLoadingProductId(product.id);
    const action =
      product.status === "published" ? unpublishProduct : publishProduct;
    action(product.id, { onSettled: () => setLoadingProductId(null) });
  };

  const handleFeatureToggle = (product: AdminProduct) => {
    product.isFeatured
      ? unfeatureProduct(product.id)
      : featureProduct(product.id);
  };

  const productFilterConfig = {
    searchPlaceholder: "Search products...",
    filters: [
      {
        key: "status",
        label: "Status: All",
        type: "select" as const,
        options: [
          { label: "Published", value: "published" },
          { label: "Draft", value: "draft" },
        ],
      },
    ],
  };

  const columns = [
    {
      key: "name",
      header: "Product Name",
      width: "350px",
      render: (name: string, product: AdminProduct) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-slate-100 overflow-hidden border border-slate-200">
            <img
              src={product.imageUrl || "/placeholder.png"}
              className="w-full h-full object-cover"
              alt={name}
            />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-slate-900">{name}</span>
            <span className="text-xs text-slate-400 font-mono">
              ID: {product.id.slice(0, 8)}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "price",
      header: "Price",
      render: (price: number) => (
        <span className="font-semibold text-slate-700">
          ₹{price?.toLocaleString()}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      align: "center" as const,
      render: (status: string, product: AdminProduct) => (
        <Toggle
          isActive={status === "published"}
          isLoading={loadingProductId === product.id}
          activeLabel="Published"
          inactiveLabel="Draft"
          onClick={() => handlePublishToggle(product)}
        />
      ),
    },
    {
      key: "rating",
      header: "Rating",
      align: "center" as const,
      render: (rating: number) => (
        <div className="flex items-center justify-center gap-1 font-bold text-slate-700">
          <Star size={14} weight="fill" className="text-amber-400" />{" "}
          {rating?.toFixed(1) || "0.0"}
        </div>
      ),
    },
  ];

  const createDefaultValues: ProductFormValues = {
    name: '',
    slug: '',
    description: '',
    price: 0,
    discountedPrice: null,
    gst_rate: 18,
    status: 'ACTIVE',
    category: '',
    images: [],
    stock: 0,
  };

  const onCreateProduct = (values: ProductFormValues, action: 'continue' | 'return') => {
    const payload = {
      ...values,
      name: values.name.trim(),
      slug: (values.slug || values.name).toLowerCase().replace(/\s+/g, '-').trim(),
      price: Number(values.price),
      stock: values.stock ?? 0,
    };

    createProduct(payload, {
      onSuccess: () => {
        if (action === 'return') setShowCreateModal(false);
      },
    });
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-900">Products</h1>
            <p className="text-slate-500 text-sm font-medium">
              Manage all products listed on the platform, including details, pricing, and status.
            </p>
          </div>
          <Button
            variant="primary"
            icon={<Plus weight="bold" />}
            onClick={() => setShowCreateModal(true)}
          >
            Add Product
          </Button>
        </div>

        <Table<AdminProduct>
          data={productsData?.data || []}
          columns={columns}
          isLoading={isLoading}
          error={error ? (error as any).message : null}
          filterConfig={productFilterConfig}
          searchValue={search}
          onSearchChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
          filterValues={filters}
          onFilterChange={(k, v) => {
            setFilters({ ...filters, [k]: v });
            setPage(1);
          }}
          rowActions={(product) => (
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                icon={<Eye />}
                onClick={() => navigate(`/products/${product.id}`)}
              />
              <Button
                variant={product.isFeatured ? "primary" : "outline"}
                size="sm"
                icon={<Star weight={product.isFeatured ? "fill" : "regular"} />}
                onClick={() => handleFeatureToggle(product)}
              />
              <Button
                variant="danger"
                size="sm"
                icon={<Trash />}
                onClick={() => {
                  setSelectedProductId(product.id);
                  setShowDeleteConfirm(true);
                }}
              />
            </div>
          )}
        />

        <Pagination
          page={page}
          total={productsData?.total || 0}
          limit={10}
          onPageChange={setPage}
        />
      </div>
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Product"
        description="This action is permanent."
        isLoading={isDeleting}
        onConfirm={() =>
          deleteProduct(selectedProductId!, {
            onSuccess: () => setShowDeleteConfirm(false),
          })
        }
        onCancel={() => setShowDeleteConfirm(false)}
      />

      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
               <h2 className="text-xl font-bold text-slate-900">Add New Product</h2>
            </div>
            <div className="overflow-y-auto flex-1 p-6">
              <ProductForm
                title=""
                defaultValues={createDefaultValues}
                categories={categoriesData}
                isSubmitting={isCreatingProduct}
                submitLabel={isCreatingProduct ? "Saving..." : "Create Product"}
                onSubmit={onCreateProduct}
                onCancel={() => setShowCreateModal(false)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ProductsPage;
