import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "@phosphor-icons/react";
import {
  useAdminCreateProduct,
  useAdminCategoriesList,
  AdminCategory,
} from "@/api/exports";
import { Button } from "@/components";
import {
  ProductForm,
  type ProductFormValues,
} from "@/components/Product/ProductForm";

function ProductCreatePage() {
  const navigate = useNavigate();

  // Queries
  const { data: categories } = useAdminCategoriesList({ page: 1, limit: 50 });
  const categoriesData = (categories?.data.categories || []) as AdminCategory[];

  // Mutations
  const { mutate: createProduct, isPending: isCreatingProduct } =
    useAdminCreateProduct();

  const createDefaultValues: ProductFormValues = {
    name: '',
    slug: '',
    description: '',
    gst_rate: 18,
    status: 'ACTIVE',
    category: '',
    images: [],
    stock: 0,
    isNew: false,
    isCustomerFavourites: false,
    isBestseller: false,
    variants: [],
  };

  const onCreateProduct = (values: ProductFormValues, action: 'continue' | 'return') => {
    const payload = {
      ...values,
      name: values.name.trim(),
      slug: (values.slug || values.name).toLowerCase().replace(/\s+/g, '-').trim(),
      stock: values.stock ?? 0,
      variants: values.variants || [],
    };

    createProduct(payload, {
      onSuccess: () => {
        if (action === 'return') {
          navigate(-1);
        }
      },
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 py-2">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            {/* Back to Products */}
          </Button>
          <div>
            <h1 className="text-3xl font-black text-slate-900">Add New Product</h1>
            <p className="text-slate-600 mt-1">Create a new product in your catalog</p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-2">
          <ProductForm
            title=""
            defaultValues={createDefaultValues}
            categories={categoriesData}
            isSubmitting={isCreatingProduct}
            submitLabel={isCreatingProduct ? "Creating Product..." : "Create Product"}
            onSubmit={onCreateProduct}
            onCancel={() => navigate('/admin/products')}
          />
        </div>
      </div>
    </div>
  );
}

export default ProductCreatePage;