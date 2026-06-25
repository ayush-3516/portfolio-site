# Portfolio Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Ayush Chaudhari's portfolio site from the approved `Ayush Portfolio.dc.html` design as a Next.js 15 + Payload CMS 3.x monorepo.

**Architecture:** Payload 3.x runs natively inside Next.js — one repo, one Vercel deployment. The Payload local API is called directly from server components (no HTTP). All content (projects, blog posts, hero, stack, timeline, metrics) is managed in Payload's built-in admin UI at `/admin`.

**Tech Stack:** Next.js 15 (App Router), Payload CMS 3.x, TypeScript, MongoDB Atlas, Tailwind CSS v4, `next/font/google`

## Global Constraints

- Node ≥ 20
- TypeScript strict mode
- Payload 3.x local API only — never `fetch('/api/...')` from server components
- All theme colors via CSS custom properties — never hardcode hex values in components
- Fonts: Inter, Inter Tight, JetBrains Mono via `next/font/google` only
- Tailwind v4 for layout/spacing; CSS vars for color
- `revalidate: 60` on all index/domain pages; `revalidate: 3600` on slug pages
- No comments in code unless the WHY is non-obvious

---

## File Map

| File | Responsibility |
|---|---|
| `src/payload.config.ts` | Payload config: DB adapter, collections, globals, admin, storage |
| `src/collections/Projects.ts` | Projects collection schema |
| `src/collections/BlogPosts.ts` | BlogPosts collection schema |
| `src/collections/Tags.ts` | Tags collection schema |
| `src/collections/Media.ts` | Media collection (Payload built-in wrapper) |
| `src/globals/HeroContent.ts` | Hero global schema |
| `src/globals/SiteSettings.ts` | Site-wide settings global |
| `src/globals/StackSection.ts` | Tech stack grid global |
| `src/globals/MetricsBand.ts` | Animated counter values global |
| `src/globals/Timeline.ts` | Experience timeline global |
| `src/lib/payload.ts` | `getCachedPayload()` helper — singleton Payload client |
| `src/app/globals.css` | CSS custom properties, dark/light, domain accents, font faces |
| `src/components/ThemeProvider.tsx` | Client: reads localStorage, sets `class` on `<html>` |
| `src/components/ThemeToggle.tsx` | Client: sun/moon button |
| `src/components/Nav.tsx` | Server shell + client active-tab wrapper |
| `src/components/Footer.tsx` | Server: email, GitHub, location |
| `src/components/AnimatedCounter.tsx` | Client: rAF cubic-ease counter |
| `src/components/Typewriter.tsx` | Client: setInterval typewriter |
| `src/components/ProjectCard.tsx` | Server: project card UI |
| `src/components/RichText.tsx` | Server: Lexical rich-text renderer wrapper |
| `src/components/TocSidebar.tsx` | Client: scroll-tracking TOC |
| `src/app/(frontend)/layout.tsx` | Frontend layout: Nav, Footer, ThemeProvider, flash-prevention script |
| `src/app/(frontend)/page.tsx` | Home page (ISR 60s) |
| `src/app/(frontend)/ai/page.tsx` | AI domain page (ISR 60s) |
| `src/app/(frontend)/backend/page.tsx` | Backend domain page (ISR 60s) |
| `src/app/(frontend)/web3/page.tsx` | Web3 domain page (ISR 60s) |
| `src/app/(frontend)/blog/page.tsx` | Blog index (ISR 60s) |
| `src/app/(frontend)/blog/[slug]/page.tsx` | Article page (SSG + ISR 3600s) |
| `src/app/(frontend)/work/[slug]/page.tsx` | Case study page (SSG + ISR 3600s) |
| `src/app/(frontend)/not-found.tsx` | 404 page |
| `src/app/(frontend)/error.tsx` | Error boundary |
| `src/app/(payload)/admin/[[...segments]]/page.tsx` | Payload admin (auto-generated, do not edit) |
| `src/app/api/[...slug]/route.ts` | Payload REST API handler |
| `src/app/sitemap.ts` | Auto-generated sitemap from published slugs |
| `src/app/robots.ts` | robots.txt: allow all, disallow /admin |
| `src/app/opengraph-image.tsx` | Static OG image |

---

### Task 1: Project Scaffolding

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `.env.local`, `.env.example`, `tailwind.config.ts`, `postcss.config.mjs`

**Interfaces:**
- Produces: working `pnpm dev` that starts Next.js + Payload together

- [ ] **Step 1: Scaffold with Payload's official Next.js template**

```bash
cd /home/ayush/github/portfolio-site
pnpx create-payload-app@latest . --template blank --db mongodb --no-git
```

When prompted:
- Project name: `portfolio-site`
- Accept defaults for everything else

- [ ] **Step 2: Verify the scaffold installed correctly**

```bash
pnpm dev
```

Expected: server starts on `http://localhost:3000`, Payload admin at `http://localhost:3000/admin`. No TypeScript errors. Stop the server with Ctrl+C.

- [ ] **Step 3: Add Tailwind CSS v4**

```bash
pnpm add tailwindcss@next @tailwindcss/postcss@next
```

Create `postcss.config.mjs`:
```js
const config = { plugins: { '@tailwindcss/postcss': {} } }
export default config
```

Create `tailwind.config.ts`:
```ts
import type { Config } from 'tailwindcss'
const config: Config = { content: ['./src/**/*.{ts,tsx}'] }
export default config
```

- [ ] **Step 4: Add Google Fonts package (already in next, just verify)**

```bash
pnpm list next | grep next
```

Expected: next 15.x listed.

- [ ] **Step 5: Create `.env.local` and `.env.example`**

`.env.local`:
```
DATABASE_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/portfolio?retryWrites=true&w=majority
PAYLOAD_SECRET=replace-with-32-char-random-string
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

`.env.example`:
```
DATABASE_URI=
PAYLOAD_SECRET=
NEXT_PUBLIC_SITE_URL=
```

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: scaffold Next.js 15 + Payload CMS 3.x monorepo"
```

---

### Task 2: Payload Collections & Globals

**Files:**
- Create: `src/collections/Tags.ts`
- Create: `src/collections/Media.ts`
- Create: `src/collections/Projects.ts`
- Create: `src/collections/BlogPosts.ts`
- Create: `src/globals/HeroContent.ts`
- Create: `src/globals/SiteSettings.ts`
- Create: `src/globals/StackSection.ts`
- Create: `src/globals/MetricsBand.ts`
- Create: `src/globals/Timeline.ts`
- Modify: `src/payload.config.ts`

**Interfaces:**
- Produces: `payload-types.ts` auto-generated by Payload with types: `Project`, `BlogPost`, `Tag`, `Media`, `HeroContent`, `SiteSettings`, `StackSection`, `MetricsBand`, `Timeline`

- [ ] **Step 1: Create `src/collections/Tags.ts`**

```ts
import type { CollectionConfig } from 'payload'

export const Tags: CollectionConfig = {
  slug: 'tags',
  admin: { useAsTitle: 'name' },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { description: 'Lowercase, hyphenated. e.g. "ai-llm"' },
    },
    { name: 'color', type: 'text', admin: { description: 'Hex color e.g. #8b5cf6' } },
  ],
}
```

- [ ] **Step 2: Create `src/collections/Media.ts`**

```ts
import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  upload: true,
  fields: [{ name: 'alt', type: 'text' }],
}
```

- [ ] **Step 3: Create `src/collections/Projects.ts`**

```ts
import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'domain', 'status', 'updatedAt'] },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { description: 'Auto-fill from title. e.g. "meraki"' },
    },
    {
      name: 'domain',
      type: 'select',
      required: true,
      options: [
        { label: 'AI / LLM', value: 'ai' },
        { label: 'Backend', value: 'backend' },
        { label: 'Web3', value: 'web3' },
        { label: 'Full Stack', value: 'fullstack' },
      ],
    },
    { name: 'tag', type: 'text', admin: { description: 'e.g. FLAGSHIP, RAG, AGENTS' } },
    { name: 'metric', type: 'text', admin: { description: 'e.g. 50K+ leads' } },
    { name: 'excerpt', type: 'textarea', required: true },
    { name: 'stack', type: 'text', admin: { description: 'e.g. Python · Flask · MongoDB' } },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Published', value: 'published' },
        { label: 'Draft', value: 'draft' },
        { label: 'Scheduled', value: 'scheduled' },
      ],
    },
    { name: 'scheduledAt', type: 'date', admin: { condition: (data) => data.status === 'scheduled' } },
    { name: 'featured', type: 'checkbox', defaultValue: false, admin: { description: 'Show on Home page' } },
    { name: 'body', type: 'richText', editor: lexicalEditor({}) },
    { name: 'order', type: 'number', defaultValue: 0, admin: { description: 'Lower = first' } },
  ],
}
```

- [ ] **Step 4: Create `src/collections/BlogPosts.ts`**

```ts
import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const BlogPosts: CollectionConfig = {
  slug: 'blog-posts',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'tag', 'status', 'publishedAt'] },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { description: 'e.g. "rag-across-40-languages"' },
    },
    { name: 'tag', type: 'relationship', relationTo: 'tags' },
    { name: 'readTime', type: 'text', admin: { description: 'e.g. "8 min"' } },
    { name: 'excerpt', type: 'textarea', required: true },
    { name: 'publishedAt', type: 'date' },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Published', value: 'published' },
        { label: 'Draft', value: 'draft' },
        { label: 'Scheduled', value: 'scheduled' },
      ],
    },
    { name: 'body', type: 'richText', editor: lexicalEditor({}) },
    {
      name: 'relatedPosts',
      type: 'relationship',
      relationTo: 'blog-posts',
      hasMany: true,
      maxRows: 3,
    },
  ],
}
```

- [ ] **Step 5: Create `src/globals/HeroContent.ts`**

```ts
import type { GlobalConfig } from 'payload'

export const HeroContent: GlobalConfig = {
  slug: 'hero-content',
  fields: [
    { name: 'headline', type: 'text', required: true },
    { name: 'subheadline', type: 'textarea', required: true },
    { name: 'locationLine', type: 'text', required: true },
    { name: 'statusBadgeText', type: 'text', required: true },
    { name: 'terminalCode', type: 'textarea', required: true },
  ],
}
```

- [ ] **Step 6: Create `src/globals/SiteSettings.ts`**

```ts
import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  fields: [
    { name: 'email', type: 'email', required: true },
    { name: 'githubUrl', type: 'text', required: true },
    { name: 'resumeUrl', type: 'text' },
    { name: 'metaTitle', type: 'text', required: true },
    { name: 'metaDescription', type: 'textarea', required: true },
  ],
}
```

- [ ] **Step 7: Create `src/globals/StackSection.ts`**

```ts
import type { GlobalConfig } from 'payload'

export const StackSection: GlobalConfig = {
  slug: 'stack-section',
  fields: [
    {
      name: 'groups',
      type: 'array',
      fields: [
        { name: 'domain', type: 'text', required: true },
        {
          name: 'items',
          type: 'array',
          fields: [{ name: 'item', type: 'text', required: true }],
        },
      ],
    },
  ],
}
```

- [ ] **Step 8: Create `src/globals/MetricsBand.ts`**

```ts
import type { GlobalConfig } from 'payload'

export const MetricsBand: GlobalConfig = {
  slug: 'metrics-band',
  fields: [
    { name: 'm1Value', type: 'text', required: true, admin: { description: 'e.g. 50000' } },
    { name: 'm1Label', type: 'text', required: true, admin: { description: 'e.g. leads co-managed' } },
    { name: 'm2Value', type: 'text', required: true },
    { name: 'm2Label', type: 'text', required: true },
    { name: 'm3Value', type: 'text', required: true },
    { name: 'm3Label', type: 'text', required: true },
    { name: 'm4Value', type: 'text', required: true },
    { name: 'm4Label', type: 'text', required: true },
  ],
}
```

- [ ] **Step 9: Create `src/globals/Timeline.ts`**

```ts
import type { GlobalConfig } from 'payload'

export const Timeline: GlobalConfig = {
  slug: 'timeline',
  fields: [
    {
      name: 'entries',
      type: 'array',
      fields: [
        { name: 'time', type: 'text', required: true },
        { name: 'role', type: 'text', required: true },
        { name: 'org', type: 'text', required: true },
        { name: 'place', type: 'text', required: true },
      ],
    },
  ],
}
```

- [ ] **Step 10: Register everything in `src/payload.config.ts`**

```ts
import { buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'
import { Projects } from './collections/Projects'
import { BlogPosts } from './collections/BlogPosts'
import { Tags } from './collections/Tags'
import { Media } from './collections/Media'
import { HeroContent } from './globals/HeroContent'
import { SiteSettings } from './globals/SiteSettings'
import { StackSection } from './globals/StackSection'
import { MetricsBand } from './globals/MetricsBand'
import { Timeline } from './globals/Timeline'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: { user: 'users' },
  collections: [Projects, BlogPosts, Tags, Media],
  globals: [HeroContent, SiteSettings, StackSection, MetricsBand, Timeline],
  editor: lexicalEditor({}),
  db: mongooseAdapter({ url: process.env.DATABASE_URI! }),
  secret: process.env.PAYLOAD_SECRET!,
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
})
```

- [ ] **Step 11: Generate types and verify**

```bash
pnpm payload generate:types
```

Expected: `src/payload-types.ts` created with interfaces `Project`, `BlogPost`, `Tag`, `Media`, `HeroContent`, `SiteSettings`, `StackSection`, `MetricsBand`, `Timeline`.

- [ ] **Step 12: Start dev and verify admin shows all collections/globals**

```bash
pnpm dev
```

Open `http://localhost:3000/admin`. Expected: sidebar shows Projects, Blog Posts, Tags, Media under Collections; HeroContent, SiteSettings, StackSection, MetricsBand, Timeline under Globals. Stop server.

- [ ] **Step 13: Commit**

```bash
git add src/collections src/globals src/payload.config.ts src/payload-types.ts
git commit -m "feat: add Payload collections (Projects, BlogPosts, Tags, Media) and globals"
```

---

### Task 3: Payload Local API Helper & CSS Foundation

**Files:**
- Create: `src/lib/payload.ts`
- Modify: `src/app/globals.css`

**Interfaces:**
- Produces: `getCachedPayload()` → `Payload` — used by all server components in Tasks 5–10

- [ ] **Step 1: Create `src/lib/payload.ts`**

```ts
import { getPayload } from 'payload'
import { cache } from 'react'
import config from '@payload-config'

export const getCachedPayload = cache(async () => {
  return getPayload({ config })
})
```

The `cache()` wrapper from React deduplicates calls within a single render pass — only one DB connection per request.

- [ ] **Step 2: Replace `src/app/globals.css` with design-exact CSS variables**

```css
@import "tailwindcss";

:root {
  --bg: #f7f7f4;
  --nav: rgba(247, 247, 244, 0.78);
  --surface: #ffffff;
  --surface-2: #f0f1ed;
  --border: rgba(0, 0, 0, 0.09);
  --ink: #0e0f14;
  --muted: #525864;
  --faint: #9398a3;
  --accent: #4f46e5;
  --accent-soft: rgba(79, 70, 229, 0.09);
}

.dark {
  --bg: #0a0b0f;
  --nav: rgba(10, 11, 15, 0.72);
  --surface: #13151d;
  --surface-2: #1b1e29;
  --border: rgba(255, 255, 255, 0.08);
  --ink: #f4f5f8;
  --muted: #9aa0b0;
  --faint: #666c7c;
  --accent: #6366f1;
  --accent-soft: rgba(99, 102, 241, 0.12);
}

[data-domain="ai"] {
  --accent: #8b5cf6;
  --accent-soft: rgba(139, 92, 246, 0.12);
}

[data-domain="backend"] {
  --accent: #38bdf8;
  --accent-soft: rgba(56, 189, 248, 0.13);
}

.dark [data-domain="backend"] {
  --accent: #38bdf8;
}

:root [data-domain="backend"] {
  --accent: #0284c7;
  --accent-soft: rgba(2, 132, 199, 0.1);
}

[data-domain="web3"] {
  --accent: #f5b942;
  --accent-soft: rgba(245, 185, 66, 0.13);
}

.dark [data-domain="web3"] {
  --accent: #f5b942;
}

:root [data-domain="web3"] {
  --accent: #c2820a;
  --accent-soft: rgba(194, 130, 10, 0.1);
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-inter), sans-serif;
  -webkit-font-smoothing: antialiased;
  background: var(--bg);
  color: var(--ink);
  min-height: 100vh;
  transition: background 0.3s;
}

::selection {
  background: rgba(99, 102, 241, 0.3);
}

::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

::-webkit-scrollbar-thumb {
  background: rgba(128, 128, 128, 0.3);
  border-radius: 8px;
}

@keyframes rise {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes blink {
  0%, 49%  { opacity: 1; }
  50%, 100% { opacity: 0; }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/payload.ts src/app/globals.css
git commit -m "feat: add Payload local API helper and CSS design tokens"
```

---

### Task 4: ThemeProvider, ThemeToggle, Nav, Footer Components

**Files:**
- Create: `src/components/ThemeProvider.tsx`
- Create: `src/components/ThemeToggle.tsx`
- Create: `src/components/NavClient.tsx`
- Create: `src/components/Nav.tsx`
- Create: `src/components/Footer.tsx`

**Interfaces:**
- Consumes: CSS vars from `globals.css`
- Produces:
  - `<ThemeProvider>` — wraps children, provides theme context
  - `<ThemeToggle>` — standalone button
  - `<Nav githubUrl email resumeUrl>` — full sticky nav
  - `<Footer email githubUrl>` — site footer

- [ ] **Step 1: Create `src/components/ThemeProvider.tsx`**

```tsx
'use client'
import { createContext, useContext, useEffect, useState, useCallback } from 'react'

type Theme = 'dark' | 'light'
const ThemeContext = createContext<{ theme: Theme; toggle: () => void }>({
  theme: 'dark',
  toggle: () => {},
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark')

  useEffect(() => {
    const stored = localStorage.getItem('theme') as Theme | null
    const resolved = stored ?? 'dark'
    setTheme(resolved)
    document.documentElement.classList.toggle('dark', resolved === 'dark')
  }, [])

  const toggle = useCallback(() => {
    setTheme((t) => {
      const next = t === 'dark' ? 'light' : 'dark'
      localStorage.setItem('theme', next)
      document.documentElement.classList.toggle('dark', next === 'dark')
      return next
    })
  }, [])

  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => useContext(ThemeContext)
```

- [ ] **Step 2: Create `src/components/ThemeToggle.tsx`**

```tsx
'use client'
import { useTheme } from './ThemeProvider'

export function ThemeToggle() {
  const { theme, toggle } = useTheme()
  return (
    <button
      onClick={toggle}
      style={{
        width: 36,
        height: 36,
        borderRadius: 10,
        border: '1px solid var(--border)',
        background: 'var(--surface)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        color: 'var(--muted)',
        fontSize: 15,
      }}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? '☀' : '☾'}
    </button>
  )
}
```

- [ ] **Step 3: Create `src/components/NavClient.tsx`**

This handles active-tab highlighting (needs `usePathname` — client only).

```tsx
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ThemeToggle } from './ThemeToggle'

const tabs = [
  { label: 'Portfolio', href: '/' },
  { label: 'AI', href: '/ai' },
  { label: 'Backend', href: '/backend' },
  { label: 'Web3', href: '/web3' },
]

function tabStyle(active: boolean) {
  return {
    padding: '7px 13px',
    borderRadius: 8,
    fontSize: 13,
    fontWeight: active ? 600 : 500,
    color: active ? 'var(--ink)' : 'var(--muted)',
    background: active ? 'var(--surface)' : 'transparent',
    fontFamily: "'Inter Tight', sans-serif",
    cursor: 'pointer',
    textDecoration: 'none',
    boxShadow: active ? '0 1px 3px rgba(0,0,0,.15)' : 'none',
  } as React.CSSProperties
}

function linkStyle(active: boolean) {
  return {
    padding: '7px 12px',
    borderRadius: 8,
    fontSize: 13,
    fontWeight: active ? 600 : 500,
    color: active ? 'var(--ink)' : 'var(--muted)',
    fontFamily: "'Inter Tight', sans-serif",
    cursor: 'pointer',
    textDecoration: 'none',
  } as React.CSSProperties
}

export function NavClient({
  githubUrl,
  resumeUrl,
  email,
}: {
  githubUrl: string
  resumeUrl: string
  email: string
}) {
  const pathname = usePathname()

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        gap: 24,
        padding: '14px 36px',
        background: 'var(--nav)',
        backdropFilter: 'blur(18px)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 9,
            background: 'linear-gradient(140deg, var(--accent), #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'Inter Tight', sans-serif",
            fontWeight: 800,
            color: '#fff',
            fontSize: 15,
          }}
        >
          A
        </div>
        <span
          style={{
            fontFamily: "'Inter Tight', sans-serif",
            fontWeight: 700,
            fontSize: 15,
            color: 'var(--ink)',
            letterSpacing: '-0.02em',
          }}
        >
          Ayush Chaudhari
        </span>
      </Link>

      <div style={{ flex: 1 }} />

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          padding: 4,
          background: 'var(--surface-2)',
          border: '1px solid var(--border)',
          borderRadius: 11,
        }}
      >
        {tabs.map((t) => (
          <Link key={t.href} href={t.href} style={tabStyle(pathname === t.href)}>
            {t.label}
          </Link>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Link href="/blog" style={linkStyle(pathname.startsWith('/blog'))}>Blog</Link>
        <a href="/admin" style={linkStyle(false)}>Admin</a>
      </div>

      <ThemeToggle />

      <a
        href={`mailto:${email}`}
        style={{
          padding: '9px 18px',
          borderRadius: 10,
          background: 'var(--ink)',
          color: 'var(--bg)',
          fontSize: 13,
          fontWeight: 600,
          fontFamily: "'Inter Tight', sans-serif",
          textDecoration: 'none',
        }}
      >
        Contact
      </a>
    </nav>
  )
}
```

- [ ] **Step 4: Create `src/components/Nav.tsx`**

```tsx
import { NavClient } from './NavClient'

export function Nav({
  email,
  githubUrl,
  resumeUrl,
}: {
  email: string
  githubUrl: string
  resumeUrl: string
}) {
  return <NavClient email={email} githubUrl={githubUrl} resumeUrl={resumeUrl} />
}
```

- [ ] **Step 5: Create `src/components/Footer.tsx`**

```tsx
export function Footer({ email, githubUrl }: { email: string; githubUrl: string }) {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--border)',
        padding: '30px 36px',
        textAlign: 'center',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 12,
        color: 'var(--faint)',
      }}
    >
      <a href={`mailto:${email}`} style={{ color: 'inherit', textDecoration: 'none' }}>{email}</a>
      {' · '}
      <a href={githubUrl} target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
        {githubUrl.replace('https://', '')}
      </a>
      {' · Ahmedabad, India'}
    </footer>
  )
}
```

- [ ] **Step 6: Commit**

```bash
git add src/components/
git commit -m "feat: add ThemeProvider, ThemeToggle, Nav, Footer components"
```

---

### Task 5: Frontend Layout & Flash-Prevention

**Files:**
- Create: `src/app/(frontend)/layout.tsx`
- Create: `src/app/(frontend)/not-found.tsx`
- Create: `src/app/(frontend)/error.tsx`

**Interfaces:**
- Consumes: `getCachedPayload()`, `<Nav>`, `<Footer>`, `<ThemeProvider>`
- Produces: shared layout wrapping all frontend pages; `SiteSettings` fetched once here

- [ ] **Step 1: Create `src/app/(frontend)/layout.tsx`**

```tsx
import type { Metadata } from 'next'
import { Inter, Inter_Tight, JetBrains_Mono } from 'next/font/google'
import { getCachedPayload } from '@/lib/payload'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { ThemeProvider } from '@/components/ThemeProvider'
import '@/app/globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600'],
})
const interTight = Inter_Tight({
  subsets: ['latin'],
  variable: '--font-inter-tight',
  weight: ['400', '500', '600', '700', '800'],
})
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  weight: ['400', '500', '600'],
})

export async function generateMetadata(): Promise<Metadata> {
  const payload = await getCachedPayload()
  const settings = await payload.findGlobal({ slug: 'site-settings' }).catch(() => null)
  return {
    title: settings?.metaTitle ?? 'Ayush Chaudhari',
    description: settings?.metaDescription ?? 'Backend & Generative AI Engineer',
  }
}

const themeScript = `(function(){var t=localStorage.getItem('theme');if(!t)t='dark';document.documentElement.classList.toggle('dark',t==='dark');})()`

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const payload = await getCachedPayload()
  const settings = await payload.findGlobal({ slug: 'site-settings' }).catch(() => ({
    email: 'ayushchaudhari3516@gmail.com',
    githubUrl: 'https://github.com/ayush-3516',
    resumeUrl: '',
  }))

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${inter.variable} ${interTight.variable} ${jetbrainsMono.variable}`}>
        <ThemeProvider>
          <Nav
            email={settings.email ?? ''}
            githubUrl={settings.githubUrl ?? ''}
            resumeUrl={settings.resumeUrl ?? ''}
          />
          {children}
          <Footer email={settings.email ?? ''} githubUrl={settings.githubUrl ?? ''} />
        </ThemeProvider>
      </body>
    </html>
  )
}
```

- [ ] **Step 2: Create `src/app/(frontend)/not-found.tsx`**

```tsx
import Link from 'next/link'

export default function NotFound() {
  return (
    <div
      style={{
        maxWidth: 480,
        margin: '120px auto',
        textAlign: 'center',
        padding: '0 36px',
      }}
    >
      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 12,
          color: 'var(--accent)',
          marginBottom: 16,
        }}
      >
        404
      </div>
      <h1
        style={{
          fontFamily: "'Inter Tight', sans-serif",
          fontWeight: 800,
          fontSize: 32,
          color: 'var(--ink)',
          marginBottom: 12,
        }}
      >
        Page not found
      </h1>
      <p style={{ fontSize: 15, color: 'var(--muted)', marginBottom: 32 }}>
        This page doesn't exist or was removed.
      </p>
      <Link
        href="/"
        style={{
          padding: '11px 22px',
          borderRadius: 10,
          background: 'var(--accent)',
          color: '#fff',
          fontSize: 14,
          fontWeight: 600,
          fontFamily: "'Inter Tight', sans-serif",
          textDecoration: 'none',
        }}
      >
        Go home
      </Link>
    </div>
  )
}
```

- [ ] **Step 3: Create `src/app/(frontend)/error.tsx`**

```tsx
'use client'
export default function Error({ reset }: { reset: () => void }) {
  return (
    <div style={{ maxWidth: 480, margin: '120px auto', textAlign: 'center', padding: '0 36px' }}>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'var(--accent)', marginBottom: 16 }}>
        Error
      </div>
      <h1 style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 800, fontSize: 32, color: 'var(--ink)', marginBottom: 12 }}>
        Something went wrong
      </h1>
      <button
        onClick={reset}
        style={{
          padding: '11px 22px',
          borderRadius: 10,
          background: 'var(--accent)',
          color: '#fff',
          fontSize: 14,
          fontWeight: 600,
          fontFamily: "'Inter Tight', sans-serif",
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Try again
      </button>
    </div>
  )
}
```

- [ ] **Step 4: Verify layout renders**

```bash
pnpm dev
```

Open `http://localhost:3000`. Expected: Nav and Footer render, dark class on `<html>`, no flash on reload, no console errors. Stop server.

- [ ] **Step 5: Commit**

```bash
git add src/app/\(frontend\)/
git commit -m "feat: add frontend layout, flash-prevention script, 404 and error pages"
```

---

### Task 6: AnimatedCounter, Typewriter, ProjectCard, RichText, TocSidebar Components

**Files:**
- Create: `src/components/AnimatedCounter.tsx`
- Create: `src/components/Typewriter.tsx`
- Create: `src/components/ProjectCard.tsx`
- Create: `src/components/RichText.tsx`
- Create: `src/components/TocSidebar.tsx`

**Interfaces:**
- Produces:
  - `<AnimatedCounter target={number} suffix={string} />` — client
  - `<Typewriter code={string} />` — client
  - `<ProjectCard project={Project} />` — server
  - `<RichText data={SerializedEditorState} />` — server
  - `<TocSidebar items={TocItem[]} />` — client, `TocItem = { id: string; label: string }`

- [ ] **Step 1: Create `src/components/AnimatedCounter.tsx`**

```tsx
'use client'
import { useEffect, useRef, useState } from 'react'

export function AnimatedCounter({
  target,
  suffix = '',
  duration = 1400,
}: {
  target: number
  suffix?: string
  duration?: number
}) {
  const [value, setValue] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    if (started.current) return
    started.current = true
    const t0 = performance.now()
    const ease = (x: number) => 1 - Math.pow(1 - x, 3)
    const tick = (now: number) => {
      const k = Math.min(1, (now - t0) / duration)
      setValue(Math.round(target * ease(k)))
      if (k < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [target, duration])

  const formatted = target >= 1000 ? `${Math.round(value / 1000)}K+` : `${value}${suffix}`
  return <>{formatted}</>
}
```

- [ ] **Step 2: Create `src/components/Typewriter.tsx`**

```tsx
'use client'
import { useEffect, useRef, useState } from 'react'

export function Typewriter({ code }: { code: string }) {
  const [typed, setTyped] = useState('')
  const done = useRef(false)

  useEffect(() => {
    if (done.current) return
    done.current = true
    let i = 0
    const id = setInterval(() => {
      i += 2
      setTyped(code.slice(0, i))
      if (i >= code.length) clearInterval(id)
    }, 22)
    return () => clearInterval(id)
  }, [code])

  return (
    <pre
      style={{
        padding: 20,
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 13,
        lineHeight: 1.7,
        color: 'var(--muted)',
        whiteSpace: 'pre-wrap',
        minHeight: 240,
      }}
    >
      {typed}
      <span
        style={{
          display: 'inline-block',
          width: 8,
          height: 15,
          background: 'var(--accent)',
          verticalAlign: '-2px',
          animation: 'blink 1s step-end infinite',
        }}
      />
    </pre>
  )
}
```

- [ ] **Step 3: Create `src/components/ProjectCard.tsx`**

```tsx
import type { Project } from '@/payload-types'
import Link from 'next/link'

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className="group"
      style={{
        padding: 24,
        borderRadius: 16,
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        cursor: 'pointer',
        textDecoration: 'none',
        display: 'block',
        transition: 'transform .2s, border-color .2s',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            color: 'var(--accent)',
            padding: '4px 9px',
            borderRadius: 7,
            background: 'var(--accent-soft)',
          }}
        >
          {project.tag}
        </div>
        <div style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 700, fontSize: 13, color: 'var(--muted)' }}>
          {project.metric}
        </div>
      </div>
      <h3
        style={{
          fontFamily: "'Inter Tight', sans-serif",
          fontWeight: 700,
          fontSize: 19,
          color: 'var(--ink)',
          marginBottom: 7,
        }}
      >
        {project.title}
      </h3>
      <p style={{ fontSize: 13.5, lineHeight: 1.6, color: 'var(--muted)', marginBottom: 16 }}>
        {project.excerpt}
      </p>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--faint)' }}>
        {project.stack}
      </div>
    </Link>
  )
}
```

- [ ] **Step 4: Create `src/components/RichText.tsx`**

```tsx
import { RichText as LexicalRichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

export function RichText({ data }: { data: SerializedEditorState }) {
  return (
    <div className="rich-text">
      <LexicalRichText data={data} />
    </div>
  )
}
```

- [ ] **Step 5: Create `src/components/TocSidebar.tsx`**

```tsx
'use client'
import { useEffect, useState } from 'react'

export type TocItem = { id: string; label: string }

export function TocSidebar({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState(items[0]?.id ?? '')

  useEffect(() => {
    const handler = () => {
      let current = items[0]?.id ?? ''
      for (const item of items) {
        const el = document.getElementById(item.id)
        if (el && el.getBoundingClientRect().top <= 120) current = item.id
      }
      setActive(current)
    }
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [items])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 90, behavior: 'smooth' })
  }

  return (
    <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => scrollTo(item.id)}
          style={{
            padding: '6px 14px',
            marginLeft: -1,
            borderLeft: `2px solid ${active === item.id ? 'var(--accent)' : 'transparent'}`,
            fontSize: 13,
            color: active === item.id ? 'var(--accent)' : 'var(--muted)',
            fontFamily: "'Inter Tight', sans-serif",
            fontWeight: active === item.id ? 600 : 400,
            cursor: 'pointer',
            background: 'none',
            border: 'none',
            borderLeft: `2px solid ${active === item.id ? 'var(--accent)' : 'transparent'}`,
            textAlign: 'left',
          }}
        >
          {item.label}
        </button>
      ))}
    </nav>
  )
}
```

- [ ] **Step 6: Commit**

```bash
git add src/components/
git commit -m "feat: add AnimatedCounter, Typewriter, ProjectCard, RichText, TocSidebar"
```

---

### Task 7: Home Page

**Files:**
- Create: `src/app/(frontend)/page.tsx`

**Interfaces:**
- Consumes: `getCachedPayload()`, `<AnimatedCounter>`, `<Typewriter>`, `<ProjectCard>`, `HeroContent`, `MetricsBand`, `StackSection`, `Timeline`, `Projects` (featured=true)

- [ ] **Step 1: Create `src/app/(frontend)/page.tsx`**

```tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { getCachedPayload } from '@/lib/payload'
import { AnimatedCounter } from '@/components/AnimatedCounter'
import { Typewriter } from '@/components/Typewriter'
import { ProjectCard } from '@/components/ProjectCard'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const payload = await getCachedPayload()
  const settings = await payload.findGlobal({ slug: 'site-settings' }).catch(() => null)
  return {
    title: settings?.metaTitle ?? 'Ayush Chaudhari — Backend & AI Engineer',
    description: settings?.metaDescription ?? '',
  }
}

export default async function HomePage() {
  const payload = await getCachedPayload()

  const [hero, metrics, stackGlobal, timelineGlobal, featuredProjects] = await Promise.all([
    payload.findGlobal({ slug: 'hero-content' }).catch(() => null),
    payload.findGlobal({ slug: 'metrics-band' }).catch(() => null),
    payload.findGlobal({ slug: 'stack-section' }).catch(() => null),
    payload.findGlobal({ slug: 'timeline' }).catch(() => null),
    payload
      .find({ collection: 'projects', where: { and: [{ featured: { equals: true } }, { status: { equals: 'published' } }] }, sort: 'order', limit: 6 })
      .then((r) => r.docs)
      .catch(() => []),
  ])

  return (
    <div>
      {/* HERO */}
      <section style={{ maxWidth: 1180, margin: '0 auto', padding: '96px 36px 60px', display: 'grid', gridTemplateColumns: '1.05fr .95fr', gap: 56, alignItems: 'center' }}>
        <div style={{ animation: 'rise .6s ease both' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 13px', borderRadius: 99, border: '1px solid var(--border)', background: 'var(--surface)', fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'var(--accent)', marginBottom: 26 }}>
            <span style={{ width: 7, height: 7, borderRadius: 99, background: '#22c55e', boxShadow: '0 0 8px #22c55e' }} />
            {hero?.statusBadgeText ?? 'Production AI, engineered properly.'}
          </div>
          <h1 style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 800, fontSize: 54, lineHeight: 1.04, letterSpacing: '-0.03em', color: 'var(--ink)', marginBottom: 22 }}>
            {hero?.headline ?? 'I build the backend systems behind AI products.'}
          </h1>
          <p style={{ fontSize: 17, lineHeight: 1.65, color: 'var(--muted)', maxWidth: 520, marginBottom: 14 }}>
            {hero?.subheadline ?? ''}
          </p>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: 'var(--faint)', marginBottom: 30 }}>
            {hero?.locationLine ?? 'Backend & Generative AI Engineer · Ahmedabad, India'}
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a href="mailto:ayushchaudhari3516@gmail.com" style={{ padding: '13px 22px', borderRadius: 11, background: 'var(--accent)', color: '#fff', fontSize: 14, fontWeight: 600, fontFamily: "'Inter Tight', sans-serif", textDecoration: 'none', boxShadow: '0 8px 24px -8px var(--accent)' }}>Contact</a>
            <a href="#" style={{ padding: '13px 22px', borderRadius: 11, background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--ink)', fontSize: 14, fontWeight: 600, fontFamily: "'Inter Tight', sans-serif", textDecoration: 'none' }}>View résumé</a>
            <a href="https://github.com/ayush-3516" target="_blank" rel="noreferrer" style={{ padding: '13px 22px', borderRadius: 11, background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--ink)', fontSize: 14, fontWeight: 600, fontFamily: "'Inter Tight', sans-serif", textDecoration: 'none' }}>GitHub ↗</a>
          </div>
        </div>

        {/* Terminal */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden', boxShadow: '0 30px 60px -30px rgba(0,0,0,.5)', animation: 'rise .7s ease both' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '13px 16px', borderBottom: '1px solid var(--border)', background: 'var(--surface-2)' }}>
            <span style={{ width: 11, height: 11, borderRadius: 99, background: '#ff5f57' }} />
            <span style={{ width: 11, height: 11, borderRadius: 99, background: '#febc2e' }} />
            <span style={{ width: 11, height: 11, borderRadius: 99, background: '#28c840' }} />
            <span style={{ marginLeft: 8, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'var(--faint)' }}>orchestrator.py</span>
          </div>
          <Typewriter code={hero?.terminalCode ?? ''} />
        </div>
      </section>

      {/* AUDIENCE SWITCHER */}
      <section style={{ maxWidth: 1180, margin: '0 auto', padding: '30px 36px 50px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap', padding: '24px 28px', borderRadius: 18, background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <div style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 600, fontSize: 16, color: 'var(--ink)' }}>I'm hiring for…</div>
          {[
            { href: '/ai', accent: '#8b5cf6', path: '/ai', label: 'AI & LLM →', sub: 'Orchestration · RAG · agents' },
            { href: '/backend', accent: '#38bdf8', path: '/backend', label: 'Backend →', sub: 'APIs · systems · scale' },
            { href: '/web3', accent: '#f5b942', path: '/web3', label: 'Blockchain →', sub: 'Solidity · contracts · NFTs' },
          ].map((card) => (
            <Link key={card.href} href={card.href} style={{ flex: 1, minWidth: 180, padding: '16px 18px', borderRadius: 13, border: '1px solid var(--border)', background: 'var(--surface-2)', textDecoration: 'none', display: 'block' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: card.accent, marginBottom: 5 }}>{card.path}</div>
              <div style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 700, fontSize: 17, color: 'var(--ink)' }}>{card.label}</div>
              <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 3 }}>{card.sub}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* METRICS BAND */}
      <section style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', padding: '42px 36px', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 32 }}>
          {[
            { value: metrics?.m1Value ?? '50000', label: metrics?.m1Label ?? 'leads co-managed', accent: false },
            { value: metrics?.m2Value ?? '95', label: metrics?.m2Label ?? 'LLM cost reduction (cached)', accent: true },
            { value: metrics?.m3Value ?? '40', label: metrics?.m3Label ?? 'languages supported (RAG)', accent: false },
            { value: metrics?.m4Value ?? '100', label: metrics?.m4Label ?? 'sales reps onboarded', accent: false },
          ].map((m, i) => (
            <div key={i}>
              <div style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 800, fontSize: 38, color: m.accent ? 'var(--accent)' : 'var(--ink)', letterSpacing: '-0.02em' }}>
                <AnimatedCounter target={parseInt(m.value) || 0} suffix="+" />
              </div>
              <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>{m.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED WORK */}
      <section style={{ maxWidth: 1180, margin: '0 auto', padding: '70px 36px 40px' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'var(--accent)', marginBottom: 10 }}>01 / FEATURED WORK</div>
        <h2 style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 700, fontSize: 32, color: 'var(--ink)', letterSpacing: '-0.02em', marginBottom: 32 }}>Selected case studies</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
          {featuredProjects.map((p) => <ProjectCard key={p.id} project={p} />)}
        </div>
      </section>

      {/* STACK */}
      <section style={{ maxWidth: 1180, margin: '0 auto', padding: '50px 36px' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'var(--accent)', marginBottom: 10 }}>02 / STACK</div>
        <h2 style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 700, fontSize: 32, color: 'var(--ink)', letterSpacing: '-0.02em', marginBottom: 32 }}>Tech, by domain</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 16 }}>
          {(stackGlobal?.groups ?? []).map((g: any) => (
            <div key={g.domain} style={{ padding: 20, borderRadius: 14, background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <div style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 700, fontSize: 14, color: 'var(--ink)', marginBottom: 14, paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>{g.domain}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {(g.items ?? []).map((it: any, idx: number) => (
                  <div key={idx} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'var(--muted)', lineHeight: 1.4 }}>{it.item}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TIMELINE */}
      <section style={{ maxWidth: 1180, margin: '0 auto', padding: '50px 36px' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'var(--accent)', marginBottom: 10 }}>03 / EXPERIENCE</div>
        <h2 style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 700, fontSize: 32, color: 'var(--ink)', letterSpacing: '-0.02em', marginBottom: 32 }}>Where I've worked</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {(timelineGlobal?.entries ?? []).map((t: any, i: number) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 32, padding: '24px 0', borderTop: '1px solid var(--border)' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12.5, color: 'var(--faint)' }}>{t.time}</div>
              <div>
                <div style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 700, fontSize: 19, color: 'var(--ink)' }}>{t.role}</div>
                <div style={{ fontSize: 14, color: 'var(--accent)', margin: '4px 0 8px' }}>{t.org}</div>
                <div style={{ fontSize: 13.5, lineHeight: 1.6, color: 'var(--muted)' }}>{t.place}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PHILOSOPHY + CTA */}
      <section style={{ maxWidth: 1180, margin: '0 auto', padding: '50px 36px 40px' }}>
        <div style={{ padding: 48, borderRadius: 22, background: 'linear-gradient(150deg, var(--accent-soft), var(--surface))', border: '1px solid var(--border)' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'var(--accent)', marginBottom: 14 }}>04 / PHILOSOPHY</div>
          <p style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 500, fontSize: 25, lineHeight: 1.45, color: 'var(--ink)', letterSpacing: '-0.015em', maxWidth: 780, marginBottom: 30 }}>
            The demo is the easy part. I obsess over the systems underneath — the access checks, the idempotent writes, the migrations that ship with zero downtime — because that's what makes an AI product survive contact with real users.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a href="mailto:ayushchaudhari3516@gmail.com" style={{ padding: '13px 22px', borderRadius: 11, background: 'var(--accent)', color: '#fff', fontSize: 14, fontWeight: 600, fontFamily: "'Inter Tight', sans-serif", textDecoration: 'none' }}>Get in touch</a>
            <a href="#" style={{ padding: '13px 22px', borderRadius: 11, background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--ink)', fontSize: 14, fontWeight: 600, fontFamily: "'Inter Tight', sans-serif", textDecoration: 'none' }}>View résumé</a>
          </div>
        </div>
      </section>
    </div>
  )
}
```

- [ ] **Step 2: Seed Payload with minimal data and verify the home page renders**

Start dev, go to `http://localhost:3000/admin`, and:
1. Create a `SiteSettings` global with your email and GitHub URL
2. Create a `HeroContent` global with the headline, subheadline, locationLine, statusBadgeText, and terminalCode from the design
3. Create a `MetricsBand` global with: m1Value=50000/m1Label="leads co-managed", m2Value=95/m2Label="LLM cost reduction (cached)", m3Value=40/m3Label="languages supported (RAG)", m4Value=100/m4Label="sales reps onboarded"
4. Create a `StackSection` global with the 5 groups from the design
5. Create a `Timeline` global with the 3 entries from the design

Then open `http://localhost:3000`. Expected: hero, terminal typewriter, audience switcher, metrics band, empty featured grid (no projects yet), stack, timeline, philosophy CTA all render correctly. Stop server.

- [ ] **Step 3: Commit**

```bash
git add src/app/\(frontend\)/page.tsx
git commit -m "feat: implement home page with ISR, hero, metrics, stack, timeline"
```

---

### Task 8: Domain Pages (AI, Backend, Web3)

**Files:**
- Create: `src/app/(frontend)/ai/page.tsx`
- Create: `src/app/(frontend)/backend/page.tsx`
- Create: `src/app/(frontend)/web3/page.tsx`
- Create: `src/components/DomainAccent.tsx`

**Interfaces:**
- Consumes: `getCachedPayload()`, `<ProjectCard>`
- Produces: three domain pages, each setting `data-domain` on `<html>` via `<DomainAccent>`

- [ ] **Step 1: Create `src/components/DomainAccent.tsx`**

This client component sets `data-domain` on `<html>` so CSS accent overrides apply.

```tsx
'use client'
import { useEffect } from 'react'

export function DomainAccent({ domain }: { domain: 'ai' | 'backend' | 'web3' | '' }) {
  useEffect(() => {
    document.documentElement.setAttribute('data-domain', domain)
    return () => document.documentElement.removeAttribute('data-domain')
  }, [domain])
  return null
}
```

- [ ] **Step 2: Create `src/app/(frontend)/ai/page.tsx`**

```tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { getCachedPayload } from '@/lib/payload'
import { ProjectCard } from '@/components/ProjectCard'
import { DomainAccent } from '@/components/DomainAccent'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'AI & LLM — Ayush Chaudhari',
  description: 'Multi-provider LLM orchestration, RAG, multi-agent systems, and prompt caching.',
}

const proof = [
  { big: '3 providers', label: 'Anthropic → Gemini → OpenAI fallback chain' },
  { big: '~95%', label: 'cost cut via 24h prompt caching' },
  { big: '40+', label: 'languages in production RAG' },
  { big: '3 agents', label: 'orchestrated with code-enforced rules' },
]

export default async function AIPage() {
  const payload = await getCachedPayload()
  const projects = await payload
    .find({ collection: 'projects', where: { and: [{ domain: { equals: 'ai' } }, { status: { equals: 'published' } }] }, sort: 'order' })
    .then((r) => r.docs)
    .catch(() => [])

  const recentPosts = await payload
    .find({ collection: 'blog-posts', where: { status: { equals: 'published' } }, sort: '-publishedAt', limit: 3 })
    .then((r) => r.docs)
    .catch(() => [])

  return (
    <div>
      <DomainAccent domain="ai" />
      <section style={{ maxWidth: 1180, margin: '0 auto', padding: '90px 36px 56px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 99, border: '1px solid rgba(139,92,246,.35)', background: 'rgba(139,92,246,.1)', fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#8b5cf6', marginBottom: 26 }}>
          /ai · APPLIED LLM SYSTEMS
        </div>
        <h1 style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 800, fontSize: 56, lineHeight: 1.05, letterSpacing: '-0.03em', color: 'var(--ink)', maxWidth: 880, margin: '0 auto 22px' }}>
          I orchestrate LLMs into products that ship — and don't go bankrupt.
        </h1>
        <p style={{ fontSize: 18, lineHeight: 1.6, color: 'var(--muted)', maxWidth: 640, margin: '0 auto 32px' }}>
          Multi-provider fallback chains, RAG over 40+ languages, multi-agent systems, and prompt caching that cut generation cost by ~95%.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="mailto:ayushchaudhari3516@gmail.com" style={{ padding: '13px 24px', borderRadius: 11, background: '#8b5cf6', color: '#fff', fontSize: 14, fontWeight: 600, fontFamily: "'Inter Tight', sans-serif", textDecoration: 'none', boxShadow: '0 10px 30px -10px #8b5cf6' }}>See AI work</a>
          <a href="mailto:ayushchaudhari3516@gmail.com" style={{ padding: '13px 24px', borderRadius: 11, background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--ink)', fontSize: 14, fontWeight: 600, fontFamily: "'Inter Tight', sans-serif", textDecoration: 'none' }}>Contact</a>
        </div>
      </section>

      {/* Proof band */}
      <section style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', padding: '36px 36px', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 32 }}>
          {proof.map((p) => (
            <div key={p.big}>
              <div style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 800, fontSize: 32, color: 'var(--accent)', letterSpacing: '-0.02em' }}>{p.big}</div>
              <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>{p.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section style={{ maxWidth: 1180, margin: '0 auto', padding: '60px 36px 40px' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'var(--accent)', marginBottom: 10 }}>AI PROJECTS</div>
        <h2 style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 700, fontSize: 32, color: 'var(--ink)', letterSpacing: '-0.02em', marginBottom: 32 }}>LLM systems I've shipped</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
          {projects.map((p) => <ProjectCard key={p.id} project={p} />)}
        </div>
      </section>

      {/* Recent posts */}
      {recentPosts.length > 0 && (
        <section style={{ maxWidth: 1180, margin: '0 auto', padding: '20px 36px 60px' }}>
          <h2 style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 700, fontSize: 24, color: 'var(--ink)', letterSpacing: '-0.02em', marginBottom: 20 }}>Recent writing</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {recentPosts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} style={{ padding: '18px 24px', borderRadius: 14, background: 'var(--surface)', border: '1px solid var(--border)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--accent)', padding: '4px 9px', borderRadius: 7, background: 'var(--accent-soft)' }}>
                  {typeof post.tag === 'object' && post.tag !== null ? (post.tag as any).name : post.tag}
                </span>
                <span style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 600, fontSize: 15, color: 'var(--ink)' }}>{post.title}</span>
                <span style={{ marginLeft: 'auto', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--faint)' }}>{post.readTime}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Create `src/app/(frontend)/backend/page.tsx`**

```tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { getCachedPayload } from '@/lib/payload'
import { ProjectCard } from '@/components/ProjectCard'
import { DomainAccent } from '@/components/DomainAccent'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Backend — Ayush Chaudhari',
  description: 'Production microservices, RBAC, idempotent services, zero-downtime migrations.',
}

const proof = [
  { big: 'sub-ms', label: 'access checks via MongoDB sparse indexes' },
  { big: 'idempotent', label: 'single-writer assignment service' },
  { big: '8-phase', label: 'feature-flagged zero-downtime migration' },
  { big: 'real-time', label: 'Socket.IO + SSE streaming UX' },
]

export default async function BackendPage() {
  const payload = await getCachedPayload()
  const projects = await payload
    .find({ collection: 'projects', where: { and: [{ domain: { equals: 'backend' } }, { status: { equals: 'published' } }] }, sort: 'order' })
    .then((r) => r.docs)
    .catch(() => [])

  const recentPosts = await payload
    .find({ collection: 'blog-posts', where: { status: { equals: 'published' } }, sort: '-publishedAt', limit: 3 })
    .then((r) => r.docs)
    .catch(() => [])

  return (
    <div>
      <DomainAccent domain="backend" />
      <section style={{ maxWidth: 1180, margin: '0 auto', padding: '90px 36px 56px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 99, border: '1px solid rgba(56,189,248,.35)', background: 'rgba(56,189,248,.1)', fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#38bdf8', marginBottom: 26 }}>
          /backend · PRODUCTION SYSTEMS
        </div>
        <h1 style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 800, fontSize: 56, lineHeight: 1.05, letterSpacing: '-0.03em', color: 'var(--ink)', maxWidth: 880, margin: '0 auto 22px' }}>
          I build the unglamorous systems that make products actually work.
        </h1>
        <p style={{ fontSize: 18, lineHeight: 1.6, color: 'var(--muted)', maxWidth: 640, margin: '0 auto 32px' }}>
          RBAC with sub-ms access checks, idempotent single-writer services, 8-phase feature-flagged migrations, real-time Socket.IO + SSE.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="mailto:ayushchaudhari3516@gmail.com" style={{ padding: '13px 24px', borderRadius: 11, background: 'var(--accent)', color: '#fff', fontSize: 14, fontWeight: 600, fontFamily: "'Inter Tight', sans-serif", textDecoration: 'none', boxShadow: '0 10px 30px -10px var(--accent)' }}>See backend work</a>
          <a href="mailto:ayushchaudhari3516@gmail.com" style={{ padding: '13px 24px', borderRadius: 11, background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--ink)', fontSize: 14, fontWeight: 600, fontFamily: "'Inter Tight', sans-serif", textDecoration: 'none' }}>Contact</a>
        </div>
      </section>

      <section style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', padding: '36px 36px', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 32 }}>
          {proof.map((p) => (
            <div key={p.big}>
              <div style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 800, fontSize: 32, color: 'var(--accent)', letterSpacing: '-0.02em' }}>{p.big}</div>
              <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>{p.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: 1180, margin: '0 auto', padding: '60px 36px 40px' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'var(--accent)', marginBottom: 10 }}>BACKEND PROJECTS</div>
        <h2 style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 700, fontSize: 32, color: 'var(--ink)', letterSpacing: '-0.02em', marginBottom: 32 }}>Systems I've built</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
          {projects.map((p) => <ProjectCard key={p.id} project={p} />)}
        </div>
      </section>

      {recentPosts.length > 0 && (
        <section style={{ maxWidth: 1180, margin: '0 auto', padding: '20px 36px 60px' }}>
          <h2 style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 700, fontSize: 24, color: 'var(--ink)', letterSpacing: '-0.02em', marginBottom: 20 }}>Recent writing</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {recentPosts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} style={{ padding: '18px 24px', borderRadius: 14, background: 'var(--surface)', border: '1px solid var(--border)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--accent)', padding: '4px 9px', borderRadius: 7, background: 'var(--accent-soft)' }}>
                  {typeof post.tag === 'object' && post.tag !== null ? (post.tag as any).name : post.tag}
                </span>
                <span style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 600, fontSize: 15, color: 'var(--ink)' }}>{post.title}</span>
                <span style={{ marginLeft: 'auto', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--faint)' }}>{post.readTime}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Create `src/app/(frontend)/web3/page.tsx`**

```tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { getCachedPayload } from '@/lib/payload'
import { ProjectCard } from '@/components/ProjectCard'
import { DomainAccent } from '@/components/DomainAccent'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Web3 — Ayush Chaudhari',
  description: 'Solidity, ERC-721, ERC-20, multi-sig wallets, IPFS via Pinata.',
}

const proof = [
  { big: 'ETH + Polygon', label: 'deployed across both testnets' },
  { big: 'IPFS', label: 'NFT metadata pinned via Pinata' },
  { big: 'multi-sig', label: 'wallet contract with threshold approvals' },
  { big: 'security', label: 'auditing-ecosystem DevRel background' },
]

export default async function Web3Page() {
  const payload = await getCachedPayload()
  const projects = await payload
    .find({ collection: 'projects', where: { and: [{ domain: { equals: 'web3' } }, { status: { equals: 'published' } }] }, sort: 'order' })
    .then((r) => r.docs)
    .catch(() => [])

  const recentPosts = await payload
    .find({ collection: 'blog-posts', where: { status: { equals: 'published' } }, sort: '-publishedAt', limit: 3 })
    .then((r) => r.docs)
    .catch(() => [])

  return (
    <div>
      <DomainAccent domain="web3" />
      <section style={{ maxWidth: 1180, margin: '0 auto', padding: '90px 36px 56px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 99, border: '1px solid rgba(245,185,66,.35)', background: 'rgba(245,185,66,.1)', fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#f5b942', marginBottom: 26 }}>
          /web3 · ON-CHAIN ENGINEERING
        </div>
        <h1 style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 800, fontSize: 56, lineHeight: 1.05, letterSpacing: '-0.03em', color: 'var(--ink)', maxWidth: 880, margin: '0 auto 22px' }}>
          Solidity contracts, IPFS, and multi-sig wallets — shipped to testnet.
        </h1>
        <p style={{ fontSize: 18, lineHeight: 1.6, color: 'var(--muted)', maxWidth: 640, margin: '0 auto 32px' }}>
          ERC-721 NFTs with IPFS metadata via Pinata, ERC-20 tokens, multi-signature wallets with threshold approvals, deployed on Ethereum and Polygon testnets.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="mailto:ayushchaudhari3516@gmail.com" style={{ padding: '13px 24px', borderRadius: 11, background: 'var(--accent)', color: '#fff', fontSize: 14, fontWeight: 600, fontFamily: "'Inter Tight', sans-serif", textDecoration: 'none', boxShadow: '0 10px 30px -10px var(--accent)' }}>See Web3 work</a>
          <a href="mailto:ayushchaudhari3516@gmail.com" style={{ padding: '13px 24px', borderRadius: 11, background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--ink)', fontSize: 14, fontWeight: 600, fontFamily: "'Inter Tight', sans-serif", textDecoration: 'none' }}>Contact</a>
        </div>
      </section>

      <section style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', padding: '36px 36px', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 32 }}>
          {proof.map((p) => (
            <div key={p.big}>
              <div style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 800, fontSize: 32, color: 'var(--accent)', letterSpacing: '-0.02em' }}>{p.big}</div>
              <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>{p.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: 1180, margin: '0 auto', padding: '60px 36px 40px' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'var(--accent)', marginBottom: 10 }}>WEB3 PROJECTS</div>
        <h2 style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 700, fontSize: 32, color: 'var(--ink)', letterSpacing: '-0.02em', marginBottom: 32 }}>On-chain work</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
          {projects.map((p) => <ProjectCard key={p.id} project={p} />)}
        </div>
      </section>

      {recentPosts.length > 0 && (
        <section style={{ maxWidth: 1180, margin: '0 auto', padding: '20px 36px 60px' }}>
          <h2 style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 700, fontSize: 24, color: 'var(--ink)', letterSpacing: '-0.02em', marginBottom: 20 }}>Recent writing</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {recentPosts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} style={{ padding: '18px 24px', borderRadius: 14, background: 'var(--surface)', border: '1px solid var(--border)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--accent)', padding: '4px 9px', borderRadius: 7, background: 'var(--accent-soft)' }}>
                  {typeof post.tag === 'object' && post.tag !== null ? (post.tag as any).name : post.tag}
                </span>
                <span style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 600, fontSize: 15, color: 'var(--ink)' }}>{post.title}</span>
                <span style={{ marginLeft: 'auto', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--faint)' }}>{post.readTime}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
```

- [ ] **Step 5: Commit**

```bash
git add src/app/\(frontend\)/ai src/app/\(frontend\)/backend src/app/\(frontend\)/web3 src/components/DomainAccent.tsx
git commit -m "feat: add AI, Backend, Web3 domain pages with domain accent switching"
```

---

### Task 9: Blog Index & Article Pages

**Files:**
- Create: `src/app/(frontend)/blog/page.tsx`
- Create: `src/app/(frontend)/blog/[slug]/page.tsx`

**Interfaces:**
- Consumes: `getCachedPayload()`, `<RichText>`, `<TocSidebar>`
- Produces: `/blog` (ISR 60s), `/blog/[slug]` (SSG + ISR 3600s)

- [ ] **Step 1: Create `src/app/(frontend)/blog/page.tsx`**

```tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { getCachedPayload } from '@/lib/payload'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Blog — Ayush Chaudhari',
  description: 'Writing on LLM systems, backend engineering, databases, and Web3.',
}

export default async function BlogPage() {
  const payload = await getCachedPayload()
  const posts = await payload
    .find({ collection: 'blog-posts', where: { status: { equals: 'published' } }, sort: '-publishedAt', limit: 50 })
    .then((r) => r.docs)
    .catch(() => [])

  return (
    <div style={{ maxWidth: 1180, margin: '0 auto', padding: '80px 36px 60px' }}>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'var(--accent)', marginBottom: 10 }}>BLOG</div>
      <h1 style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 800, fontSize: 48, color: 'var(--ink)', letterSpacing: '-0.03em', marginBottom: 12 }}>
        Writing
      </h1>
      <p style={{ fontSize: 16, color: 'var(--muted)', marginBottom: 48 }}>
        On LLM systems, backend engineering, databases, and Web3.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            style={{ padding: '24px 28px', borderRadius: 16, background: 'var(--surface)', border: '1px solid var(--border)', textDecoration: 'none', display: 'block' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--accent)', padding: '4px 9px', borderRadius: 7, background: 'var(--accent-soft)' }}>
                {typeof post.tag === 'object' && post.tag !== null ? (post.tag as any).name : String(post.tag ?? '')}
              </span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--faint)' }}>{post.readTime}</span>
              <span style={{ marginLeft: 'auto', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--faint)' }}>
                {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''}
              </span>
            </div>
            <h2 style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 700, fontSize: 20, color: 'var(--ink)', marginBottom: 8 }}>
              {post.title}
            </h2>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--muted)' }}>{post.excerpt}</p>
          </Link>
        ))}
        {posts.length === 0 && (
          <p style={{ color: 'var(--muted)', fontSize: 15 }}>No posts published yet.</p>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create `src/app/(frontend)/blog/[slug]/page.tsx`**

```tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCachedPayload } from '@/lib/payload'
import { RichText } from '@/components/RichText'
import { TocSidebar } from '@/components/TocSidebar'
import type { TocItem } from '@/components/TocSidebar'

export const revalidate = 3600

export async function generateStaticParams() {
  const payload = await getCachedPayload()
  const posts = await payload
    .find({ collection: 'blog-posts', where: { status: { equals: 'published' } }, limit: 200 })
    .then((r) => r.docs)
    .catch(() => [])
  return posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const payload = await getCachedPayload()
  const result = await payload.find({ collection: 'blog-posts', where: { slug: { equals: slug } }, limit: 1 }).catch(() => null)
  const post = result?.docs[0]
  if (!post) return {}
  return { title: `${post.title} — Ayush Chaudhari`, description: post.excerpt ?? '' }
}

const defaultToc: TocItem[] = [
  { id: 'intro', label: 'Introduction' },
  { id: 'body', label: 'Main content' },
]

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getCachedPayload()
  const result = await payload
    .find({ collection: 'blog-posts', where: { slug: { equals: slug } }, limit: 1, depth: 1 })
    .catch(() => null)
  const post = result?.docs[0]
  if (!post) notFound()

  const relatedPosts = Array.isArray(post.relatedPosts)
    ? post.relatedPosts.filter((p): p is NonNullable<typeof p> => typeof p === 'object' && p !== null)
    : []

  return (
    <div style={{ maxWidth: 1180, margin: '0 auto', padding: '60px 36px', display: 'grid', gridTemplateColumns: '1fr 220px', gap: 56, alignItems: 'start' }}>
      <article>
        <Link href="/blog" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'var(--accent)', marginBottom: 28, display: 'inline-block', textDecoration: 'none' }}>
          ← Blog
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--accent)', padding: '4px 9px', borderRadius: 7, background: 'var(--accent-soft)' }}>
            {typeof post.tag === 'object' && post.tag !== null ? (post.tag as any).name : String(post.tag ?? '')}
          </span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--faint)' }}>{post.readTime}</span>
        </div>
        <h1 style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 800, fontSize: 44, lineHeight: 1.1, letterSpacing: '-0.03em', color: 'var(--ink)', marginBottom: 24 }}>
          {post.title}
        </h1>
        <p style={{ fontSize: 18, lineHeight: 1.65, color: 'var(--muted)', marginBottom: 40, maxWidth: 680 }}>{post.excerpt}</p>
        <div id="intro" />
        {post.body && <RichText data={post.body as any} />}

        {relatedPosts.length > 0 && (
          <div style={{ marginTop: 60, paddingTop: 40, borderTop: '1px solid var(--border)' }}>
            <h3 style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 700, fontSize: 18, color: 'var(--ink)', marginBottom: 16 }}>Related</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {relatedPosts.map((rp: any) => (
                <Link key={rp.id} href={`/blog/${rp.slug}`} style={{ padding: '14px 18px', borderRadius: 12, background: 'var(--surface)', border: '1px solid var(--border)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--accent)', padding: '3px 8px', borderRadius: 6, background: 'var(--accent-soft)' }}>
                    {typeof rp.tag === 'object' && rp.tag !== null ? rp.tag.name : String(rp.tag ?? '')}
                  </span>
                  <span style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 600, fontSize: 14, color: 'var(--ink)' }}>{rp.title}</span>
                  <span style={{ marginLeft: 'auto', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--faint)' }}>{rp.readTime}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>

      <aside style={{ position: 'sticky', top: 90 }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--faint)', marginBottom: 12, letterSpacing: '0.06em' }}>ON THIS PAGE</div>
        <TocSidebar items={defaultToc} />
      </aside>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/\(frontend\)/blog/
git commit -m "feat: add blog index and article pages with SSG + ISR"
```

---

### Task 10: Work (Case Study) Pages

**Files:**
- Create: `src/app/(frontend)/work/[slug]/page.tsx`

**Interfaces:**
- Consumes: `getCachedPayload()`, `<RichText>`, `<TocSidebar>`
- Produces: `/work/[slug]` (SSG + ISR 3600s)

- [ ] **Step 1: Create `src/app/(frontend)/work/[slug]/page.tsx`**

```tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCachedPayload } from '@/lib/payload'
import { RichText } from '@/components/RichText'
import { TocSidebar } from '@/components/TocSidebar'
import type { TocItem } from '@/components/TocSidebar'

export const revalidate = 3600

export async function generateStaticParams() {
  const payload = await getCachedPayload()
  const projects = await payload
    .find({ collection: 'projects', where: { status: { equals: 'published' } }, limit: 200 })
    .then((r) => r.docs)
    .catch(() => [])
  return projects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const payload = await getCachedPayload()
  const result = await payload.find({ collection: 'projects', where: { slug: { equals: slug } }, limit: 1 }).catch(() => null)
  const project = result?.docs[0]
  if (!project) return {}
  return { title: `${project.title} — Ayush Chaudhari`, description: project.excerpt ?? '' }
}

const defaultToc: TocItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'problem', label: 'Problem' },
  { id: 'solution', label: 'Solution' },
  { id: 'outcome', label: 'Outcome' },
]

export default async function WorkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getCachedPayload()
  const result = await payload
    .find({ collection: 'projects', where: { slug: { equals: slug } }, limit: 1 })
    .catch(() => null)
  const project = result?.docs[0]
  if (!project) notFound()

  return (
    <div style={{ maxWidth: 1180, margin: '0 auto', padding: '60px 36px', display: 'grid', gridTemplateColumns: '1fr 220px', gap: 56, alignItems: 'start' }}>
      <article>
        <Link href="/" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'var(--accent)', marginBottom: 28, display: 'inline-block', textDecoration: 'none' }}>
          ← Work
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--accent)', padding: '4px 9px', borderRadius: 7, background: 'var(--accent-soft)' }}>
            {project.tag}
          </span>
          {project.metric && (
            <span style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 700, fontSize: 13, color: 'var(--muted)' }}>{project.metric}</span>
          )}
        </div>
        <h1 style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 800, fontSize: 44, lineHeight: 1.1, letterSpacing: '-0.03em', color: 'var(--ink)', marginBottom: 16 }}>
          {project.title}
        </h1>
        <p style={{ fontSize: 18, lineHeight: 1.65, color: 'var(--muted)', marginBottom: 12, maxWidth: 680 }}>{project.excerpt}</p>
        {project.stack && (
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'var(--faint)', marginBottom: 40 }}>{project.stack}</div>
        )}
        <div id="overview" />
        {project.body && <RichText data={project.body as any} />}
      </article>

      <aside style={{ position: 'sticky', top: 90 }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--faint)', marginBottom: 12, letterSpacing: '0.06em' }}>ON THIS PAGE</div>
        <TocSidebar items={defaultToc} />
      </aside>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/\(frontend\)/work/
git commit -m "feat: add case study work pages with SSG + ISR"
```

---

### Task 11: SEO — Sitemap, Robots, OG Image

**Files:**
- Create: `src/app/sitemap.ts`
- Create: `src/app/robots.ts`
- Create: `src/app/opengraph-image.tsx`

**Interfaces:**
- Consumes: `getCachedPayload()`
- Produces: `/sitemap.xml`, `/robots.txt`, `/opengraph-image`

- [ ] **Step 1: Create `src/app/sitemap.ts`**

```ts
import type { MetadataRoute } from 'next'
import { getCachedPayload } from '@/lib/payload'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  const payload = await getCachedPayload()

  const [posts, projects] = await Promise.all([
    payload.find({ collection: 'blog-posts', where: { status: { equals: 'published' } }, limit: 500 }).then((r) => r.docs).catch(() => []),
    payload.find({ collection: 'projects', where: { status: { equals: 'published' } }, limit: 500 }).then((r) => r.docs).catch(() => []),
  ])

  const static_: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/ai`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/backend`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/web3`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
  ]

  const postUrls: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: p.publishedAt ? new Date(p.publishedAt) : new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  const projectUrls: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${base}/work/${p.slug}`,
    lastModified: new Date(p.updatedAt),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [...static_, ...postUrls, ...projectUrls]
}
```

- [ ] **Step 2: Create `src/app/robots.ts`**

```ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: '/admin' }],
    sitemap: `${base}/sitemap.xml`,
  }
}
```

- [ ] **Step 3: Create `src/app/opengraph-image.tsx`**

```tsx
import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0a0b0f',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 24,
        }}
      >
        <div
          style={{
            width: 100,
            height: 100,
            borderRadius: 28,
            background: 'linear-gradient(140deg, #6366f1, #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 60,
            fontWeight: 800,
            color: '#fff',
          }}
        >
          A
        </div>
        <div style={{ fontSize: 48, fontWeight: 800, color: '#f4f5f8', letterSpacing: '-2px' }}>
          Ayush Chaudhari
        </div>
        <div style={{ fontSize: 22, color: '#9aa0b0' }}>
          Backend & Generative AI Engineer
        </div>
      </div>
    ),
    { ...size },
  )
}
```

- [ ] **Step 4: Verify sitemap and robots**

```bash
pnpm dev
```

Open `http://localhost:3000/sitemap.xml` — expected: valid XML with at least the 5 static routes. Open `http://localhost:3000/robots.txt` — expected: `Disallow: /admin`. Stop server.

- [ ] **Step 5: Commit**

```bash
git add src/app/sitemap.ts src/app/robots.ts src/app/opengraph-image.tsx
git commit -m "feat: add sitemap, robots.txt, and OG image"
```

---

### Task 12: Seed Content & End-to-End Verification

**Files:**
- No new files — this task seeds data and verifies the full site

**Interfaces:**
- Consumes: all pages and Payload admin

- [ ] **Step 1: Start dev and seed all content via Payload admin**

```bash
pnpm dev
```

Go to `http://localhost:3000/admin` and create:

**Tags** (create these first — BlogPosts depend on them):
- name: "LLM", slug: "llm", color: "#8b5cf6"
- name: "RAG", slug: "rag", color: "#6366f1"
- name: "COST", slug: "cost", color: "#22c55e"
- name: "AGENTS", slug: "agents", color: "#f5b942"
- name: "ARCHITECTURE", slug: "architecture", color: "#38bdf8"
- name: "DATABASES", slug: "databases", color: "#38bdf8"
- name: "SOLIDITY", slug: "solidity", color: "#f5b942"
- name: "WEB3", slug: "web3", color: "#f5b942"
- name: "SECURITY", slug: "security", color: "#ef4444"
- name: "BACKEND", slug: "backend", color: "#38bdf8"

**Projects** (6 from the design, all status=published, featured=true for first 6):
1. slug: "meraki", domain: ai, tag: FLAGSHIP, metric: 50K+ leads, excerpt: from design, stack: Python · Flask · MongoDB, featured: true, order: 1
2. slug: "college2career", domain: ai, tag: AI · BACKEND, metric: 5 services, excerpt: from design, stack: Node · TS · React · MongoDB, featured: true, order: 2
3. slug: "genai-lab", domain: ai, tag: AI · BACKEND, metric: multi-tenant, excerpt: from design, stack: TS · React · Node · Azure, featured: true, order: 3
4. slug: "d2d-chatbot", domain: ai, tag: AI · RAG, metric: 40+ langs, excerpt: from design, stack: TS · Node · Azure Blob, featured: true, order: 4
5. slug: "triporchestra", domain: ai, tag: AI · AGENTS, metric: 3 agents, excerpt: from design, stack: TS · Express · React · Docker, featured: true, order: 5
6. slug: "mindshelf", domain: backend, tag: BACKEND, metric: Go · JWT, excerpt: from design, stack: Go · REST · Docker, featured: true, order: 6

**BlogPosts** (3 sample posts, status=published):
1. slug: "multi-provider-fallback-chain", tag: LLM, readTime: "8 min", publishedAt: today, excerpt: from design
2. slug: "rag-across-40-languages", tag: RAG, readTime: "11 min", publishedAt: yesterday, excerpt: from design
3. slug: "cutting-llm-spend-95-percent", tag: COST, readTime: "6 min", publishedAt: 2 days ago, excerpt: from design

- [ ] **Step 2: Verify all pages**

Check each of these in the browser:
- `http://localhost:3000` — hero, typewriter animation, audience switcher, metrics counters animate, featured projects grid (6 cards), stack grid (5 cols), timeline (3 entries), philosophy CTA
- `http://localhost:3000/ai` — purple accent, 5 AI project cards, 3 recent posts
- `http://localhost:3000/backend` — sky accent, 1 backend project card, 3 recent posts
- `http://localhost:3000/web3` — amber accent, no projects yet (empty gracefully)
- `http://localhost:3000/blog` — 3 blog post cards
- `http://localhost:3000/blog/multi-provider-fallback-chain` — article layout with TOC sidebar, back link
- `http://localhost:3000/work/meraki` — case study layout with TOC sidebar, back link
- Theme toggle: click sun/moon — switches dark/light, persists on reload
- `/admin` — Payload admin loads, all collections and globals visible

- [ ] **Step 3: Verify no TypeScript errors**

```bash
pnpm tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: seed content and complete end-to-end verification"
```

---

### Task 13: Production Build & Vercel Deploy Prep

**Files:**
- Modify: `next.config.ts` (if needed for Vercel Blob)
- Create: `.vercelignore`

**Interfaces:**
- Produces: passing `pnpm build`, deploy-ready repo

- [ ] **Step 1: Run production build locally**

```bash
pnpm build
```

Expected: build succeeds. Note any warnings. If there are TypeScript errors, fix them before continuing.

- [ ] **Step 2: Add Vercel Blob storage adapter for production media**

```bash
pnpm add @payloadcms/storage-vercel-blob
```

In `src/payload.config.ts`, add the adapter (guarded by env so it only activates in production):

```ts
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'

// inside buildConfig:
plugins: process.env.BLOB_READ_WRITE_TOKEN
  ? [
      vercelBlobStorage({
        collections: { media: true },
        token: process.env.BLOB_READ_WRITE_TOKEN,
      }),
    ]
  : [],
```

Add to `.env.example`:
```
BLOB_READ_WRITE_TOKEN=
```

- [ ] **Step 3: Create `.vercelignore`**

```
.env.local
scraps/
"Ayush Chaudhari Portfolio.html"
"Ayush Portfolio.dc.html"
support.js
```

- [ ] **Step 4: Run build again to confirm the adapter addition didn't break anything**

```bash
pnpm build
```

Expected: build succeeds.

- [ ] **Step 5: Commit**

```bash
git add next.config.ts src/payload.config.ts .vercelignore .env.example
git commit -m "feat: add Vercel Blob storage adapter and production build config"
```

- [ ] **Step 6: Deploy to Vercel**

```bash
npx vercel --prod
```

When prompted:
- Link to existing project or create new
- Set environment variables: `DATABASE_URI`, `PAYLOAD_SECRET`, `NEXT_PUBLIC_SITE_URL`, `BLOB_READ_WRITE_TOKEN`

Expected: deployment succeeds, site live at your Vercel URL.

---

## Self-Review

**Spec coverage check:**

| Spec section | Tasks covering it |
|---|---|
| Repository structure (§2) | Task 1 |
| Projects collection (§3) | Task 2 |
| BlogPosts collection (§3) | Task 2 |
| Tags collection (§3) | Task 2 |
| Media collection (§3) | Task 2 |
| All 5 globals (§3) | Task 2 |
| Payload local API helper (§4) | Task 3 |
| ISR/SSG rendering strategy (§4) | Tasks 7–10 |
| CSS custom properties + dark/light (§5) | Task 3 |
| Domain accent switching (§5) | Task 8 |
| Fonts via next/font/google (§5) | Task 5 |
| ThemeProvider + flash prevention (§5) | Tasks 4, 5 |
| Nav component (§6) | Task 4 |
| Footer component (§6) | Task 4 |
| AnimatedCounter (§6) | Task 6 |
| Typewriter (§6) | Task 6 |
| ProjectCard (§6) | Task 6 |
| RichText (§6) | Task 6 |
| TocSidebar (§6) | Task 6 |
| generateMetadata + fallback (§7) | Tasks 5, 7–10 |
| sitemap.ts (§7) | Task 11 |
| robots.ts (§7) | Task 11 |
| opengraph-image (§7) | Task 11 |
| notFound() on bad slugs (§8) | Tasks 9, 10 |
| not-found.tsx (§8) | Task 5 |
| error.tsx (§8) | Task 5 |
| try/catch on Payload calls (§8) | Tasks 7–11 |
| Environment variables (§9) | Task 1 |
| Vercel deployment (§10) | Task 13 |
| Vercel Blob media (§10) | Task 13 |
| Payload admin at /admin (§10) | Task 2 |

All spec sections covered. No gaps found.
