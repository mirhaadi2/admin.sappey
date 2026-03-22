# Component Library Guide

A professional-grade, reusable component library for the SapPay Admin Frontend. Built with React 18, TypeScript, Tailwind CSS, and seamlessly integrated with React Hook Form.

## Components Overview

### Form Components

#### Input
Simple text input with validation support via React Hook Form.

```tsx
import { Input } from '@/components/Form';

<Input
  label="Email"
  placeholder="user@example.com"
  error={errors.email}
  helperText="Use a valid email address"
  icon={<Mail size={18} />}
  required
/>
```

#### Select
Select dropdown with validation and custom options.

```tsx
import { Select } from '@/components/Form';

<Select
  label="Status"
  options={[
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ]}
  error={errors.status}
  required
/>
```

#### TextArea
Multi-line text input with character limit support.

```tsx
import { TextArea } from '@/components/Form';

<TextArea
  label="Description"
  placeholder="Enter product description..."
  error={errors.description}
  charLimit={500}
/>
```

#### FormField
High-level component for use with React Hook Form's useFormContext.

```tsx
import { useForm, FormProvider } from 'react-hook-form';
import { FormField } from '@/components/Form';

function MyForm() {
  const methods = useForm();

  return (
    <FormProvider {...methods}>
      <form>
        <FormField
          name="email"
          label="Email"
          type="email"
          required
          rules={{
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            },
          }}
        />
      </form>
    </FormProvider>
  );
}
```

### UI Components

#### Button
Versatile button with multiple variants and sizes.

```tsx
import { Button } from '@/components';

// Variants: primary, secondary, danger, success, outline
// Sizes: sm, md, lg

<Button variant="primary" size="md" isLoading={false}>
  Create
</Button>

<Button variant="danger" icon={<Trash size={16} />}>
  Delete
</Button>
```

#### Table
Powerful, flexible table component with custom column rendering.

```tsx
import { Table, type TableColumn } from '@/components';

interface Product {
  id: string;
  name: string;
  price: number;
  status: 'draft' | 'published';
}

const columns: TableColumn<Product>[] = [
  {
    key: 'name',
    header: 'Product Name',
    width: '200px',
  },
  {
    key: 'price',
    header: 'Price',
    render: (price) => `$${price.toFixed(2)}`,
  },
  {
    key: 'status',
    header: 'Status',
    render: (status) => <StatusBadge status={status} />,
    align: 'center',
  },
];

<Table
  data={products}
  columns={columns}
  isLoading={isLoading}
  error={error}
  emptyMessage="No products found"
  rowActions={(row) => (
    <>
      <Button onClick={() => handleEdit(row.id)}>Edit</Button>
      <Button variant="danger" onClick={() => handleDelete(row.id)}>Delete</Button>
    </>
  )}
/>
```

#### Pagination
Handles pagination for paginated data lists.

```tsx
import { Pagination } from '@/components';

<Pagination
  page={currentPage}
  limit={10}
  total={totalItems}
  onPageChange={setCurrentPage}
/>
```

#### SearchFilter
Reusable search and filter component.

```tsx
import { SearchFilter } from '@/components';

<SearchFilter
  searchValue={search}
  onSearchChange={setSearch}
  filterOptions={[
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ]}
  filterValue={status}
  onFilterChange={setStatus}
  filterLabel="Status"
  searchPlaceholder="Search by name..."
  onReset={() => {
    setSearch('');
    setStatus('');
  }}
/>
```

#### StatusBadge
Displays status with semantic coloring.

```tsx
import { StatusBadge } from '@/components';

// Colors: success, warning, danger, info, default
// Variants: filled, outline

<StatusBadge status="Published" color="success" variant="filled" />
<StatusBadge status="Draft" color="info" variant="outline" />
```

#### ConfirmDialog
Modal dialog for confirmations.

```tsx
import { ConfirmDialog } from '@/components';

<ConfirmDialog
  isOpen={showConfirm}
  title="Delete Product?"
  description="This action cannot be undone."
  confirmText="Delete"
  cancelText="Cancel"
  isDangerous
  isLoading={isDeleting}
  onConfirm={handleDelete}
  onCancel={() => setShowConfirm(false)}
/>
```

## Professional Patterns

### Complete Page Example

```tsx
import { useState } from 'react';
import { Plus, Trash } from '@phosphor-icons/react';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  Button,
  Table,
  type TableColumn,
  Pagination,
  ConfirmDialog,
  StatusBadge,
  SearchFilter,
} from '@/components';

function ProductsPage() {
  // State Management
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showDelete, setShowDelete] = useState(false);

  // API Queries
  const { data, isLoading, error } = useQuery({
    queryKey: ['products', page, search, status],
    queryFn: () => fetchProducts({ page, search, status }),
  });

  const deleteProduct = useMutation({
    mutationFn: (id: string) => api.delete(`/products/${id}`),
  });

  // Table Configuration
  const columns: TableColumn<Product>[] = [
    { key: 'name', header: 'Name', width: '200px' },
    { key: 'price', header: 'Price', render: (p) => `$${p}` },
    { key: 'status', header: 'Status', render: (s) => <StatusBadge status={s} /> },
  ];

  // Handlers
  const handleDelete = () => {
    deleteProduct.mutate(selectedId!, {
      onSuccess: () => {
        setShowDelete(false);
        setSelectedId(null);
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Products</h1>
        <Button icon={<Plus size={20} />}>Create</Button>
      </div>

      {/* Filters */}
      <SearchFilter
        searchValue={search}
        onSearchChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
        filterOptions={[
          { value: 'draft', label: 'Draft' },
          { value: 'published', label: 'Published' },
        ]}
        filterValue={status}
        onFilterChange={(v) => {
          setStatus(v);
          setPage(1);
        }}
        onReset={() => {
          setSearch('');
          setStatus('all');
          setPage(1);
        }}
      />

      {/* Table */}
      <Table
        data={data?.items || []}
        columns={columns}
        isLoading={isLoading}
        error={error?.message}
        rowActions={(row) => (
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              setSelectedId(row.id);
              setShowDelete(true);
            }}
            icon={<Trash size={16} />}
          />
        )}
      />

      {/* Pagination */}
      {data && (
        <Pagination
          page={page}
          limit={10}
          total={data.total}
          onPageChange={setPage}
        />
      )}

      {/* Delete Modal */}
      <ConfirmDialog
        isOpen={showDelete}
        title="Delete Product"
        description="Are you sure? This cannot be undone."
        isDangerous
        isLoading={deleteProduct.isPending}
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
      />
    </div>
  );
}
```

### Form Page Example with React Hook Form

```tsx
import { useForm, FormProvider } from 'react-hook-form';
import { Button } from '@/components';
import { FormField } from '@/components/Form';

function CreateProductForm() {
  const methods = useForm({
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      status: 'draft',
    },
  });

  const onSubmit = async (data) => {
    try {
      await api.post('/products', data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          name="name"
          label="Product Name"
          type="text"
          placeholder="Enter product name"
          required
          rules={{
            minLength: { value: 3, message: 'Min 3 characters' },
          }}
        />

        <FormField
          name="description"
          label="Description"
          type="textarea"
          charLimit={500}
          required
        />

        <FormField
          name="price"
          label="Price"
          type="number"
          required
        />

        <FormField
          name="status"
          label="Status"
          type="select"
          options={[
            { value: 'draft', label: 'Draft' },
            { value: 'published', label: 'Published' },
          ]}
        />

        <div className="flex gap-3">
          <Button type="submit" isLoading={methods.formState.isSubmitting}>
            Create Product
          </Button>
          <Button variant="outline" type="button" onClick={() => methods.reset()}>
            Reset
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
```

## Styling Guidelines

All components use Tailwind CSS with a consistent design system:

- **Colors**: Primary (Amber), Secondary (Slate), Success (Green), Danger (Red), Warning (Yellow), Info (Blue)
- **Spacing**: 4px increments via standard Tailwind scale
- **Border Radius**: 8px (lg), 6px (md), 4px (sm)
- **Typography**: Raleway (headline), Open Sans (body), DM Sans (labels)
- **States**: Hover, Active, Disabled, Loading, Error

## Component Props

All components are fully typed with TypeScript. Refer to the component files for complete prop definitions.

## Integration with API

Components are designed to work seamlessly with React Query:

```tsx
const { data, isLoading, error } = useQuery({...});
const { mutate, isPending } = useMutation({...});

<Table data={data?.items} isLoading={isLoading} error={error?.message} />
<Button isLoading={isPending}>Action</Button>
```

## Best Practices

1. **Composition Over Prop Drilling**: Use components as building blocks
2. **Type Safety**: Leverage TypeScript for all props
3. **Loading States**: Always show loading indicators
4. **Error Handling**: Display user-friendly error messages
5. **Accessibility**: Components include semantic HTML and ARIA attributes
6. **Performance**: Memoization and proper React Query integration
7. **Reusability**: Extract repeated patterns into components

## Next Steps

Replace existing pages with these components to achieve:
- Consistent UX across the admin panel
- Reduced code duplication
- Better maintainability
- Professional appearance
- Faster development
