import React, { useEffect, useMemo, useState } from "react";
import { Button } from "../Button";
import { Toggle } from "../Toggle";

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
        sectionType: "collections",
        title: "",
        subtitle: "",
        content: "",
        imageUrl: "",
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
        type: "text" | "textarea" | "number" | "select";
        options?: Array<{ value: string; label: string }>;
        required?: boolean;
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
            key: "imageUrl", 
            label: "Image URL", 
            type: "text", 
            required: true 
        },
        { 
            key: "buttonText", 
            label: "Button Text", 
            type: "text" 
        },
        { 
            key: "buttonUrl", 
            label: "Button URL", 
            type: "text" 
        },
    ],
    sections: [
        {
            key: "sectionType",
            label: "Section Type",
            type: "select",
            required: true,
            options: [
                { value: "collections", label: "Collections" },
                { value: "bestsellers", label: "Bestsellers" },
                { value: "health_wellness", label: "Health & Wellness" },
                { value: "new_arrivals", label: "New Arrivals" },
                { value: "story", label: "Story" },
                { value: "testimonials", label: "Testimonials" },
                { value: "instagram", label: "Instagram" },
                { value: "contact", label: "Contact" },
                { value: "about", label: "About" },
                { value: "footer", label: "Footer" },
            ],
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
            label: "Image URL", 
            type: "text" 
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
            key: "name", 
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
            key: "content", 
            label: "Comment", 
            type: "textarea", 
            required: true 
        },
        { 
            key: "imageUrl", 
            label: "Image URL", 
            type: "text" 
        },
        { 
            key: "rating", 
            label: "Rating (1-5)", 
            type: "number", 
            required: true 
        },
    ],
    instagram: [
        { 
            key: "imageUrl", 
            label: "Image URL", 
            type: "text", 
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

    useEffect(() => {
        setForm({ ...emptyDefaults[type], ...initialValues });
    }, [type, initialValues]);

    const fields = useMemo(() => fieldsByType[type], [type]);

    const handleInputChange = (key: string, value: any) => {
        setForm((prev) => ({ ...prev, [key]: value }));
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