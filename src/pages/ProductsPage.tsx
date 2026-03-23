import React, { useState, useEffect } from "react";
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
import { FormField } from "@/components/Form/FormField";
import { useForm, FormProvider } from "react-hook-form";
import type { AdminProduct } from "@/api/admin/products/types";

function ProductsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | "draft" | "published">("all");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null,
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loadingProductId, setLoadingProductId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [imageKeys, setImageKeys] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  type CreateProductFormValues = {
    name: string;
    slug?: string;
    description: string;
    price: number;
    discountedPrice?: number;
    gst_rate?: number;
    status?: "ACTIVE" | "INACTIVE";
    category: string;
    images: string;
    sellerId: string;
  };

  const formMethods = useForm<CreateProductFormValues>({
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      price: 0,
      discountedPrice: undefined,
      gst_rate: 18,
      status: "ACTIVE",
      category: "",
      images: "",
      sellerId: "",
    },
  });

  const { handleSubmit, reset } = formMethods;

  const { mutate: createProduct, isPending: isCreatingProduct } =
    useAdminCreateProduct();

  const onCreateProduct = (values: CreateProductFormValues) => {
    // 1. Validate mandatory fields manually if not using a Zod schema
    if (!values.name || !values.price || !values.category) {
      console.error("Missing mandatory fields");
      return;
    }

    const payload = {
      name: values.name.trim(),
      // Fallback for slug if empty
      slug: (values.slug || values.name)
        .toLowerCase()
        .replace(/\s+/g, "-")
        .trim(),
      description: values.description.trim(),

      // 2. Ensure Numeric Types (Selects often return strings)
      price: Number(values.price),
      discountedPrice: values.discountedPrice
        ? Number(values.discountedPrice)
        : null,
      gst_rate: values.gst_rate ? Number(values.gst_rate) : 18,

      // 3. Status and Category
      status: values.status || "ACTIVE",
      category: values.category, // This is the ID from your categoriesData select

      // 4. Clean up images array
      images: values.images
        ? values.images
            .split(",")
            .map((i) => i.trim())
            .filter(Boolean)
        : [],

      // // 5. Only include sellerId if it's not an empty string
      // ...(values.sellerId?.trim() && { sellerId: values.sellerId.trim() }),
    };

    createProduct(payload, {
      onSuccess: () => {
        setShowCreateModal(false);
        reset(); // Resets RHF state
        setImageKeys([]); // Resets your local upload state
      },
      onError: (error) => {
        console.error("Submission failed:", error);
        // You can add a toast notification here
      },
    });
  };

  const handleUploadImages = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploadingImages(true);

    try {
      const uploaded: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "products");

        const response = await apiMethods.upload<{ url: string; key: string }>(
          "/uploads",
          formData,
        );
        const key = response.data?.key || response.data?.url;
        if (key) uploaded.push(key);
      }

      setImageKeys((prev) => [...prev, ...uploaded]);
      formMethods.setValue("images", [...imageKeys, ...uploaded].join(","));
    } catch (error) {
      console.error("Image upload failed", error);
    } finally {
      setUploadingImages(false);
    }
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
      <div className="p-6 space-y-6">
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
                onClick={() => console.log("View", product.id)}
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
          <div className="w-full max-w-2xl max-h-screen bg-white rounded-xl shadow-xl flex flex-col relative">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 flex-shrink-0">
              <h2 className="text-xl font-bold">Add New Product</h2>
              <button
                className="text-slate-400 hover:text-slate-600"
                onClick={() => setShowCreateModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="overflow-y-auto flex-1 px-6 py-4">
              <FormProvider {...formMethods}>
                <form
                  onSubmit={handleSubmit(onCreateProduct)}
                  className="grid grid-cols-2 gap-4"
                >
                  {/* Full Width Fields */}
                  <FormField
                    name="name"
                    label="Product Name"
                    className="col-span-2"
                    required
                  />

                  <FormField
                    name="slug"
                    label="Slug"
                    className="col-span-2"
                    placeholder="e.g. apple-iphone-15"
                    helperText="Generated from name if left blank"
                  />

                  <FormField
                    name="description"
                    label="Description"
                    type="textarea"
                    className="col-span-2"
                    required
                  />

                  {/* 50% / 50% Split for Price and Discount */}
                  <FormField
                    name="price"
                    label="Base Price (Excl. GST)"
                    type="number"
                    className="col-span-1"
                    required
                  />

                  <FormField
                    name="discountedPrice"
                    label="Discounted Price"
                    type="number"
                    className="col-span-1"
                  />

                  {/* FIXED: GST Rate as a Select Dropdown */}
                  <FormField
                    name="gst_rate"
                    label="GST Rate (%)"
                    type="select"
                    className="col-span-1"
                    required
                    options={[
                      { value: "0", label: "0% (Exempted)" },
                      { value: "5", label: "5% (Essentials)" },
                      { value: "12", label: "12% (Standard)" },
                      { value: "18", label: "18% (Standard High)" },
                      { value: "28", label: "28% (Luxury/Sin)" },
                    ]}
                  />

                  <FormField
                    name="status"
                    label="Listing Status"
                    type="select"
                    className="col-span-1"
                    options={[
                      { value: "ACTIVE", label: "Active" },
                      { value: "INACTIVE", label: "Inactive" },
                    ]}
                  />

                  {/* Category Select Dropdown */}
                  <FormField
                    name="category"
                    label="Product Category"
                    type="select"
                    className="col-span-2"
                    required
                    options={categoriesData.map((cat) => ({
                      value: cat.id,
                      label: cat.name,
                    }))}
                    disabled={isCategoryLoading}
                    helperText={
                      isCategoryLoading
                        ? "Loading categories..."
                        : "Select a category for this product"
                    }
                  />

                  {/* Image Upload Section */}
                  <div className="grid gap-2 col-span-2">
                    <label className="text-sm font-medium text-slate-700">
                      Product Media
                    </label>
                    <input
                      type="file"
                      multiple
                      onChange={handleUploadImages}
                      disabled={uploadingImages}
                      className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      accept="image/*"
                    />
                    {uploadingImages && (
                      <p className="text-xs text-blue-600 animate-pulse font-medium">
                        Uploading to R2 storage...
                      </p>
                    )}
                  </div>

                  <FormField
                    name="images"
                    label="Image Keys"
                    className="col-span-2"
                    disabled
                    helperText="Populated automatically after upload"
                  />

                  {/* <FormField
                    name="sellerId"
                    label="Seller Reference"
                    className="col-span-2"
                    placeholder="Enter Seller UUID"
                  /> */}

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 pt-6 col-span-2 justify-end border-t border-slate-100">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowCreateModal(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={isCreatingProduct}
                    >
                      {isCreatingProduct ? "Creating..." : "Create Product"}
                    </Button>
                  </div>
                </form>
              </FormProvider>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ProductsPage;
