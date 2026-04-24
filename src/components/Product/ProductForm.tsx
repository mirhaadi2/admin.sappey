import React, { useEffect, useState } from "react";
import { useForm, FormProvider, useFieldArray, Controller } from "react-hook-form";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

import { apiMethods } from "@/api/index";
import { FormField } from "@/components/Form/FormField";
import { Button } from "@/components";
import { cn } from "@/lib/utils";
import type { AdminCategory } from "@/api/admin/categories/types";
import { 
  Trash, Plus, Settings, Package, 
  FileText, ImageIcon, ListTree, 
  Sparkles, BarChart3, X 
} from "lucide-react";

// Professional styling for the Quill editor to match the Admin UI
const quillStyles = `
  .ql-container { border-bottom-left-radius: 12px; border-bottom-right-radius: 12px; font-family: inherit; min-height: 250px; font-size: 16px; }
  .ql-toolbar { border-top-left-radius: 12px; border-top-right-radius: 12px; background: #f8fafc; border-color: #e2e8f0 !important; }
  .ql-container.ql-snow { border-color: #e2e8f0 !important; }
  .ql-editor.ql-blank::before { color: #94a3b8; font-style: normal; }
`;

const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'align': [] }],
    ['clean']
  ],
};

export type ProductFormValues = {
  name: string;
  slug?: string;
  description: string;
  descriptionDetails?: Array<{ type: 'text' | 'highlight' | 'point'; content: string; }>;
  gst_rate?: number;
  status?: "ACTIVE" | "INACTIVE";
  category: string;
  images: string[];
  stock?: number;
  isNew?: boolean;
  isCustomerFavourites?: boolean;
  isBestseller?: boolean;
  benefits?: string[];
  ingredients?: string[];
  nutritionFacts?: Array<{ label: string; value: string; }>;
  variants?: Array<{
    price: number;
    discountedPrice?: number;
    discountedPercent?: number;
    weight?: number;
    weightUnit?: "G" | "KG";
    status?: "ACTIVE" | "INACTIVE";
  }>;
};

interface ProductFormProps {
  title?: string;
  isSubmitting?: boolean;
  submitLabel?: string;
  defaultValues?: Partial<ProductFormValues>;
  categories?: AdminCategory[];
  onCancel: () => void;
  onSubmit: (values: ProductFormValues, action: "continue" | "return") => void;
  onDirtyChange?: (dirty: boolean) => void;
}

export function ProductForm({
  title = "Product Management",
  isSubmitting = false,
  defaultValues = {},
  categories = [],
  onCancel,
  onSubmit,
  onDirtyChange,
}: ProductFormProps) {
  const [activeTab, setActiveTab] = useState<"general" | "content" | "inventory" | "variants" | "media">("general");
  const [uploading, setUploading] = useState(false);
  const [benefits, setBenefits] = useState<string[]>(defaultValues.benefits || []);
  const [ingredients, setIngredients] = useState<string[]>(defaultValues.ingredients || []);

  const formMethods = useForm<ProductFormValues>({
    shouldUnregister: false,
    defaultValues: {
      name: "", slug: "", description: "", descriptionDetails: [],
      gst_rate: 18, status: "ACTIVE", category: "", images: [],
      stock: 0, isNew: false, isCustomerFavourites: false, isBestseller: false,
      benefits: [], ingredients: [], nutritionFacts: [], variants: [],
      ...defaultValues,
    },
  });

  const { handleSubmit, reset, setValue, watch, control, formState: { isDirty } } = formMethods;

  const variants = useFieldArray({ control, name: "variants" });
  const nutrition = useFieldArray({ control, name: "nutritionFacts" });

  useEffect(() => { onDirtyChange?.(isDirty); }, [isDirty, onDirtyChange]);

  useEffect(() => {
    if (!isDirty) reset({ ...formMethods.getValues(), ...defaultValues });
  }, [defaultValues, reset]);

  useEffect(() => {
    setBenefits(defaultValues.benefits || []);
    setIngredients(defaultValues.ingredients || []);
  }, [defaultValues.benefits, defaultValues.ingredients]);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const existingImages = watch("images") || [];
      const uploadedKeys: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append("file", files[i]);
        formData.append("folder", "products");
        const response = await apiMethods.upload<{ url: string; key: string }>("/uploads", formData);
        const key = response.data?.key || response.data?.url;
        if (key) uploadedKeys.push(key);
      }
      setValue("images", [...existingImages, ...uploadedKeys], { shouldValidate: true, shouldDirty: true });
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setUploading(false);
      if (event.target) event.target.value = "";
    }
  };

  const tabs = [
    { id: "general", label: "General", icon: Settings },
    { id: "inventory", label: "Inventory", icon: Package },
    { id: "content", label: "Content & Health", icon: FileText },
    { id: "variants", label: "Variants", icon: ListTree },
    { id: "media", label: "Media", icon: ImageIcon },
  ] as const;

  return (
    <div className="w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
      <style>{quillStyles}</style>
      
      {/* Top Header */}
      <div className="px-8 py-6 bg-slate-900 text-white flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          <p className="text-slate-400 text-sm mt-1 uppercase tracking-wider font-medium">Sappey Foods Admin</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="text-white border-slate-700 hover:bg-slate-800" onClick={onCancel}>Cancel</Button>
          <Button variant="primary" disabled={isSubmitting} onClick={handleSubmit((data) => onSubmit({ ...data, benefits, ingredients }, "return"))}>
            {isSubmitting ? "Saving..." : "Save Product"}
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row min-h-[650px]">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 bg-slate-50 border-r border-slate-200 p-4 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all",
                activeTab === tab.id ? "bg-blue-600 text-white shadow-lg" : "text-slate-600 hover:bg-slate-200"
              )}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 p-8 overflow-y-auto max-h-[800px]">
          <FormProvider {...formMethods}>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
              
              {/* TAB: GENERAL */}
              {activeTab === "general" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="grid grid-cols-2 gap-6">
                    <FormField name="name" label="Product Name" required className="col-span-2" />
                    <FormField name="slug" label="URL Slug" className="col-span-2" helperText="Helpful for SEO" />
                    <FormField name="category" label="Category" type="select" required 
                      options={categories.map(c => ({ value: c.id, label: c.name }))} 
                    />
                    <FormField name="gst_rate" label="GST Rate" type="select" 
                      options={["0", "5", "12", "18", "28"].map(v => ({ value: v, label: `${v}%` }))} 
                    />
                    <FormField name="status" label="Product Status" type="select" 
                      options={[{ value: "ACTIVE", label: "Active" }, { value: "INACTIVE", label: "Inactive" }]} 
                    />
                  </div>
                </div>
              )}

              {/* TAB: INVENTORY */}
              {activeTab === "inventory" && (
                <div className="space-y-8 animate-in fade-in duration-300">
                  <section>
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Stock Levels</h4>
                    <FormField name="stock" label="Total Inventory (kg)" type="number" />
                  </section>
                  <section className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
                    <h4 className="font-bold text-blue-900 mb-4 flex items-center gap-2"><Sparkles size={18}/> Marketing Badges</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField name="isNew" label="New Arrival" type="checkbox" />
                      <FormField name="isBestseller" label="Bestseller" type="checkbox" />
                      <FormField name="isCustomerFavourites" label="Customer Favourite" type="checkbox" />
                    </div>
                  </section>
                </div>
              )}

              {/* TAB: CONTENT & HEALTH (Quill Implementation) */}
              {activeTab === "content" && (
                <div className="space-y-8 animate-in fade-in duration-300">
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Detailed Description</label>
                    <Controller
                      name="description"
                      control={control}
                      render={({ field }) => (
                        <ReactQuill 
                          theme="snow"
                          {...field}
                          onChange={(content) => field.onChange(content)}
                          modules={quillModules}
                          placeholder="Craft a compelling product story..."
                        />
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Benefits */}
                    <div className="p-5 bg-amber-50 rounded-2xl border border-amber-100">
                      <div className="flex justify-between items-center mb-4 text-amber-900 font-bold">
                        <span>✨ Benefits</span>
                        <Button size="sm" variant="secondary" onClick={() => setBenefits([...benefits, ""])}><Plus size={14}/></Button>
                      </div>
                      {benefits.map((benefit, i) => (
                        <div key={i} className="flex gap-2 mb-2">
                          <input 
                            value={benefit} 
                            onChange={(e) => {
                              const newBenefits = [...benefits];
                              newBenefits[i] = e.target.value;
                              setBenefits(newBenefits);
                            }}
                            className="flex-1 p-2 border rounded-lg text-sm bg-white" 
                            placeholder="e.g. Rich in Omega-3" 
                          />
                          <button onClick={() => setBenefits(benefits.filter((_, idx) => idx !== i))} className="text-red-500"><Trash size={16}/></button>
                        </div>
                      ))}
                    </div>

                    {/* Ingredients */}
                    <div className="p-5 bg-green-50 rounded-2xl border border-green-100">
                      <div className="flex justify-between items-center mb-4 text-green-900 font-bold">
                        <span>🌿 Ingredients</span>
                        <Button size="sm" variant="secondary" onClick={() => setIngredients([...ingredients, ""])}><Plus size={14}/></Button>
                      </div>
                      {ingredients.map((ingredient, i) => (
                        <div key={i} className="flex gap-2 mb-2">
                          <input 
                            value={ingredient} 
                            onChange={(e) => {
                              const newIngredients = [...ingredients];
                              newIngredients[i] = e.target.value;
                              setIngredients(newIngredients);
                            }}
                            className="flex-1 p-2 border rounded-lg text-sm bg-white" 
                            placeholder="e.g. Kashmiri Walnuts" 
                          />
                          <button onClick={() => setIngredients(ingredients.filter((_, idx) => idx !== i))} className="text-red-500"><Trash size={16}/></button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Nutrition */}
                  <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800 shadow-lg">
                    <div className="flex justify-between items-center mb-4 font-bold text-white">
                      <span className="flex items-center gap-2"><BarChart3 size={18} className="text-blue-400"/> Nutrition Facts</span>
                      <Button size="sm" variant="secondary" className="bg-white/10 text-white hover:bg-white/20 border-none" onClick={() => nutrition.append({ label: "", value: "" })}><Plus size={14}/></Button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {nutrition.fields.map((f, i) => (
                        <div key={f.id} className="flex gap-2 bg-white/5 p-2 rounded-xl border border-white/10">
                          <input {...formMethods.register(`nutritionFacts.${i}.label`)} className="w-1/2 p-2 text-sm bg-transparent text-blue-200 focus:outline-none" placeholder="Label" />
                          <input {...formMethods.register(`nutritionFacts.${i}.value`)} className="w-1/2 p-2 text-sm bg-transparent text-white border-l border-white/10 focus:outline-none font-mono" placeholder="Value" />
                          <button onClick={() => nutrition.remove(i)} className="text-white/20 hover:text-red-400"><X size={16}/></button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: VARIANTS */}
              {activeTab === "variants" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-lg">Pricing & Sizes</h3>
                    <Button variant="secondary" onClick={() => variants.append({ price: 0, weight: 0, weightUnit: "G", status: "ACTIVE" })}>
                      <Plus size={16} className="mr-2" /> Add Variant
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {variants.fields.map((f, i) => (
                      <div key={f.id} className="p-6 bg-slate-50 border rounded-2xl grid grid-cols-12 gap-4 items-end relative shadow-sm hover:shadow-md transition-shadow">
                        <div className="col-span-3"><FormField name={`variants.${i}.weight`} label="Weight" type="number" /></div>
                        <div className="col-span-2"><FormField name={`variants.${i}.weightUnit`} label="Unit" type="select" options={[{value:"G",label:"G"},{value:"KG",label:"KG"}]} /></div>
                        <div className="col-span-2"><FormField name={`variants.${i}.price`} label="Base Price" type="number" /></div>
                        <div className="col-span-2"><FormField name={`variants.${i}.discountedPrice`} label="Dis. Price" type="number" /></div>
                        <div className="col-span-2"><FormField name={`variants.${i}.discountedPercent`} label="Discount %" type="number" /></div>
                        <div className="col-span-1"><Button variant="danger" className="w-full p-2 h-10" onClick={() => variants.remove(i)}><Trash size={18}/></Button></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB: MEDIA */}
              {activeTab === "media" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="p-8 border-2 border-dashed border-slate-300 rounded-2xl text-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer relative">
                    <input type="file" multiple accept="image/*" onChange={handleUpload} className="absolute inset-0 opacity-0 cursor-pointer" disabled={uploading} />
                    <ImageIcon className="mx-auto text-slate-400 mb-2" size={48} />
                    <p className="text-sm font-semibold text-slate-600">{uploading ? "Uploading..." : "Click or drag images here to upload"}</p>
                  </div>
                  <div className="grid grid-cols-4 gap-4 mt-4">
                    {watch("images")?.map((url, idx) => (
                      <div key={idx} className="aspect-square rounded-xl overflow-hidden border border-slate-200 relative group">
                        <img src={url} alt="Product" className="w-full h-full object-cover" />
                        <button 
                          onClick={() => setValue("images", watch("images").filter((_, i) => i !== idx), { shouldDirty: true })}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
}