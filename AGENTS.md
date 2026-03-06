# Agent Guidelines for LMS Web Monorepo

This is a pnpm monorepo using Turborepo with Next.js apps.

## Project Structure

```
apps/
  web/      - Main web application (port 3000)
  dashboard - Admin dashboard (port 3001)
  mobile    - Mobile app
packages/
  ui/             - Shared UI components
  shared/         - Shared utilities
  reduxSetup/     - Redux store configuration
  gql/            - GraphQL client/types
  tailwind-config/- Tailwind CSS configuration
  eslint-config/  - ESLint configurations
  typescript-config/ - TypeScript configurations
```

## Commands

### Root Commands (run from monorepo root)

```bash
# Build all packages/apps
pnpm build

# Run development servers
pnpm dev

# Lint all packages/apps
pnpm lint

# Type check all packages/apps
pnpm check-types

# Format code
pnpm format
```

### Individual App Commands

```bash
# Web app (apps/web)
cd apps/web
pnpm dev      # Start dev server on port 3000
pnpm build    # Build for production
pnpm lint     # Lint with ESLint
pnpm check-types  # Type check with TypeScript

# Dashboard (apps/dashboard)
cd apps/dashboard
pnpm dev      # Start dev server on port 3001
pnpm build
pnpm lint

# Single test (if tests exist)
pnpm test           # Run all tests
pnpm test -- --testPathPattern=<pattern>  # Run specific test
```

### Running a Single Test

Since this is a Next.js project, tests would typically use Vitest or Jest:

```bash
# If using Vitest
pnpm vitest run --testNamePattern="test name"

# If using Jest
pnpm jest --testNamePattern="test name"
```

## Code Style Guidelines

### General

- Use **ES modules** (`"type": "module"` in package.json)
- Use **TypeScript** for all files
- Use **Tailwind CSS v4** for styling (with `@repo/tailwind-config`)
- Use **Prettier** for formatting

### TypeScript

- Always define explicit return types for functions
- Use `interface` for object shapes, `type` for unions/intersections
- Avoid `any` - use `unknown` if type is truly unknown
- Enable strict mode (inherited from `@repo/typescript-config`)

```typescript
// Good
function getUser(id: string): Promise<User | null> {
  return db.users.findById(id);
}

// Avoid
function getUser(id) {
  return db.users.findById(id);
}
```

### React/Next.js

- Use **Next.js App Router** (`app/` directory)
- Use `"use client"` directive for client components
- Use Server Components by default, add `"use client"` only when needed
- Use `next/link` for navigation (import as `Link`)
- Use `next/image` for images

```typescript
// Client component
"use client";
import { useState } from "react";

export function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}

// Server component
export async function UserList() {
  const users = await fetchUsers();
  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}
```

### Imports

- Use absolute imports with workspace aliases (`@repo/ui`, `@repo/shared`, etc.)
- Use path aliases defined in tsconfig (`@/*` for app-specific imports)
- Order imports: external → workspace → relative

```typescript
// External
import { useState } from "react";
import Link from "next/link";

// Workspace
import { Button } from "@repo/ui";
import { useAuth } from "@repo/reduxSetup";

// Relative
import { Header } from "./components/Header";
```

### Naming Conventions

- **Components**: PascalCase (`UserList`, `SidebarNav`)
- **Files/Variables**: camelCase (`userList.ts`, `isActive`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_RETRY_COUNT`)
- **Interfaces**: PascalCase with `I` prefix optional (`User`, `UserProps`)

### Error Handling

- Use try/catch with async/await
- Return typed error results or use Error Boundaries for React
- Never expose sensitive information in error messages

```typescript
// Good
async function fetchUser(id: string): Promise<User> {
  try {
    const user = await api.getUser(id);
    return user;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new UserFetchError("Unable to load user");
  }
}
```

### CSS/Tailwind

- Use Tailwind utility classes
- Use custom CSS variables from `@repo/tailwind-config`
- Use `clsx` or template literals for conditional classes

```typescript
<div className={`base-class ${isActive ? "bg-primary" : "bg-secondary"}`} />
```

### File Organization

- Colocate related files (component + styles + tests)
- Use index files for clean exports
- Keep pages in `app/` directory following Next.js routing

### Linting

- Run `pnpm lint` before committing
- ESLint is configured with `@repo/eslint-config`
- Max warnings: 0 (enforced in web app)

### Git Conventions

- Use meaningful commit messages
- Create feature branches for new features
- Run `pnpm lint` and `pnpm check-types` before pushing

## Environment Variables

- Never commit `.env` files or secrets
- Use `.env.local` for local development
- Prefix variables with appropriate app (`NEXT_PUBLIC_` for client-side)

## Additional Notes

- This codebase uses **Apollo Client** for GraphQL
- Uses **Redux Toolkit** via `@repo/reduxSetup` for state management
- Uses **React Query** (`@tanstack/react-query`) for data fetching
- Uses **Tiptap** for rich text editing
- Uses **Flowbite React** for UI components
