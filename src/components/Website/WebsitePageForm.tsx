import React, { useState, useEffect } from 'react';
import { Button } from '../Button';
import { Toggle } from '../Toggle';

type WebsitePageFormData = {
  slug: string;
  title: string;
  content: string;
  metaTitle?: string;
  metaDescription?: string;
  isPublished: boolean;
  order: number;
};

interface WebsitePageFormProps {
  mode: 'create' | 'edit';
  initialValues?: Partial<WebsitePageFormData>;
  isSubmitting?: boolean;
  onSubmit: (payload: WebsitePageFormData) => void;
  onCancel: () => void;
}

const emptyValues: WebsitePageFormData = {
  slug: '',
  title: '',
  content: '',
  metaTitle: '',
  metaDescription: '',
  isPublished: false,
  order: 0,
};

export const WebsitePageForm: React.FC<WebsitePageFormProps> = ({
  mode,
  initialValues,
  isSubmitting,
  onSubmit,
  onCancel,
}) => {
  const [form, setForm] = useState<WebsitePageFormData>({ ...emptyValues });

  useEffect(() => {
    setForm({ ...emptyValues, ...initialValues });
  }, [initialValues]);

  const handleInputChange = (key: keyof WebsitePageFormData, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="block text-sm font-medium text-slate-700">
          Slug
          <input
            type="text"
            value={form.slug}
            onChange={(e) => handleInputChange('slug', e.target.value)}
            className="w-full rounded border border-slate-300 p-2 mt-1"
            required
            disabled={mode === 'edit'}
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Title
          <input
            type="text"
            value={form.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className="w-full rounded border border-slate-300 p-2 mt-1"
            required
          />
        </label>
      </div>

      <label className="block text-sm font-medium text-slate-700">
        Content
        <textarea
          value={form.content}
          onChange={(e) => handleInputChange('content', e.target.value)}
          rows={6}
          className="w-full rounded border border-slate-300 p-2 mt-1"
          required
        />
      </label>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="block text-sm font-medium text-slate-700">
          Meta Title
          <input
            type="text"
            value={form.metaTitle || ''}
            onChange={(e) => handleInputChange('metaTitle', e.target.value)}
            className="w-full rounded border border-slate-300 p-2 mt-1"
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Meta Description
          <input
            type="text"
            value={form.metaDescription || ''}
            onChange={(e) => handleInputChange('metaDescription', e.target.value)}
            className="w-full rounded border border-slate-300 p-2 mt-1"
          />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4 items-center">
        <div className="flex items-center gap-2">
          <Toggle
            isActive={form.isPublished}
            onClick={() => handleInputChange('isPublished', !form.isPublished)}
            activeLabel="Published"
            inactiveLabel="Draft"
            className="grow-0"
          />
        </div>
        <label className="text-sm font-medium text-slate-700">
          Order
          <input
            type="number"
            value={form.order}
            onChange={(e) => handleInputChange('order', Number(e.target.value))}
            className="w-full rounded border border-slate-300 p-2 mt-1"
            min={0}
          />
        </label>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={onCancel} type="button">
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {mode === 'create' ? 'Create' : 'Save'} Page
        </Button>
      </div>
    </form>
  );
};

export default WebsitePageForm;
