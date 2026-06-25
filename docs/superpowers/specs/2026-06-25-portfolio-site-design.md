# Portfolio Site — Design Spec
**Date:** 2026-06-25
**Stack:** Next.js 15 (App Router) + Payload CMS 3.x + TypeScript + MongoDB Atlas

---

## 1. Overview

A personal portfolio site for Ayush Chaudhari (Backend & Generative AI Engineer). Implemented from the approved design in `Ayush Portfolio.dc.html`. Single monorepo using Payload 3.x's native Next.js integration — one repo, one Vercel deployment, shared TypeScript types.

The site has four public domain tabs (Portfolio, AI, Backend, Web3), a blog with individual article pages, case study detail pages, and Payload's built-in admin UI for all content management.

---

## 2. Repository Structure

```
portfolio-site/
├── src/
│   ├── app/
│   │   ├── (frontend)/
│   │   │   ├── layout.tsx              # Nav + Footer + ThemeProvider
│   │   │   ├── page.tsx                # Home
│   │   │   ├── ai/page.tsx
│   │   │   ├── backend/page.tsx
│   │   │   ├── web3/page.tsx
│   │   │   ├── blog/
│   │   │   │   ├── page.tsx            # Blog index
│   │   │   │   └── [slug]/page.tsx     # Article (SSG + ISR)
│   │   │   └── work/
│   │   │       └── [slug]/page.tsx     # Case study (SSG + ISR)
│   │   ├── (payload)/
│   │   │   └── admin/[[...segments]]/page.tsx
│   │   ├── api/[...slug]/route.ts      # Payload REST API
│   │   ├── sitemap.ts
│   │   ├── robots.ts
│   │   └── opengraph-image.tsx
│   ├── collections/
│   │   ├── Projects.ts
│   │   ├── BlogPosts.ts
│   │   ├── Tags.ts
│   │   └── Media.ts
│   ├── globals/
│   │   ├── HeroContent.ts
│   │   ├── SiteSettings.ts
│   │   ├── StackSection.ts
│   │   ├── MetricsBand.ts
│   │   └── Timeline.ts
│   ├── components/
│   │   ├── Nav.tsx
│   │   ├── Footer.tsx
│   │   ├── ThemeProvider.tsx
│   │   ├── ThemeToggle.tsx
│   │   ├── AnimatedCounter.tsx
│   │   ├── Typewriter.tsx
│   │   ├── ProjectCard.tsx
│   │   ├── RichText.tsx
│   │   └── TocSidebar.tsx
│   ├── lib/
│   │   └── payload.ts                  # getPayloadClient helper
│   └── payload.config.ts
├── public/
├── .env.local
└── package.json
```

---

## 3. Payload CMS Data Model

### Collections

#### `Projects`
| Field | Type | Notes |
|---|---|---|
| `title` | text | required |
| `slug` | text | auto-generated, unique |
| `domain` | select | `ai` \| `backend` \| `web3` \| `fullstack` |
| `tag` | text | e.g. "FLAGSHIP", "RAG" |
| `metric` | text | e.g. "50K+ leads" |
| `excerpt` | textarea | shown on cards |
| `stack` | text | e.g. "Python · Flask · MongoDB" |
| `status` | select | `published` \| `draft` \| `scheduled` |
| `scheduledAt` | date | optional, for scheduled publish |
| `featured` | checkbox | appears on Home "Selected case studies" |
| `body` | richText (Lexical) | full case study content |
| `order` | number | controls card ordering per domain |

#### `BlogPosts`
| Field | Type | Notes |
|---|---|---|
| `title` | text | required |
| `slug` | text | auto-generated, unique |
| `tag` | relationship → Tags | |
| `readTime` | text | e.g. "8 min" |
| `excerpt` | textarea | shown on blog index cards |
| `publishedAt` | date | |
| `status` | select | `published` \| `draft` \| `scheduled` |
| `body` | richText (Lexical) | full article content |
| `relatedPosts` | relationship → BlogPosts | array, max 3 |

#### `Tags`
| Field | Type |
|---|---|
| `name` | text |
| `slug` | text |
| `color` | text (hex) |

#### `Media`
Payload built-in collection. Used for images inside rich-text bodies.

---

### Globals

#### `HeroContent`
- `headline` (text)
- `subheadline` (textarea)
- `locationLine` (text) — e.g. "Backend & Generative AI Engineer · Ahmedabad, India"
- `statusBadgeText` (text) — e.g. "Production AI, engineered properly."
- `terminalCode` (textarea) — the typewriter code snippet

#### `SiteSettings`
- `email` (text)
- `githubUrl` (text)
- `resumeUrl` (text)
- `metaTitle` (text) — fallback OG title
- `metaDescription` (textarea) — fallback OG description

#### `StackSection`
- `groups` (array)
  - `domain` (text) — e.g. "AI / LLM"
  - `items` (array of text)

#### `MetricsBand`
- `m1Value` (text), `m1Label` (text) — e.g. "50K+", "leads co-managed"
- `m2Value` (text), `m2Label` (text)
- `m3Value` (text), `m3Label` (text)
- `m4Value` (text), `m4Label` (text)

#### `Timeline`
- `entries` (array)
  - `time` (text)
  - `role` (text)
  - `org` (text)
  - `place` (text)

---

## 4. Pages & Rendering Strategy

| Route | Strategy | Revalidate | Data fetched |
|---|---|---|---|
| `/` | ISR | 60s | HeroContent, MetricsBand, StackSection, Timeline, featured Projects |
| `/ai` | ISR | 60s | Projects (domain=ai), 3 recent BlogPosts tagged AI |
| `/backend` | ISR | 60s | Projects (domain=backend), 3 recent BlogPosts tagged Backend |
| `/web3` | ISR | 60s | Projects (domain=web3), 3 recent BlogPosts tagged Web3 |
| `/blog` | ISR | 60s | All published BlogPosts |
| `/blog/[slug]` | SSG + ISR | 3600s | Single BlogPost by slug |
| `/work/[slug]` | SSG + ISR | 3600s | Single Project by slug |

All data fetching uses the **Payload local API** (`import { getPayload } from 'payload'`) directly in server components — no HTTP, no CORS, auto-typed via `payload-types.ts`.

`generateStaticParams` on `/blog/[slug]` and `/work/[slug]` pre-renders all published slugs at build time.

---

## 5. Theming

CSS custom properties in `src/app/globals.css`:

```css
:root { /* light */ }
.dark { /* dark — matches design exactly */ }
[data-domain="ai"]    { --accent: #8b5cf6; --accent-soft: rgba(139,92,246,.12); }
[data-domain="backend"] { --accent: #38bdf8; --accent-soft: rgba(56,189,248,.13); }
[data-domain="web3"]  { --accent: #f5b942; --accent-soft: rgba(245,185,66,.13); }
```

Variables: `--bg`, `--nav`, `--surface`, `--surface-2`, `--border`, `--ink`, `--muted`, `--faint`, `--accent`, `--accent-soft` — exact values from the design.

`ThemeProvider` is a client component that reads `localStorage('theme')` on mount and sets `class="dark"` on `<html>`. An inline `<script>` in `layout.tsx` sets the class synchronously before paint to prevent flash.

Domain accent is set via `data-domain` on `<html>` by each page's layout or a client wrapper that reads `usePathname()`.

**Fonts** via `next/font/google`: Inter (400/450/500/600), Inter Tight (400/500/600/700/800), JetBrains Mono (400/500/600).

**Tailwind CSS v4** for layout/spacing. Theme colors use CSS variables, not Tailwind tokens.

---

## 6. Component Responsibilities

| Component | Type | Responsibility |
|---|---|---|
| `Nav` | Server shell + client `usePathname` wrapper | Sticky nav, active tab highlighting, logo, theme toggle, contact button |
| `ThemeProvider` | Client | Reads localStorage, sets `class` on `<html>`, provides toggle |
| `ThemeToggle` | Client | Sun/moon button, calls ThemeProvider toggle |
| `AnimatedCounter` | Client | requestAnimationFrame cubic ease-out counter; takes `target` and `format` props |
| `Typewriter` | Client | setInterval character-by-character; takes `code` string from HeroContent global |
| `ProjectCard` | Server | Card UI for a project; hover via Tailwind group-hover |
| `RichText` | Server | Thin wrapper around `@payloadcms/richtext-lexical/react` |
| `TocSidebar` | Client | Scroll-tracking TOC for blog/case-study pages; highlights active section |
| `Footer` | Server | Email, GitHub link, location |

---

## 7. SEO & Meta

- `generateMetadata` in every page — `title` and `description` from Payload content; fallback from `SiteSettings` global.
- `src/app/sitemap.ts` — queries all published `BlogPosts` and `Projects` slugs via local API; returns Next.js sitemap entries.
- `src/app/robots.ts` — allows all, disallows `/admin`.
- `src/app/opengraph-image.tsx` — static OG image using the "A" logo gradient from the design.

---

## 8. Error Handling

- Unknown slugs on `/blog/[slug]` and `/work/[slug]`: Payload returns `null` → call `notFound()` → Next.js renders `not-found.tsx`.
- `src/app/(frontend)/not-found.tsx` — minimal 404 page matching site theme.
- `src/app/(frontend)/error.tsx` — catches unexpected server component errors; shows a generic error state.
- Payload local API calls in server components wrapped in try/catch; on failure return empty arrays (pages render with no content rather than crashing).

---

## 9. Environment Variables

| Variable | Purpose |
|---|---|
| `DATABASE_URI` | MongoDB Atlas connection string |
| `PAYLOAD_SECRET` | 32-char random secret for Payload auth/sessions |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL (e.g. `https://ayushchaudhari.dev`) |

---

## 10. Deployment

- **Platform:** Vercel (single deployment, Payload 3.x is serverless-compatible)
- **Database:** MongoDB Atlas (free tier sufficient)
- **Media storage:** Local disk in dev; Vercel Blob (via `@payloadcms/storage-vercel-blob`) in production — one adapter line in `payload.config.ts`
- **Admin UI:** Payload's built-in admin at `/admin`; the "Admin" nav link in the portfolio points there

---

## 11. Out of Scope

- Authentication for the public portfolio pages (admin is Payload's own auth)
- Comment system
- Newsletter / email capture
- Analytics (can be added later via a script tag in layout)
