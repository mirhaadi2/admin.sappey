import React, { useEffect, useMemo, useState } from "react";
import { Button } from "../Button";
import { Toggle } from "../Toggle";
import { apiClient } from "../../api";
import { CheckCircle, X } from "@phosphor-icons/react";

type WebsiteTab =
    | "banners"
    | "hero"
    | "sections"
    | "testimonials"
    | "instagram";

interface WebsiteEntityFormProps {
    type: WebsiteTab;
    mode: "create" | "edit";
    initialValues?: Record<string, any>;
    isSubmitting?: boolean;
    onSubmit: (payload: Record<string, any>) => void;
    onCancel: () => void;
}

const emptyDefaults: Record<WebsiteTab, Record<string, any>> = {
    banners: { 
        title: "", 
        text: "", 
        subtitle: "", 
        isActive: true 
    },
    hero: {
        title: "",
        subtitle: "",
        description: "",
        imageUrl: "",
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
};

const fieldsByType: Record<
    WebsiteTab,
    Array<{
        key: string;
        label: string;
        type: "text" | "textarea" | "number" | "select" | "file";
        options?: Array<{ value: string; label: string }>;
        required?: boolean;
        accept?: string;
    }>
> = {
    banners: [
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
            required: true,
            accept: "video/*"
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
};

export const WebsiteEntityForm: React.FC<WebsiteEntityFormProps> = ({
    type,
    mode,
    initialValues,
    isSubmitting,
    onSubmit,
    onCancel,
}) => {
    const [form, setForm] = useState<Record<string, any>>(() => ({
        ...emptyDefaults[type],
        ...initialValues,
    }));
    const [uploadingFields, setUploadingFields] = useState<Set<string>>(new Set());
    const [uploadErrors, setUploadErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        setForm({ ...emptyDefaults[type], ...initialValues });
    }, [type, initialValues]);

    const fields = useMemo(() => fieldsByType[type], [type]);

    const handleInputChange = (key: string, value: any) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleFileUpload = async (key: string, file: File) => {
        try {
            setUploadingFields((prev) => new Set([...prev, key]));
            setUploadErrors((prev) => ({ ...prev, [key]: "" }));

            const formData = new FormData();
            formData.append("file", file, file.name);
            formData.append("folder", "website/hero");

            // DEBUG: verify the form payload includes the file and folder
            for (const [key, value] of formData.entries()) {
                console.log("upload formData entry", key, value);
            }

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
                    response.data?.message ||
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
                                value={form[field.key] || ""}
                                onChange={(e) => handleInputChange(field.key, e.target.value)}
                                className="w-full rounded border border-slate-300 p-2"
                                rows={3}
                                required={field.required}
                            />
                        ) : field.type === "select" ? (
                            <select
                                value={form[field.key] || ""}
                                onChange={(e) => handleInputChange(field.key, e.target.value)}
                                className="w-full rounded border border-slate-300 p-2"
                                required={field.required}
                            >
                                {field.options?.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
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
                                {form[field.key] && (
                                    <div className="flex items-center gap-2 rounded bg-green-50 p-2">
                                        <CheckCircle size={16} className="text-green-600" />
                                        <span className="text-sm text-green-700">
                                            {form[field.key].split("/").pop()}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => handleInputChange(field.key, "")}
                                            className="ml-auto text-green-600 hover:text-green-800"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                )}
                                {uploadErrors[field.key] && (
                                    <p className="text-sm text-red-600">{uploadErrors[field.key]}</p>
                                )}
                            </div>
                        ) : (
                            <input
                                type={field.type}
                                value={form[field.key] ?? ""}
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
        </div>
    );
};

export default WebsiteEntityForm;