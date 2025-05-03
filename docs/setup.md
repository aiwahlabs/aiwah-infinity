## Executive Summary

This guide walks you through building a **Next.js 14** application that shares authentication with **Supabase** using cookie‑based sessions, applies **Row‑Level Security (RLS)** on selected tables, and ships with the **vanilla Saas UI default theme** so you can add new screens with almost zero custom styling. The workflow assumes you already have an empty Git repository and a Supabase project; all steps happen *in‑place* inside that repo.

---

## 1  Prerequisites

* **Node ≥ 20**, **pnpm ≥ 8** (or npm/yarn)
* **Supabase CLI** installed globally – `npm i -g supabase`
* Supabase project created in the dashboard and `SUPABASE_URL` / `SUPABASE_ANON_KEY` at hand
* Access to the **Supabase MCP server** on Cursor (for auto‑regenerating database types)

> Tip – authenticate the CLI once to avoid re‑entering tokens: `supabase login`. ([supabase.com](https://supabase.com/docs/reference/javascript/typescript-support?utm_source=chatgpt.com))

---

## 2  Scaffold the Next.js App

```bash
# inside the existing repo root
pnpm create next-app@latest . --ts --app --eslint --tailwind=false
```

* We avoid Tailwind because Saas UI ships its own Chakra‑based styling. ([saas-ui.dev](https://saas-ui.dev/docs/core/installation/nextjs-guide?utm_source=chatgpt.com))

Create a `.nvmrc` (optional) and commit.

---

## 3  Install Core Dependencies

```bash
pnpm add @supabase/ssr @supabase/auth-helpers-nextjs @supabase/supabase-js
pnpm add @saas-ui/react @chakra-ui/react @chakra-ui/next-js @emotion/react @emotion/styled framer-motion
```

* `@supabase/ssr` handles token storage in **HTTP‑only cookies**, keeping client and server sessions in sync ([supabase.com](https://supabase.com/docs/guides/auth/server-side/advanced-guide?utm_source=chatgpt.com)).
* Saas UI packages bring an opinionated Chakra extension with a ready‑to‑use default theme ([saas-ui.dev](https://saas-ui.dev/docs/core/theming/saas-ui-theme?utm_source=chatgpt.com)).

For TypeScript safety add:

```bash
pnpm add -D @types/node @types/react
```

---

## 4  Environment Variables

Create `.env.local` (never commit):

```bash
NEXT_PUBLIC_SUPABASE_URL=...   # from Supabase settings
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...  # **server‑only**
COOKIE_NAME=supabase-auth-token
```

The `SERVICE_ROLE_KEY` is required for the RLS‑aware backend helpers you’ll add in `/lib/supabase/server.ts`.

---

## 5  Supabase Project Setup

### 5.1 Enable Password‑Based Auth

1. **Dashboard → Authentication → Providers → Email** → enable.
2. Set redirect URL to `http://localhost:3000/auth/callback` for dev ([supabase.com](https://supabase.com/docs/guides/auth/passwords?utm_source=chatgpt.com)).

### 5.2 Create Tables & Policies

Example: `profiles` is public, RLS off; `orders` is private, RLS on.

```sql
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  amount numeric not null
);
```

```sql
alter table public.orders enable row level security;
create policy "Orders are visible only to owner" on public.orders
  for select using ( auth.uid() = user_id );
```

RLS rules live in migrations so they travel with the repo ([supabase.com](https://supabase.com/docs/guides/database/postgres/row-level-security?utm_source=chatgpt.com), [supabase.com](https://supabase.com/features/row-level-security?utm_source=chatgpt.com)).

---

## 6  Generate TypeScript Types (Supabase MCP)

The CLI introspects the local shadow DB started by the MCP server.

```bash
supabase gen types typescript --local > lib/database.types.ts
```

Run this after every migration (or let Cursor’s MCP watch do it automatically). ([supabase.com](https://supabase.com/docs/guides/api/rest/generating-types?utm_source=chatgpt.com), [supabase.com](https://supabase.com/docs/reference/javascript/typescript-support?utm_source=chatgpt.com))

Add to `tsconfig.json` paths for absolute imports:

```json
{"compilerOptions": {"paths": {"@/db": ["lib/database.types.ts"]}}}
```

---

## 7  Shared Auth Implementation

### 7.1 Supabase Client Helpers

`/lib/supabase/browser.ts`:

```ts
import { createBrowserClient } from '@supabase/ssr';
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

`/lib/supabase/server.ts` (Edge‑friendly):

```ts
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
export const supabaseServer = () =>
  createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: () => cookies() }
  );
```

This pattern mirrors the official advanced guide for cookie storage ([supabase.com](https://supabase.com/docs/guides/auth/server-side/advanced-guide?utm_source=chatgpt.com)).

### 7.2 Middleware to Refresh Session

`middleware.ts`:

```ts
import { supabaseServer } from '@/lib/supabase/server';
export async function middleware() {
  const supabase = supabaseServer();
  await supabase.auth.getUser();  // refreshes cookies silently
  return Response.next();
}
export const config = { matcher: ['/((?!_next).*)'] };
```

### 7.3 Auth Routes

Use Saas UI’s `Auth` package (built on Chakra) to avoid bespoke UI:

```tsx
// app/login/page.tsx
'use client';
import { Auth } from '@saas-ui/react';
import { supabase } from '@/lib/supabase/browser';
export default function Login() {
  return <Auth supabaseClient={supabase} providers={[]} />;
}
```

The component already contains email + password flows, validation, and Chakra styling; no CSS added ([saas-ui.dev](https://saas-ui.dev/nextjs-starter-kit?utm_source=chatgpt.com)).

---

## 8  Saas UI Provider & Theme

In `app/layout.tsx` wrap the tree:

```tsx
import { SaasProvider, theme as saasTheme } from '@saas-ui/react';
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SaasProvider theme={saasTheme}>{children}</SaasProvider>
      </body>
    </html>
  );
}
```

* The vanilla theme inherits Chakra tokens and looks polished out‑of‑the‑box ([saas-ui.dev](https://saas-ui.dev/docs/core/theming/saas-ui-theme?utm_source=chatgpt.com), [saas-ui.dev](https://saas-ui.dev/docs/core/theming/customize-theme?utm_source=chatgpt.com)).
* Customising brand colors later is a single `extendTheme` call.

---

## 9  Boilerplate Directory Structure

```
├─ app/
│  ├─ layout.tsx        # SaasProvider wrapper
│  ├─ page.tsx          # landing
│  └─ login/
│     └─ page.tsx       # Auth component
├─ lib/
│  └─ supabase/
│     ├─ browser.ts
│     └─ server.ts
├─ middleware.ts
├─ migrations/          # generated by supabase db diff
├─ supabase/            # local dev postgres & config
├─ lib/database.types.ts
└─ README.md
```

The structure mirrors community Next + Supabase starters while staying minimal ([github.com](https://github.com/imbhargav5/nextbase-nextjs-supabase-starter?utm_source=chatgpt.com), [vercel.com](https://vercel.com/templates/next.js/supabase?utm_source=chatgpt.com)).

---

## 10  Scripts & Dev Workflow

Add to `package.json`:

```json
{"scripts": {
  "dev": "next dev",
  "db:start": "supabase start",
  "db:gen": "supabase gen types typescript --local > lib/database.types.ts",
  "db:mig": "supabase migration new && supabase db reset --linked",
  "deploy": "next build && next start"
}}
```

1. `pnpm db:start` – starts Postgres, Studio, and the MCP codegen watcher.
2. Make schema changes → `pnpm db:mig` → codegen runs.
3. `pnpm dev` – Next.js picks up `COOKIE_NAME` and shares session with Supabase.

---

## 11  Selective RLS Off/On Pattern

When some tables must stay public (e.g., feature flags):

```sql
alter table public.flags disable row level security;
grant select on public.flags to anon;
```

Maintain a policy matrix file (`/docs/security-matrix.md`) and automate linting in CI.

---

## 12  Deployment

* **Vercel**: add the three env vars in project settings; choose the Postgres Connection Pooler string for production ([vercel.com](https://vercel.com/templates/next.js/supabase?utm_source=chatgpt.com)).
* **Docker Compose** (self‑host): reuse `supabase start` services and add your Next.js container.

---

## 13  Next Steps

1. **Testing:** integrate `@supabase/cli`’s `supabase test db ...` for CI.
2. **Access Control:** add role‑based front‑end guards via Saas UI’s `useAuth` hook.
3. **Branding:** extend the Saas UI theme tokens once the MVP UX stabilises.

---

### Further Reading

* Supabase Advanced SSR Auth Guide ([supabase.com](https://supabase.com/docs/guides/auth/server-side/advanced-guide?utm_source=chatgpt.com))
* Generating Types ([supabase.com](https://supabase.com/docs/guides/api/rest/generating-types?utm_source=chatgpt.com))
* Saas UI Next.js installation ([saas-ui.dev](https://saas-ui.dev/docs/core/installation/nextjs-guide?utm_source=chatgpt.com))
* RLS deep dive ([supabase.com](https://supabase.com/docs/guides/database/postgres/row-level-security?utm_source=chatgpt.com))

> *You now have a production‑grade skeleton with shared Supabase auth, type‑safe queries, RLS, and a polished default UI—ready to grow without accumulating custom CSS.*
