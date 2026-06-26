# Content Workflow

How Claude manages portfolio content via Payload CMS.

Content goes into Payload — never hardcoded in the codebase.

---

## Adding a Project

When asked to add a project (from a GitHub repo, description, or bullet points):

### What to generate

| Field | Guidance |
|---|---|
| `title` | Short, clean project name. No "App" or "Platform" suffix unless essential. |
| `slug` | Lowercase, hyphenated. Derived from title. e.g. `meraki`, `d2d-chatbot` |
| `domain` | `ai` / `backend` / `web3` / `fullstack` — pick the primary one |
| `tag` | All-caps label shown on the card. e.g. `FLAGSHIP`, `RAG`, `AGENTS`, `GO · REST` |
| `metric` | One concrete outcome. e.g. `50K+ leads`, `40+ langs`, `~95% cost cut`. Only use real numbers from the user or repository — never fabricate. |
| `excerpt` | 1–2 sentences. Technical, concise, recruiter-readable. No marketing language. |
| `stack` | Technologies separated by ` · `. e.g. `Python · Flask · MongoDB` |
| `status` | `draft` until the user confirms, then `published` |
| `featured` | `false` by default — ask the user before setting to `true` |
| `order` | Set to one higher than the current max order in the same domain |
| `body` | Full case study (see structure below) |

### Case study body structure

Write the `body` as Lexical rich text with these sections:

1. **Overview** — What the project is and why it was built
2. **Problem** — The technical or business problem solved
3. **Architecture** — Key design decisions, services, data flow
4. **Implementation** — Notable engineering details (auth, performance, migrations, etc.)
5. **Outcome** — Real results only. No fabricated metrics.

Keep each section focused. Use code blocks for snippets where helpful.

### If a GitHub repository is provided

Read:
- `README.md` — purpose, features, setup
- `package.json` / `requirements.txt` / `go.mod` — technologies
- Top-level `src/` or `app/` structure — architecture clues

Extract only what is documented. Do not invent features. Do not invent metrics.

---

## Adding a Blog Post

When asked to write a blog post:

### What to generate

| Field | Guidance |
|---|---|
| `title` | Specific, technical, direct. Avoid clickbait. |
| `slug` | Lowercase, hyphenated. e.g. `rag-across-40-languages` |
| `tag` | Match an existing Tag in the `tags` collection. Create one if needed. |
| `readTime` | Estimate: ~200 words per minute. e.g. `8 min` |
| `excerpt` | 1–2 sentences. What the reader will learn. |
| `publishedAt` | Today's date unless told otherwise |
| `status` | `draft` until the user confirms |
| `body` | Full article (see structure below) |
| `relatedPosts` | Link up to 3 existing blog posts with related topics |

### Blog post body structure

1. **Opening** — The problem or situation that motivated the article
2. **Context** — Background the reader needs
3. **The approach** — What was built, designed, or decided and why
4. **Details** — Implementation specifics with code snippets where useful
5. **Outcome / Lessons** — What worked, what didn't, what to do differently

Write for a technical audience. Assume the reader is a senior engineer. No padding.

---

## Adding Tags

Tags are shared across Projects and Blog Posts.

Before creating a new tag, check if one already exists in the `tags` collection.

Tag fields:
- `name` — Display name. e.g. `LLM`, `RAG`, `Architecture`
- `slug` — Lowercase, hyphenated. e.g. `llm`, `rag`, `architecture`
- `color` — Hex color for the tag pill. Match domain if relevant (AI=purple, Backend=sky, Web3=amber)

---

## Updating Globals

### Hero Content (`hero-content`)

Only update when explicitly asked. Fields:
- `headline` — The H1. Keep it sharp and direct.
- `subheadline` — 2–3 sentences expanding on the headline.
- `locationLine` — Role and location. e.g. `Backend & Generative AI Engineer · Ahmedabad, India`
- `statusBadgeText` — The availability badge. e.g. `Open to backend & AI roles.`
- `terminalCode` — The typewriter snippet. Keep it as a short Python/TypeScript function that shows something real from the work.

### Metrics Band (`metrics-band`)

Four stat highlights on the home page. Only use real numbers. Fields: `m1Value`, `m1Label` through `m4Value`, `m4Label`.

### Stack Section (`stack-section`)

The "Tech, by domain" grid. Groups are ordered arrays with `domain` and `items[].item`. Update when the tech stack changes meaningfully.

### Timeline (`timeline`)

Work experience entries. Fields: `time`, `role`, `org`, `place`. Add new entries at the top of the array (most recent first).

---

## Content Quality Rules

**Always:**
- Write in the first person (this is a personal portfolio)
- Be specific — name the technology, the constraint, the tradeoff
- Use real numbers from the user or repository only

**Never:**
- Exaggerate impact or scale
- Fabricate users, traffic, or metrics
- Use marketing language ("revolutionary", "cutting-edge", "seamless")
- Invent features not present in the repository or description
- Leave `status: published` on a project the user hasn't reviewed

---

## SEO Generation

When generating SEO for a project or blog post:

| Field | Guidance |
|---|---|
| Meta Title | `{Project/Post Title} — Ayush Chaudhari`. Max 60 chars. |
| Meta Description | 1 sentence. What it is + the key technical achievement. Max 155 chars. |
| OG Description | Same as meta description or slightly expanded. |
| Slug | Already set as the canonical URL path. |

---

## Bulk Operations

### Import multiple projects

When given a list of repositories or project descriptions:

1. Process one at a time.
2. Generate all fields for each.
3. Save each as `draft`.
4. List what was created and ask the user to review before publishing.

### Generate missing SEO

When asked to fill in missing SEO:

1. Query all projects/posts where `metaTitle` or `metaDescription` is empty.
2. Generate for each.
3. Update via Payload.
4. Report what was updated.

### Rewrite descriptions

When asked to rewrite project descriptions to be "concise" or "recruiter-friendly":

- Shorten excerpts to 1–2 tight sentences.
- Lead with the technical achievement, not the project name.
- Remove filler. Every word should earn its place.
- Save as `draft` and report changes before publishing.

---

## Typical Prompts

After setup these prompts should work end-to-end:

```
Analyze github.com/ayush-3516/mindshelf and create a portfolio project entry.
```

```
Write a technical blog post about how I built the multi-provider LLM fallback chain in Meraki.
```

```
Generate SEO metadata for all projects that are missing it.
```

```
Rewrite all project excerpts to be concise and recruiter-friendly.
```

```
Update the timeline — I just started at ThriveTogether as a Backend Engineer in June 2025.
```
