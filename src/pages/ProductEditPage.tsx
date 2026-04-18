import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useAdminProductDetail,
  useAdminCategoriesList,
  useAdminUpdateProduct,
} from "@/api/exports";
import {
  ProductForm,
  ProductFormValues,
} from "@/components/Product/ProductForm";
import { Button } from "@/components";
import type { AdminProductUpdateInput } from "@/api/admin/products/types";
import { ArrowLeft } from "lucide-react";

function ProductEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: productResponse,
    isLoading: productLoading,
    error,
  } = useAdminProductDetail(id!);
  const { data: categoriesResponse, isLoading: categoriesLoading } =
    useAdminCategoriesList();
  const { mutate: updateProduct, isPending: isUpdating } =
    useAdminUpdateProduct();

  const [isDirty, setIsDirty] = React.useState(false);

  // Unsaved changes protection
  React.useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!isDirty) return;
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  const product = productResponse?.data;

  const initialValues = React.useMemo<ProductFormValues>(() => {
    if (!product) {
      return {
        name: "",
        slug: "",
        description: "",
        gst_rate: 18,
        status: "ACTIVE",
        category: "",
        images: [],
        isNew: false,
        isCustomerFavourites: false,
        isBestseller: false,
        stock: 0,
        benefits: [],
        ingredients: [],
        nutritionFacts: [],
        variants: [],
      };
    }

    return {
      name: product.name,
      description: product.description ?? "",
      gst_rate: product.gst_rate ?? 18,
      status: product.status === "published" ? "ACTIVE" : "INACTIVE",
      category: product.category,
      images: Array.isArray(product.images) ? product.images : [],
      stock: product.stock ?? 0,
      isNew: Boolean(product?.isNew),
      isCustomerFavourites: Boolean(product?.isCustomerFavourites),
      isBestseller: Boolean(product?.isBestseller),
      variants: Array.isArray(product.variants) ? product.variants : [],
      benefits: Array.isArray(product.benefits) ? product.benefits : [],
      ingredients: Array.isArray(product.ingredients) ? product.ingredients : [],
    };
  }, [product]);

  const handleBack = () => {
    if (
      isDirty &&
      !window.confirm("You have unsaved changes. Discard and go back?")
    )
      return;
    navigate(-1); // Goes back to previous page in history
  };

  if (productLoading || categoriesLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500 animate-pulse">
          Loading product and category data...
        </p>
      </div>
    );
  }

  if (error || !productResponse?.data) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-slate-50">
        <div className="text-center bg-white border border-slate-200 rounded-xl p-8 shadow-sm max-w-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            Product not found
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Could not load the selected product for editing.
          </p>
          <Button
            variant="primary"
            className="mt-6 w-full"
            onClick={() => navigate("/products")}
          >
            Return to products
          </Button>
        </div>
      </div>
    );
  }

  const handleSubmit = (
    values: ProductFormValues,
    action: "continue" | "return",
  ) => {
    const payload: AdminProductUpdateInput = {
      name: values.name.trim(),
      description: values.description.trim(),
      gst_rate: values.gst_rate,
      status: values.status,
      category: values.category,
      images: values.images,
      stock: values.stock,
      isNew: values.isNew,
      isCustomerFavourites: values.isCustomerFavourites,
      isBestseller: values.isBestseller,
      variants: values.variants,
    };

    updateProduct(
      { id: id!, data: payload },
      {
        onSuccess: () => {
          setIsDirty(false);
          if (action === "return") {
            navigate(`/products/${id}`);
          }
        },
      },
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sticky Top Bar with Back Button */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4">
        <div className="mx-auto max-w-5xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              icon={<ArrowLeft size={16} />}
              onClick={handleBack}
            />
            <div>
              <h1 className="text-lg font-bold text-slate-900">Edit Product</h1>
              <p className="text-xs text-slate-500 font-mono">
                {product?.name}
              </p>
            </div>
          </div>

          {isDirty && (
            <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-bold uppercase tracking-wider">
              Unsaved Changes
            </span>
          )}
        </div>
      </div>

      <div className="py-6">
        <div className="mx-auto max-w-5xl bg-white rounded-xl border border-slate-200 p-2 shadow-sm">
          <ProductForm
            title="General Information"
            isSubmitting={isUpdating}
            defaultValues={initialValues}
            categories={categoriesResponse?.data?.categories || []}
            onCancel={handleBack}
            onSubmit={handleSubmit}
            onDirtyChange={setIsDirty}
          />
        </div>
      </div>
    </div>
  );
}

export default ProductEditPage;
