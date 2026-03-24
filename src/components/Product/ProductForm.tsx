import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { apiMethods } from "@/api/index";
import { FormField } from "@/components/Form/FormField";
import { Button } from "@/components";
import type { AdminCategory } from "@/api/admin/categories/types";

export type ProductFormValues = {
  name: string;
  slug?: string;
  description: string;
  price: number;
  discountedPrice?: number | null;
  gst_rate?: number;
  status?: "ACTIVE" | "INACTIVE";
  category: string;
  images: string[];
  stock?: number;
};

interface ProductFormProps {
  title?: string;
  submitLabel?: string;
  isSubmitting?: boolean;
  defaultValues?: Partial<ProductFormValues>;
  categories?: AdminCategory[];
  onCancel: () => void;
  onSubmit: (values: ProductFormValues, action: "continue" | "return") => void;
  onDirtyChange?: (dirty: boolean) => void;
}

export function ProductForm({
  title = "Product Details",
  submitLabel = "Save Product",
  isSubmitting = false,
  defaultValues = {},
  categories = [],
  onCancel,
  onSubmit,
  onDirtyChange,
}: ProductFormProps) {
  const formMethods = useForm<ProductFormValues>({
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      price: 0,
      discountedPrice: null,
      gst_rate: 18,
      status: "ACTIVE",
      category: "",
      images: [],
      stock: 0,
      ...defaultValues,
    },
  });

  const { handleSubmit, reset, setValue, watch, formState } = formMethods;

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [submitAction, setSubmitAction] = useState<"continue" | "return">(
    "continue",
  );

  useEffect(() => {
    onDirtyChange?.(formState.isDirty ?? false);
  }, [formState.isDirty, onDirtyChange]);

  useEffect(() => {
    // Prevent resetting while user is actively editing (dirty state),
    // which can happen if parent passes a new defaultValues object every render.
    if (formState.isDirty) return;

    const merged = {
      name: "",
      slug: "",
      description: "",
      price: 0,
      discountedPrice: null,
      gst_rate: 18,
      status: "ACTIVE",
      category: "",
      images: [],
      stock: 0,
      ...defaultValues,
    } as ProductFormValues;

    merged.images = defaultValues.images ?? [];

    reset(merged);
  }, [defaultValues, reset, formState.isDirty]);

  const currentImages = watch("images");

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadError(null);

    try {
      const existingImages = watch("images") || [];
      const uploadedKeys: string[] = [];

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
        if (key) {
          uploadedKeys.push(key);
        }
      }

      setValue("images", [...existingImages, ...uploadedKeys], {
        shouldValidate: true,
      });
    } catch (error) {
      setUploadError("Image upload failed, please try again.");
      console.error("ProductForm upload error", error);
    } finally {
      setUploading(false);
      if (event.target) event.target.value = "";
    }
  };

  return (
    <div className="space-y-4">
      {title && (
        <div className="flex justify-between items-center border-b border-slate-200 pb-3">
          <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
        </div>
      )}

      <FormProvider {...formMethods}>
        <form
          onSubmit={handleSubmit((values) => {
            const normalized: ProductFormValues = {
              ...values,
              discountedPrice:
                values.discountedPrice !== undefined &&
                values.discountedPrice !== null
                  ? Number(values.discountedPrice)
                  : undefined,
              gst_rate: values.gst_rate ?? 18,
              images: values.images || [],
            };
            onSubmit(normalized, submitAction);
          })}
          className="grid grid-cols-2 gap-4"
        >
          <FormField
            name="name"
            label="Product Name"
            required
            className="col-span-2"
          />
          <FormField
            name="slug"
            label="Slug"
            className="col-span-2"
            helperText="Helpful for clean URLs"
          />
          <FormField
            name="description"
            label="Description"
            type="textarea"
            className="col-span-2"
            required
          />
          <FormField name="price" label="Base Price" type="number" required />
          <FormField
            name="discountedPrice"
            label="Discounted Price"
            type="number"
          />
          <FormField
            name="gst_rate"
            label="GST Rate %"
            type="select"
            required
            options={[
              { value: "0", label: "0%" },
              { value: "5", label: "5%" },
              { value: "12", label: "12%" },
              { value: "18", label: "18%" },
              { value: "28", label: "28%" },
            ]}
          />
          <FormField
            name="status"
            label="Status"
            type="select"
            required
            options={[
              { value: "ACTIVE", label: "Active" },
              { value: "INACTIVE", label: "Inactive" },
            ]}
          />
          <FormField
            name="category"
            label="Category"
            type="select"
            required
            options={categories.map((cat) => ({
              value: cat.id,
              label: cat.name,
            }))}
          />
          <FormField name="stock" label="Stock (kg)" type="number" />

          <div className="col-span-2 space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Product Images
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleUpload}
              disabled={uploading}
              className="block w-full text-slate-600 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {uploading && (
              <p className="text-xs text-blue-600">Uploading images...</p>
            )}
            {uploadError && (
              <p className="text-xs text-red-500">{uploadError}</p>
            )}
            <div className="grid grid-cols-3 gap-2 mt-2">
              {currentImages && currentImages.length > 0 ? (
                currentImages.map((url, index) => (
                  <div
                    key={index}
                    className="aspect-square rounded-md overflow-hidden border border-slate-200 bg-slate-50 relative"
                  >
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.currentTarget;
                        // Only swap if we aren't already showing the placeholder
                        // This stops the infinite loop even if placeholder.png is missing
                        if (!target.src.includes("placeholder.png")) {
                          target.src = "/placeholder.png";
                        }
                      }}
                    />
                    {/* Optional: Add a remove button here since we're fixing the UI */}
                    <button
                      type="button"
                      onClick={() => {
                        const newImages = currentImages.filter(
                          (_, i) => i !== index,
                        );
                        setValue("images", newImages, { shouldDirty: true });
                      }}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))
              ) : (
                <div className="col-span-3 py-8 border-2 border-dashed border-slate-200 rounded-md flex flex-col items-center justify-center">
                  <p className="text-sm text-slate-400 font-medium">
                    No images uploaded yet
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="col-span-2 flex justify-between gap-3 pt-4 border-t border-slate-200">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setSubmitAction("continue");
                  handleSubmit((values) => onSubmit(values, "continue"))();
                }}
                disabled={isSubmitting}
              >
                Save & Continue
              </Button>

              <Button
                type="button"
                variant="primary"
                onClick={() => {
                  setSubmitAction("return");
                  handleSubmit((values) => onSubmit(values, "return"))();
                }}
                disabled={isSubmitting}
              >
                Save & Return
              </Button>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
