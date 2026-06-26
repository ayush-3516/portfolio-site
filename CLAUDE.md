# Portfolio Site — Claude Code Guide

Personal portfolio for Ayush Chaudhari (Backend & Generative AI Engineer).

## Primary Goals

- Never break the existing UI or design tokens.
- Use existing components instead of creating duplicates.
- Keep changes incremental and reviewable.
- Avoid unnecessary dependencies.
- Maintain strict TypeScript throughout.

---

## Tech Stack

- **Next.js 16** — App Router, server components by default
- **Payload CMS 3.x** — local API only (no HTTP fetch to `/api`)
- **TypeScript** — strict mode, no `any`
- **Tailwind CSS v4** — layout/spacing only; all colors via CSS custom properties
- **MongoDB Atlas** — via `@payloadcms/db-mongodb`
- **pnpm** — package manager

---

## Architecture

### Route Groups

- `src/app/(frontend)/` — public-facing Next.js pages
- `src/app/(payload)/` — Payload admin (auto-generated, do not edit)
- `src/app/api/` — Payload REST API (auto-generated, do not edit)

### Data Fetching

Always use the Payload local API via `getCachedPayload()` from `src/lib/payload.ts`:

```ts
import { getCachedPayload } from '@/lib/payload'

const payload = await getCachedPayload()
const result = await payload.find({ collection: 'projects', ... })
```

Never use `fetch('/api/...')` from server components. Never import Payload collections directly — go through the local API.

### Payload Collections

| Collection slug | File | Purpose |
|---|---|---|
| `projects` | `src/collections/Projects.ts` | Portfolio case studies |
| `blog-posts` | `src/collections/BlogPosts.ts` | Technical blog articles |
| `tags` | `src/collections/Tags.ts` | Tags shared by projects and posts |
| `media` | `src/collections/Media.ts` | Images for rich-text bodies |
| `users` | `src/collections/Users.ts` | Payload admin auth (do not modify) |

### Payload Globals (singletons)

| Global slug | Fields |
|---|---|
| `hero-content` | `headline`, `subheadline`, `locationLine`, `statusBadgeText`, `terminalCode` |
| `site-settings` | `email`, `githubUrl`, `resumeUrl`, `metaTitle`, `metaDescription` |
| `stack-section` | `groups[].domain`, `groups[].items[].item` |
| `metrics-band` | `m1Value`, `m1Label`, `m2Value`, `m2Label`, `m3Value`, `m3Label`, `m4Value`, `m4Label` |
| `timeline` | `entries[].time`, `entries[].role`, `entries[].org`, `entries[].place` |

### Projects Collection Fields

```
title (text, required)
slug (text, unique)           — e.g. "meraki"
domain (select)               — ai | backend | web3 | fullstack
tag (text)                    — e.g. "FLAGSHIP", "RAG", "AGENTS"
metric (text)                 — e.g. "50K+ leads"
excerpt (textarea, required)  — shown on cards, 1–2 sentences
stack (text)                  — e.g. "Python · Flask · MongoDB"
status (select)               — published | draft | scheduled
scheduledAt (date)            — only if status=scheduled
featured (checkbox)           — shows on Home page
body (richText/Lexical)       — full case study
order (number)                — lower = first in list
```

### BlogPosts Collection Fields

```
title (text, required)
slug (text, unique)           — e.g. "rag-across-40-languages"
tag (relationship → tags)
readTime (text)               — e.g. "8 min"
excerpt (textarea, required)
publishedAt (date)
status (select)               — published | draft | scheduled
body (richText/Lexical)
relatedPosts (relationship → blog-posts, hasMany, max 3)
```

### Theming

All colors are CSS custom properties. Never hardcode hex in component styles.

```css
/* Available variables */
--bg, --nav, --surface, --surface-2, --border
--ink, --muted, --faint
--accent, --accent-soft
--color-online   /* #22c55e — availability status dot */
--color-logo-end /* #8b5cf6 — logo gradient end color */
```

Domain accent overrides via `data-domain` attribute:
- `data-domain="ai"` → purple accent
- `data-domain="backend"` → sky accent
- `data-domain="web3"` → amber accent

### Component Inventory

| Component | Type | Location |
|---|---|---|
| `Nav` | Server + client | `src/components/Nav.tsx` |
| `Footer` | Server | `src/components/Footer.tsx` |
| `ThemeProvider` | Client | `src/components/ThemeProvider.tsx` |
| `ThemeToggle` | Client | `src/components/ThemeToggle.tsx` |
| `AnimatedCounter` | Client | `src/components/AnimatedCounter.tsx` |
| `Typewriter` | Client | `src/components/Typewriter.tsx` |
| `ProjectCard` | Server | `src/components/ProjectCard.tsx` |
| `RichText` | Server | `src/components/RichText.tsx` |
| `TocSidebar` | Client | `src/components/TocSidebar.tsx` |
| `DomainAccent` | Client | `src/components/DomainAccent.tsx` |

### ISR / Rendering

| Route | Revalidate |
|---|---|
| `/`, `/ai`, `/backend`, `/web3`, `/blog` | 60s |
| `/blog/[slug]`, `/work/[slug]` | 3600s |

---

## Code Standards

- No `any` types
- No dead code
- No commented-out code
- Prefer small, focused files with one clear responsibility
- Server components by default — only add `"use client"` when the component needs browser APIs or React hooks
- All Payload calls wrapped in `.catch()` to prevent page crashes

---

## After Every Change

Always run before committing:

```bash
pnpm tsc --noEmit
pnpm lint
```

Never leave the repo with TypeScript errors. Never leave broken imports.

---

## Payload MCP

The `@payloadcms/plugin-mcp` plugin is installed and registered in `payload.config.ts`. The MCP server is configured in `.claude/settings.json` and connects to `http://localhost:3000/api/mcp`.

**The dev server must be running** (`pnpm dev`) for MCP tools to work.

### Generating your API key (one-time setup)

1. Start the dev server: `pnpm dev`
2. Go to `http://localhost:3000/admin`
3. In the sidebar, find **MCP → API Keys**
4. Create a new key with access to: Projects, Blog Posts, Tags, Media
5. Copy the generated key
6. Replace `REPLACE_WITH_API_KEY_FROM_ADMIN` in `.claude/settings.json` with the real key
7. Restart Claude Code so it picks up the new MCP server

### Using MCP tools

Once connected, use Payload MCP tools to create and update content — never edit the database directly.

Available collections via MCP: `projects`, `blog-posts`, `tags`, `media`

See `docs/CONTENT_WORKFLOW.md` for the full content creation workflow.
