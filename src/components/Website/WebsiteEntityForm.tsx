import React, { useEffect, useMemo, useState } from "react";
import { Button } from "../Button";
import { Toggle } from "../Toggle";
import { ConfirmDialog } from "../ConfirmDialog";
import { apiClient } from "../../api";
import { CheckCircle, X } from "@phosphor-icons/react";
import { useAdminCategoriesList } from "../../api/admin/categories/hooks";
import { useAdminProductsList } from "../../api/admin/products/hooks";
import Select from "react-select";

type EntityTab =
    | "banners"
    | "hero"
    | "sections"
    | "testimonials"
    | "instagram"
    | "promotions"
    | "coupons";

interface WebsiteEntityFormProps {
    type: EntityTab;
    mode: "create" | "edit";
    initialValues?: Record<string, any>;
    isSubmitting?: boolean;
    onSubmit: (payload: Record<string, any>) => void;
    onCancel: () => void;
}

const emptyDefaults: Record<EntityTab, Record<string, any>> = {
    banners: {
        // title: "", 
        text: "",
        // subtitle: "", 
        isActive: true
    },
    hero: {
        title: "",
        subtitle: "",
        description: "",
        imageUrl: "",
        backgroundImageUrl: "",
        buttonText: "",
        buttonUrl: "",
        isActive: true,
    },
    sections: {
        sectionType: "",
        title: "",
        subtitle: "",
        content: "",
        imageUrl: "",
        videoUrl: "",
        backgroundImageUrl: "",
        buttonText: "",
        buttonLink: "",
        isActive: true,
        order: 1,
    },
    testimonials: {
        name: "",
        role: "",
        content: "",
        imageUrl: "",
        rating: 5,
        isActive: true,
    },
    instagram: {
        imageUrl: "",
        caption: "",
        postUrl: "",
        isActive: true
    },
    promotions: {
        title: "",
        description: "",
        type: "fixed_discount",
        bannerText: "",
        minOrderValue: undefined,
        maxOrderValue: undefined,
        minQuantity: undefined,
        maxQuantity: undefined,
        applicableCategories: [],
        applicableProducts: [],
        excludeProducts: [],
        discountValue: undefined,
        giftProductId: "",
        freeText: "",
        validFrom: "",
        validUntil: "",
        usageLimit: undefined,
        priority: 0,
        displayOnHomepage: true,
        displayOnCheckout: true,
        displayOnProductPages: false,
        badgeIcon: "",
        isActive: true,
    },
    coupons: {
        code: "",
        title: "",
        description: "",
        type: "fixed_discount",
        discountValue: undefined,
        minOrderValue: undefined,
        maxDiscountAmount: undefined,
        validFrom: "",
        validUntil: "",
        usageLimit: undefined,
        perUserLimit: undefined,
        firstOrderOnly: false,
        isActive: true,
    },
};

type FieldType = "text" | "textarea" | "number" | "select" | "file" | "date" | "checkbox";

interface FieldDefinition {
    key: string;
    label: string;
    type: FieldType;
    options?: Array<{ value: string; label: string }>;
    required?: boolean;
    accept?: string;
    multiple?: boolean;
    optionsSource?: "categories" | "products";
}

const fieldsByType: Record<EntityTab, FieldDefinition[]> = {
    banners: [
        // { 
        //     key: "title", 
        //     label: "Title", 
        //     type: "text", 
        //     required: true 
        // },
        // { 
        //     key: "subtitle", 
        //     label: "Subtitle", 
        //     type: "text" 
        // },
        {
            key: "text",
            label: "Text",
            type: "textarea",
            required: true
        },
    ],
    hero: [
        {
            key: "title",
            label: "Title",
            type: "text",
            required: true
        },
        {
            key: "subtitle",
            label: "Subtitle",
            type: "text"
        },
        {
            key: "description",
            label: "Description",
            type: "textarea",
            required: false
        },
        {
            key: "videoUrl",
            label: "Video File",
            type: "file",
            required: false,
            accept: "video/*"
        },
        {
            key: "imageUrl",
            label: "Hero Image",
            type: "file",
            required: false,
            accept: "image/*"
        },
        {
            key: "backgroundImageUrl",
            label: "Background Image",
            type: "file",
            required: false,
            accept: "image/*"
        },
        {
            key: "buttonText",
            label: "Button Text",
            type: "text"
        },
        {
            key: "buttonLink",
            label: "Button URL",
            type: "text"
        },
    ],
    sections: [
        {
            key: "sectionType",
            label: "Section Type",
            type: "text",
            required: true,
        },
        {
            key: "title",
            label: "Title",
            type: "text",
            required: true
        },
        {
            key: "subtitle",
            label: "Subtitle",
            type: "text"
        },
        {
            key: "content",
            label: "Content",
            type: "textarea"
        },
        {
            key: "order",
            label: "Order",
            type: "number",
            required: true
        },
        {
            key: "imageUrl",
            label: "Image",
            type: "file",
            accept: "image/*"
        },
        {
            key: "videoUrl",
            label: "Video Upload",
            type: "file",
            accept: "video/*"
        },
        {
            key: "backgroundImageUrl",
            label: "Background Image",
            type: "file",
            accept: "image/*"
        },
        {
            key: "buttonText",
            label: "Button Text",
            type: "text"
        },
        {
            key: "buttonLink",
            label: "Button Link",
            type: "text"
        },
    ],
    testimonials: [
        {
            key: "author",
            label: "Author Name",
            type: "text",
            required: true
        },
        {
            key: "role",
            label: "Role",
            type: "text"
        },
        {
            key: "comment",
            label: "Comment",
            type: "textarea",
            required: true
        },
        {
            key: "imageUrl",
            label: "Image",
            type: "file",
            accept: "image/*"
        },
        {
            key: "rating",
            label: "Rating (1-5)",
            type: "number",
            required: true
        },
        {
            key: "location",
            label: "Location",
            type: "text",
            required: true
        },
    ],
    instagram: [
        {
            key: "imageUrl",
            label: "Image",
            type: "file",
            accept: "image/*",
            required: true
        },
        {
            key: "caption",
            label: "Caption",
            type: "textarea"
        },
        {
            key: "postUrl",
            label: "Post URL",
            type: "text"
        },
    ],
    promotions: [
        {
            key: "title",
            label: "Promotion Title",
            type: "text",
            required: true
        },
        {
            key: "description",
            label: "Description",
            type: "textarea"
        },
        {
            key: "bannerText",
            label: "Banner Text",
            type: "text"
        },
        {
            key: "type",
            label: "Type",
            type: "select",
            options: [
                { value: "fixed_discount", label: "Fixed Discount (₹)" },
                { value: "percentage_discount", label: "Percentage Discount (%)" },
                { value: "free_gift", label: "Free Gift" },
                { value: "free_shipping", label: "Free Shipping" },
                { value: "bundle", label: "Bundle Deal" },
                { value: "tiered", label: "Tiered Pricing" },
            ],
            required: true
        },
        {
            key: "minOrderValue",
            label: "Min Order Value (₹)",
            type: "number"
        },
        {
            key: "maxOrderValue",
            label: "Max Order Value (₹)",
            type: "number"
        },
        {
            key: "minQuantity",
            label: "Min Quantity",
            type: "number"
        },
        {
            key: "maxQuantity",
            label: "Max Quantity",
            type: "number"
        },
        {
            key: "applicableCategories",
            label: "Applicable Categories",
            type: "select",
            multiple: true,
            optionsSource: "categories",
        },
        {
            key: "applicableProducts",
            label: "Applicable Products",
            type: "select",
            multiple: true,
            optionsSource: "products",
        },
        {
            key: "excludeProducts",
            label: "Excluded Products",
            type: "select",
            multiple: true,
            optionsSource: "products",
        },
        {
            key: "discountValue",
            label: "Discount Value",
            type: "number"
        },
        {
            key: "giftProductId",
            label: "Gift Product",
            type: "select",
            optionsSource: "products",
        },
        {
            key: "freeText",
            label: "Free Gift Text",
            type: "text",
        },
        {
            key: "validFrom",
            label: "Valid From",
            type: "date"
        },
        {
            key: "validUntil",
            label: "Valid Until",
            type: "date"
        },
        {
            key: "usageLimit",
            label: "Usage Limit (0 = Unlimited)",
            type: "number"
        },
        {
            key: "displayOnHomepage",
            label: "Show on Homepage",
            type: "checkbox",
        },
        {
            key: "displayOnCheckout",
            label: "Show on Checkout",
            type: "checkbox",
        },
        {
            key: "displayOnProductPages",
            label: "Show on Product Pages",
            type: "checkbox",
        },
        {
            key: "badgeIcon",
            label: "Badge Icon",
            type: "text"
        },
        {
            key: "priority",
            label: "Priority",
            type: "number"
        },
    ],
    coupons: [
        {
            key: "code",
            label: "Coupon Code",
            type: "text",
            required: true
        },
        {
            key: "title",
            label: "Coupon Title",
            type: "text",
            required: true
        },
        {
            key: "description",
            label: "Description",
            type: "textarea"
        },
        {
            key: "type",
            label: "Discount Type",
            type: "select",
            options: [
                { value: "fixed_discount", label: "Fixed Discount (₹)" },
                { value: "percentage_discount", label: "Percentage Discount (%)" },
                { value: "free_shipping", label: "Free Shipping" },
                { value: "free_order", label: "Free Order" },
            ],
            required: true
        },
        {
            key: "discountValue",
            label: "Discount Value",
            type: "number"
        },
        {
            key: "maxDiscountAmount",
            label: "Max Discount Amount (₹)",
            type: "number"
        },
        {
            key: "minOrderValue",
            label: "Min Order Value (₹)",
            type: "number"
        },
        {
            key: "validFrom",
            label: "Valid From",
            type: "date",
            required: true
        },
        {
            key: "validUntil",
            label: "Valid Until",
            type: "date",
            required: true
        },
        {
            key: "usageLimit",
            label: "Usage Limit (0 = Unlimited)",
            type: "number"
        },
        {
            key: "perUserLimit",
            label: "Per User Limit (0 = Unlimited)",
            type: "number"
        },
        {
            key: "firstOrderOnly",
            label: "First Order Only",
            type: "checkbox"
        },
    ],
};

const normalizeArrayField = (value: unknown): string[] => {
    if (Array.isArray(value)) {
        return value.map((item) => String(item).trim()).filter(Boolean);
    }

    if (typeof value === "string") {
        return value
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
    }

    return [];
};

const initializeFormState = (type: EntityTab, initialValues?: Record<string, any>) => {
    const formState = { ...emptyDefaults[type], ...initialValues } as Record<string, unknown>;

    ["applicableCategories", "applicableProducts", "excludeProducts"].forEach((key) => {
        formState[key] = normalizeArrayField(formState[key]);
    });

    return formState;
};

export const WebsiteEntityForm: React.FC<WebsiteEntityFormProps> = ({
    type,
    mode,
    initialValues,
    isSubmitting,
    onSubmit,
    onCancel,
}) => {
    const [form, setForm] = useState<Record<string, unknown>>(() => initializeFormState(type, initialValues));
    const [uploadingFields, setUploadingFields] = useState<Set<string>>(new Set());
    const [uploadErrors, setUploadErrors] = useState<Record<string, string>>({});
    const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; fieldKey: string | null; fieldLabel: string }>({
        isOpen: false,
        fieldKey: null,
        fieldLabel: "",
    });

    const categoriesQuery = useAdminCategoriesList({ page: 1, limit: 200 });
    const productsQuery = useAdminProductsList({ page: 1, limit: 200 });

    const categoryOptions = useMemo(
        () => categoriesQuery.data?.data?.categories?.map((category: any) => ({
            value: category.id,
            label: category.name,
        })) ?? [],
        [categoriesQuery.data],
    );

    const productOptions = useMemo(
        () => productsQuery.data?.data?.map((product: any) => ({
            value: product.id,
            label: `${product.name} (${product.id})`,
        })) ?? [],
        [productsQuery.data],
    );

    useEffect(() => {
        setForm(initializeFormState(type, initialValues));
    }, [type, initialValues]);

    const fields = useMemo(() => fieldsByType[type], [type]);

    const handleInputChange = (key: string, value: unknown) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleDeleteClick = (fieldKey: string, fieldLabel: string) => {
        setConfirmDialog({
            isOpen: true,
            fieldKey,
            fieldLabel,
        });
    };

    const handleConfirmDelete = () => {
        if (confirmDialog.fieldKey) {
            handleInputChange(confirmDialog.fieldKey, "");
            setConfirmDialog({ isOpen: false, fieldKey: null, fieldLabel: "" });
        }
    };

    const handleCancelDelete = () => {
        setConfirmDialog({ isOpen: false, fieldKey: null, fieldLabel: "" });
    };

    const handleFileUpload = async (key: string, file: File) => {
        try {
            setUploadingFields((prev) => new Set([...prev, key]));
            setUploadErrors((prev) => ({ ...prev, [key]: "" }));

            // Dynamic folder based on type and field
            const folderMap: Record<string, string> = {
                hero: "website/hero",
                sections: "website/sections",
                banners: "website/banners",
                testimonials: "website/testimonials",
                instagram: "website/instagram",
            };

            // Set the folder based on type, defaulting to "website" if not found
            const folder = folderMap[type] || "website";

            const formData = new FormData();
            formData.append("file", file, file.name);
            formData.append("folder", folder);


            const response = await apiClient.post<{
                success: boolean;
                url: string;
                key: string;
                originalName: string;
                contentType: string;
            }>("/uploads", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.data.success && response.data.key) {
                // Store the key (R2 path) in the form
                handleInputChange(key, response.data.key);
            } else {
                const message =
                    response.data?.url ||
                    "Upload succeeded but no key returned";
                setUploadErrors((prev) => ({ ...prev, [key]: message }));
            }
        } catch (error: any) {
            const errorMessage =
                error.response?.data?.message || error.message || "Upload failed";
            setUploadErrors((prev) => ({ ...prev, [key]: errorMessage }));
        } finally {
            setUploadingFields((prev) => {
                const newSet = new Set(prev);
                newSet.delete(key);
                return newSet;
            });
        }
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        const payload = { ...form };
        if (payload.rating !== undefined) payload.rating = Number(payload.rating);
        if (payload.order !== undefined) payload.order = Number(payload.order);

        if (type === 'promotions') {
            const normalizedApplicableCategories = normalizeArrayField(payload.applicableCategories);
            if (normalizedApplicableCategories.length > 0) {
                payload.applicableCategories = normalizedApplicableCategories;
            } else {
                delete payload.applicableCategories;
            }

            const normalizedApplicableProducts = normalizeArrayField(payload.applicableProducts);
            if (normalizedApplicableProducts.length > 0) {
                payload.applicableProducts = normalizedApplicableProducts;
            } else {
                delete payload.applicableProducts;
            }

            const normalizedExcludeProducts = normalizeArrayField(payload.excludeProducts);
            if (normalizedExcludeProducts.length > 0) {
                payload.excludeProducts = normalizedExcludeProducts;
            } else {
                delete payload.excludeProducts;
            }

            if (payload.usageLimit !== undefined) payload.usageLimit = Number(payload.usageLimit);
            if (payload.discountValue !== undefined) payload.discountValue = Number(payload.discountValue);
            if (typeof payload.validFrom === 'string') payload.validFrom = payload.validFrom;
            if (typeof payload.validUntil === 'string') payload.validUntil = payload.validUntil;
        }

        onSubmit(payload);
    };

    return (
        <div className="space-y-4">
            {/* <h3 className="text-lg font-semibold text-slate-900">
                {mode === "create" ? "Create" : "Edit"} {type}
            </h3> */}
            <form onSubmit={handleSubmit} className="space-y-4">
                {fields.map((field) => (
                    <div key={field.key} className="space-y-1">
                        <label className="block text-sm font-medium text-slate-700">
                            {field.label}
                        </label>
                        {field.type === "textarea" ? (
                            <textarea
                                value={(form[field.key] as string) || ""}
                                onChange={(e) => handleInputChange(field.key, e.target.value)}
                                className="w-full rounded border border-slate-300 p-2"
                                rows={3}
                                required={field.required}
                            />
                        ) : field.type === "select" ? (
                            <>
                                {field.multiple ? (
                                    <Select
                                        isMulti
                                        closeMenuOnSelect={false}
                                        value={
                                            (
                                                (field.optionsSource === "categories"
                                                    ? categoryOptions
                                                    : field.optionsSource === "products"
                                                        ? productOptions
                                                        : field.options ?? []
                                                ).filter((option) =>
                                                    ((form[field.key] as string[]) || []).includes(option.value)
                                                )
                                            )
                                        }
                                        options={
                                            field.optionsSource === "categories"
                                                ? categoryOptions
                                                : field.optionsSource === "products"
                                                    ? productOptions
                                                    : field.options ?? []
                                        }
                                        onChange={(selected: any) =>
                                            handleInputChange(
                                                field.key,
                                                selected.map((item: any) => item.value)
                                            )
                                        }
                                        className="react-select-container"
                                        classNamePrefix="react-select"
                                        placeholder={`Select ${field.label}`}
                                    />
                                ) : (
                                    <select
                                        value={(form[field.key] as string) || ""}
                                        onChange={(e) => handleInputChange(field.key, e.target.value)}
                                        className="w-full rounded border border-slate-300 p-2"
                                        required={field.required}
                                    >
                                        <option value="">Select an option</option>

                                        {(field.optionsSource === "categories"
                                            ? categoryOptions
                                            : field.optionsSource === "products"
                                                ? productOptions
                                                : field.options ?? []
                                        ).map((opt) => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                )}
                                {field.multiple && (
                                    <p className="text-xs text-slate-500">Hold Ctrl / Cmd to select multiple items.</p>
                                )}
                                {field.optionsSource === "categories" && categoriesQuery.isLoading && (
                                    <p className="text-xs text-slate-500">Loading categories...</p>
                                )}
                                {field.optionsSource === "products" && productsQuery.isLoading && (
                                    <p className="text-xs text-slate-500">Loading products...</p>
                                )}
                            </>
                        ) : field.type === "date" ? (
                            <input
                                type="date"
                                value={(form[field.key] as string) || ""}
                                onChange={(e) => handleInputChange(field.key, e.target.value)}
                                className="w-full rounded border border-slate-300 p-2"
                                required={field.required}
                            />
                        ) : field.type === "checkbox" ? (
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={(form[field.key] as boolean) || false}
                                    onChange={(e) => handleInputChange(field.key, e.target.checked)}
                                    className="w-4 h-4 rounded border-slate-300"
                                />
                                <span className="text-sm text-slate-700">{field.label}</span>
                            </label>
                        ) : field.type === "file" ? (
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="file"
                                        accept={field.accept}
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                handleFileUpload(field.key, file);
                                            }
                                        }}
                                        disabled={uploadingFields.has(field.key)}
                                        className="w-full rounded border border-slate-300 p-2 text-sm disabled:bg-slate-100"
                                        required={false}
                                    />
                                    {uploadingFields.has(field.key) && (
                                        <span className="text-sm text-blue-600">Uploading...</span>
                                    )}
                                </div>

                                {(form[field.key] as any) && (
                                    <div className="space-y-2">
                                        {field.accept?.includes("image") && String(form[field.key]).startsWith("http") ? (
                                            <div className="relative">
                                                <img
                                                    src={String(form[field.key])}
                                                    alt="Preview"
                                                    className="w-full max-w-xs h-32 object-cover rounded border"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteClick(field.key, field.label)}
                                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        ) : field.accept?.includes("video") && String(form[field.key]).startsWith("http") ? (
                                            <div className="relative">
                                                <video
                                                    src={String(form[field.key])}
                                                    controls
                                                    className="w-full max-w-xs h-32 object-cover rounded border"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteClick(field.key, field.label)}
                                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 rounded bg-green-50 p-2">
                                                <CheckCircle size={16} className="text-green-600" />
                                                <span className="text-sm text-green-700">
                                                    {String(form[field.key]).split("/").pop()}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteClick(field.key, field.label)}
                                                    className="ml-auto text-green-600 hover:text-green-800"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {uploadErrors[field.key] && (
                                    <p className="text-sm text-red-600">{uploadErrors[field.key]}</p>
                                )}
                            </div>
                        ) : (
                            <input
                                type={field.type}
                                value={(form[field.key] ?? "") as string | number | readonly string[] | undefined}
                                onChange={(e) =>
                                    handleInputChange(
                                        field.key,
                                        field.type === "number"
                                            ? Number(e.target.value)
                                            : e.target.value,
                                    )
                                }
                                className="w-full rounded border border-slate-300 p-2"
                                required={field.required}
                            />
                        )}
                    </div>
                ))}

                <div className="flex items-center justify-between">
                    <span className="text-sm">Active Status:</span>
                    <Toggle
                        isActive={!!form.isActive}
                        onClick={() => handleInputChange("isActive", !form.isActive)}
                        activeLabel="Active"
                        inactiveLabel="Inactive"
                        className="grow-0"
                    />
                </div>

                <div className="flex justify-end gap-2">
                    <Button variant="secondary" onClick={onCancel} type="button">
                        Cancel
                    </Button>
                    <Button type="submit" isLoading={isSubmitting}>
                        {mode === "create" ? "Create" : "Save"}
                    </Button>
                </div>
            </form>

            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                title="Delete File"
                description={`Are you sure you want to delete "${confirmDialog.fieldLabel}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                isDangerous={true}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />
        </div>
    );
};

export default WebsiteEntityForm;