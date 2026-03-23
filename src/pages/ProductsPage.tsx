import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Eye, Star, Trash, Package } from "@phosphor-icons/react";
import { apiMethods } from "@/api/index";
import {
  useAdminProductsList,
  useAdminDeleteProduct,
  useAdminPublishProduct,
  useAdminUnpublishProduct,
  useAdminFeatureProduct,
  useAdminUnfeatureProduct,
  useAdminCreateProduct,
  type AdminProductsListParams,
  useAdminCategoriesList,
  AdminCategory,
} from "@/api/exports";
import {
  Button,
  Table,
  type TableColumn,
  Pagination,
  ConfirmDialog,
  SearchFilter,
  Toggle,
} from "@/components";
import { ProductForm, type ProductFormValues } from "@/components/Product/ProductForm";
import type { AdminProduct } from "@/api/admin/products/types";

function ProductsPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | "draft" | "published">("all");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null,
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loadingProductId, setLoadingProductId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { mutate: createProduct, isPending: isCreatingProduct } =
    useAdminCreateProduct();

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
    if (!values.name || !values.price || !values.category) {
      console.error('Missing mandatory fields');
      return;
    }

    const payload = {
      name: values.name.trim(),
      slug: (values.slug || values.name)
        .toLowerCase()
        .replace(/\s+/g, '-')
        .trim(),
      description: values.description.trim(),
      price: Number(values.price),
      discountedPrice:
        values.discountedPrice !== undefined && values.discountedPrice !== null
          ? Number(values.discountedPrice)
          : undefined,
      gst_rate: values.gst_rate ? Number(values.gst_rate) : 18,
      status: values.status || 'ACTIVE',
      category: values.category,
      images: values.images || [],
      stock: values.stock ?? 0,
    };

    createProduct(payload, {
      onSuccess: () => {
        if (action === 'return') {
          setShowCreateModal(false);
        }
      },
      onError: (error) => {
        console.error('Submission failed:', error);
      },
    });
  };



  const params: AdminProductsListParams = {
    page,
    limit: 10,
    search: search || undefined,
    status: status === "all" ? undefined : (status as "draft" | "published"),
  };

  // Queries & Mutations
  const { data: productsData, isLoading, error } = useAdminProductsList(params);
  const { data: categories, isLoading: isCategoryLoading } =
    useAdminCategoriesList({ page: 1, limit: 20 });
  const categoriesData = (categories?.data.categories || []) as AdminCategory[];
  const { mutate: deleteProduct, isPending: isDeletingProduct } =
    useAdminDeleteProduct();
  const { mutate: publishProduct } = useAdminPublishProduct();
  const { mutate: unpublishProduct } = useAdminUnpublishProduct();
  const { mutate: featureProduct } = useAdminFeatureProduct();
  const { mutate: unfeatureProduct } = useAdminUnfeatureProduct();

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
    setLoadingProductId(product.id);
    if (product.status === "published") {
      unpublishProduct(product.id, {
        onSettled: () => setLoadingProductId(null),
      });
    } else {
      publishProduct(product.id, {
        onSettled: () => setLoadingProductId(null),
      });
    }
  };

  const handleFeatureToggle = (product: AdminProduct) => {
    if (product.isFeatured) {
      unfeatureProduct(product.id);
    } else {
      featureProduct(product.id);
    }
  };

  const columns: TableColumn<AdminProduct>[] = [
    {
      key: "name",
      header: "Product Name",
      width: "300px",
      render: (name, product: AdminProduct) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0">
            <img
              src={product.imageUrl || "/placeholder.png"}
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-slate-900 line-clamp-1">
              {name}
            </span>
            <span className="text-xs text-slate-500">
              ID: {product.id.slice(0, 8)}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "price",
      header: "Price",
      render: (price) => (
        <span className="font-medium text-slate-700">
          ₹{price?.toLocaleString()}
        </span>
      ),
    },
    {
      key: "stock",
      header: "Stock",
      align: "center",
      render: (stock) =>
        stock > 0 ? (
          <span className="font-medium text-slate-700">{stock} KG</span>
        ) : (
          <span className="text-red-500 font-bold text-[10px] uppercase bg-red-50 px-2 py-0.5 rounded-full border border-red-100">
            Out of Stock
          </span>
        ),
    },
    {
      key: "status",
      header: "Status",
      align: "center",
      render: (status, product: AdminProduct) => (
        <Toggle
          isActive={status === "published"}
          isLoading={loadingProductId === product.id}
          activeLabel="Published"
          inactiveLabel="Draft"
          size="md"
          onClick={() => handlePublishToggle(product)}
        />
      ),
    },
    {
      key: "rating",
      header: "Rating",
      align: "center",
      render: (rating) => (
        <div className="flex items-center justify-center gap-1">
          <Star size={16} weight="fill" className="text-amber-400" />
          <span className="text-sm font-bold text-slate-700">
            {rating?.toFixed(1) || "0.0"}
          </span>
        </div>
      ),
    },
  ];

  const products = productsData?.data || [];
  const total = productsData?.total || 0;
  const errorMessage = error
    ? (error as any).message || "Failed to load products"
    : null;

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Inventory Management
            </h1>
            <p className="text-slate-500 text-sm">
              Monitor stock levels and publishing status
            </p>
          </div>
          <Button
            variant="primary"
            size="md"
            icon={<Plus weight="bold" />}
            onClick={() => setShowCreateModal(true)}
          >
            Add New Product
          </Button>
        </div>

        <SearchFilter
          searchValue={search}
          onSearchChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          filterOptions={[
            { value: "draft", label: "Draft" },
            { value: "published", label: "Published" },
          ]}
          filterValue={status}
          onFilterChange={(value) => {
            setStatus(value as any);
            setPage(1);
          }}
          filterLabel="Status"
          searchPlaceholder="Search products..."
          onReset={() => {
            setSearch("");
            setStatus("all");
            setPage(1);
          }}
        />

        <Table<AdminProduct>
          data={products}
          columns={columns}
          isLoading={isLoading}
          error={errorMessage}
          emptyMessage="No products found in catalog"
          rowActions={(product) => (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                icon={<Eye size={16} />}
                onClick={() => navigate(`/products/${product.id}`)}
              />
              <Button
                variant={product.isFeatured ? "primary" : "outline"}
                size="sm"
                icon={
                  <Star
                    size={16}
                    weight={product.isFeatured ? "fill" : "regular"}
                  />
                }
                onClick={() => handleFeatureToggle(product)}
              />
              <Button
                variant="danger"
                size="sm"
                icon={<Trash size={16} />}
                onClick={() => handleDelete(product.id)}
              />
            </div>
          )}
        />

        {products.length > 0 && (
          <div className="pt-4 border-t border-slate-100">
            <Pagination
              page={page}
              limit={10}
              total={total}
              onPageChange={setPage}
            />
          </div>
        )}

        <ConfirmDialog
          isOpen={showDeleteConfirm}
          title="Confirm Deletion"
          description="Are you sure you want to delete this product? This action is permanent."
          confirmText="Delete Product"
          isDangerous
          isLoading={isDeletingProduct}
          onConfirm={confirmDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      </div>
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl max-h-screen bg-white rounded-xl shadow-xl flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="text-xl font-bold">Add New Product</h2>
            </div>
            <div className="overflow-y-auto flex-1 p-6">
              <ProductForm
                title="Add New Product"
                submitLabel={isCreatingProduct ? 'Creating...' : 'Create Product'}
                isSubmitting={isCreatingProduct}
                defaultValues={createDefaultValues}
                categories={categoriesData}
                onCancel={() => setShowCreateModal(false)}
                onSubmit={onCreateProduct}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ProductsPage;
