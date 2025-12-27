# AGENTS.md - Thesivest Developer Guidelines

## Essential Commands

```bash
# Development & Build
pnpm dev              # Start dev server on port 3000
pnpm build            # Production build
pnpm preview          # Preview production build

# Testing
pnpm test             # Run all tests
pnpm test <filename>  # Run single test file (e.g., pnpm test thesis.test.ts)

# Database (Drizzle)
pnpm db:generate      # Generate migrations from schema
pnpm db:migrate       # Apply migrations to database
pnpm db:push          # Push schema directly (development)
pnpm db:pull          # Pull schema from database
pnpm db:studio        # Open Drizzle Studio UI

# Adding Components
pnpm dlx shadcn@latest add <component>  # Add shadcn/ui component
```

## Tech Stack

- **Package Manager**: pnpm (strictly - never use npm/yarn)
- **Framework**: TanStack Start (SSR with React)
- **Styling**: Tailwind CSS v4 with theme variables (no custom colors)
- **UI Library**: shadcn/ui (New York style, zinc base, CSS variables)
- **Authentication**: Better Auth with Drizzle adapter
- **Database**: PostgreSQL + Drizzle ORM
- **State**: TanStack Query
- **Routing**: TanStack Router (file-based)
- **Animation**: motion (Framer Motion)
- **Icons**: Lucide React
- **Testing**: Vitest + Testing Library

## Core Architecture Rule

**"Everything rendered has a publicly exposed API route."**

For every feature requiring data:

1. Create shared logic in `src/server/features/`
2. Create public API route in `src/routes/api/`
3. Create server loader in route file using `createServerFn`
4. Both API route and loader MUST call the same shared logic function

Example:

```typescript
// src/server/features/theses.ts - Shared logic
export async function getUnderRadarTheses(): Promise<Thesis[]> { ... }

// src/routes/api/theses.ts - Public API
export const Route = createFileRoute('/api/theses')({
  server: { handlers: { GET: async () => { ... } } }
})

// src/routes/index.tsx - Page with SSR
const getThesesFn = createServerFn({ method: "GET" }).handler(async () => {
  return getUnderRadarTheses()
})
```

## Code Style Guidelines

### Imports

- Use absolute imports with `@/` alias configured in tsconfig
- Group third-party imports, then internal imports
- No explicit type imports (inferred from usage)

```typescript
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
```

### TypeScript

- Strict mode enabled: `noUnusedLocals`, `noUnusedParameters`
- Use `interface` for shared data shapes, `type` for unions/aliases
- Explicit return types on exported functions
- Server functions: use `createServerFn({ method: "GET" })`

```typescript
export interface Thesis {
  id: string;
  title: string;
  conviction: "High" | "Medium" | "Low";
}

export async function getTheses(): Promise<Thesis[]> {
  return await db.query.thesis.findMany();
}
```

### Components

- Functional components with hooks
- Use `cn()` utility from `@/lib/utils` for className merging
- shadcn components use `class-variance-authority` for variants
- Destructure props explicitly with TypeScript types

```typescript
function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(baseClass, className)} {...props} />;
}
```

### File Organization

```
src/
  components/ui/      # shadcn components (kebab-case filenames)
  components/         # Feature components (PascalCase)
  server/features/    # Shared server logic
  routes/api/         # Public API routes
  routes/             # Page routes (file-based)
  lib/                # Utilities (utils.ts, auth.ts, etc.)
  db/                 # Database schema and client
```

### Naming Conventions

- Files: kebab-case (`my-component.tsx`, `auth-client.ts`)
- Components: PascalCase (`Button`, `Header`)
- Functions: camelCase (`getUnderRadarTheses`)
- Constants: UPPER_SNAKE_CASE (`MOCK_THESES`, `API_BASE_URL`)
- Database tables: lowercase (`user`, `session`)

### Tailwind CSS

- Always use theme variables (`bg-primary`, `text-muted-foreground`)
- Follow shadcn patterns for spacing, sizing, colors
- Use semantic color tokens: `primary`, `secondary`, `destructive`, `muted`, `accent`
- Dark mode: use `dark:` prefix when needed

### Database

- Schema in `src/db/schema.ts` using Drizzle ORM
- Use `pgTable` for table definitions
- Foreign keys: `.references(() => otherTable.id)`
- Queries: use Drizzle query builder or client

```typescript
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
});
```

### Error Handling

- Use try-catch for async operations
- Return appropriate HTTP status codes in API routes
- Validate input with Zod schemas where applicable

### Testing

- Use Vitest and Testing Library
- Test files: `*.test.ts` or `*.test.tsx` in `__tests__` or co-located
- Run single test: `pnpm test <filename>`

## Before Submitting Work

1. Run `pnpm build` - ensure production build succeeds
2. Check TypeScript compilation (strict mode)
3. Verify database migrations if schema changed: `pnpm db:push`
4. Ensure API routes work alongside SSR loaders
5. Follow theme colors from Tailwind config (no custom colors)
