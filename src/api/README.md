# Admin Frontend API Structure

This directory contains all API integration code for the admin dashboard, organized by feature module.

## Folder Structure

```
api/
├── index.ts              # Main axios instance configuration
├── exports.ts            # Centralized API exports (import from here!)
├── utils.ts              # Generic API utilities and hooks factory
├── types.ts              # Shared API types
├── admin/
│   ├── index.ts          # Admin module exports
│   ├── client.ts         # Admin authentication API client
│   ├── hooks.ts          # Admin auth hooks (useAdminAuth)
│   ├── management-client.ts  # Legacy management client
│   ├── endpoints.ts      # Auth endpoints
│   ├── types.ts          # Auth types
│   ├── users/            # Users management module
│   │   ├── index.ts
│   │   ├── client.ts
│   │   ├── endpoints.ts
│   │   ├── types.ts
│   │   └── hooks/
│   │       └── index.ts  # User hooks
│   ├── sellers/          # Sellers management module
│   │   ├── index.ts
│   │   ├── client.ts
│   │   ├── endpoints.ts
│   │   ├── types.ts
│   │   └── hooks/
│   │       └── index.ts  # Seller hooks
│   ├── orders/           # Orders management module
│   │   ├── index.ts
│   │   ├── client.ts
│   │   ├── endpoints.ts
│   │   ├── types.ts
│   │   └── hooks/
│   │       └── index.ts  # Order hooks
│   └── products/         # Products management module
│       ├── index.ts
│       ├── client.ts
│       ├── endpoints.ts
│       ├── types.ts
│       └── hooks/
│           └── index.ts  # Product hooks
└── [other api modules...]
```

## Usage Patterns

### Import Hooks
Always import hooks from the exports.ts file at the root of the api folder:

```typescript
import { 
  useAdminUsersList, 
  useAdminCreateUser,
  useAdminProductsList,
  useAdminAuth 
} from '@/api/exports';

function Dashboard() {
  const { user } = useAdminAuth();
  const { products } = useAdminProductsList();
  
  return <div>{/* content */}</div>;
}
```

Or import from individual module exports:

```typescript
import { useAdminUsersList } from '@/api/admin/users';
import { useAdminProductsList } from '@/api/admin/products';
```

### Import Types
```typescript
import type { 
  AdminUsersListParams, 
  AdminUserCreateInput,
  AdminProductsListParams 
} from '@/api/exports';
```

### Basic API Calls
```typescript
import { apiMethods } from '@/api/exports';

// GET request
const data = await apiMethods.get('/endpoint');

// POST request
const response = await apiMethods.post('/endpoint', { data });

// File upload
const result = await apiMethods.upload('/upload', formData);
```

### Creating Custom API Services
```typescript
import { ApiService } from '@/api/exports';

const service = new ApiService('/admin/custom');

// Use generic methods
const all = await service.getAll();
const one = await service.getById(1);
await service.create({ name: 'Test' });
```

## Module Organization

Each module (users, sellers, orders, products) follows this structure:

- **client.ts** - API service methods (actual HTTP calls)
- **endpoints.ts** - URL endpoint definitions
- **types.ts** - TypeScript interfaces and types
- **hooks/index.ts** - React Query hooks for that module
- **index.ts** - Public exports for the module

### Module Pattern Example (Users)
```
users/
├── index.ts              # export * from each file
├── client.ts             # adminUsersApi object with CRUD methods
├── endpoints.ts          # ADMIN_USERS_URL, ADMIN_USER_DETAIL_URL, etc.
├── types.ts              # AdminUsersListParams, AdminUserCreateInput, etc.
└── hooks/
    └── index.ts          # useAdminUsersList, useAdminCreateUser, etc.
```

## Authentication

Authentication is handled through HttpOnly cookies. The `apiClient` automatically:
- Sends credentials with requests (`withCredentials: true`)
- Maintains session state
- Does NOT redirect on 401 (auth services handle this)

Use `useAdminAuth()` hook to get current user and authentication state:

```typescript
import { useAdminAuth } from '@/api/exports';

function MyComponent() {
  const { user, isAuthenticated, isLoading, loginMutation, logoutMutation } = useAdminAuth();
  
  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {isAuthenticated && <p>Welcome, {user?.name}</p>}
      {!isAuthenticated && <button onClick={() => loginMutation.mutate(...)}>Login</button>}
    </div>
  );
}
```

## Error Handling

All API calls throw errors that should be caught and handled by the component or service layer.

```typescript
try {
  const users = await useAdminUsersList().refetch();
} catch (error) {
  console.error('Failed to fetch users:', error);
}
```

## React Query Configuration

All hooks use React Query with proper:
- **queryKey** - Unique identifiers for caching
- **staleTime** - How long data is considered fresh
- **gcTime** - How long cached data persists
- **retry** - Number of retry attempts on failure
- **enabled** - Conditional query execution

Example cache times by module:
- **Users/Sellers/Products**: 5 minutes stale time
- **Orders**: 2 minutes stale time (more time-sensitive)
- **Auth**: 5 minutes stale time

## Best Practices

1. ✅ Import hooks from `@/api/exports`
2. ✅ Import types from `@/api/exports`
3. ✅ Keep API logic in client.ts files
4. ✅ Keep hooks in hooks/ folders
5. ✅ Use TypeScript types for all API responses
6. ✅ Handle loading and error states in components
7. ❌ Never make direct HTTP calls in components
8. ❌ Don't mix API logic with component logic

## Future Extensions

When adding new API modules:
1. Create new folder under admin/ (e.g., `admin/reports/`)
2. Create client.ts, endpoints.ts, types.ts, hooks/index.ts structure
3. Create index.ts that exports from each file
4. Update admin/index.ts to export from new module
5. Update api/exports.ts to include new exports

