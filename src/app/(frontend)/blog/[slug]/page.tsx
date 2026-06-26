import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCachedPayload } from '@/lib/payload'
import { RichText } from '@/components/RichText'
import { TocSidebar } from '@/components/TocSidebar'
import type { TocItem } from '@/components/TocSidebar'

export const revalidate = 3600
export const dynamicParams = true

export async function generateStaticParams() {
  return []
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const payload = await getCachedPayload()
  const result = await payload.find({ collection: 'blog-posts', where: { slug: { equals: slug } }, limit: 1 }).catch(() => null)
  const post = result?.docs[0]
  if (!post) return {}
  return { title: `${post.title} — Ayush Chaudhari`, description: post.excerpt ?? '' }
}

function extractToc(body: unknown): TocItem[] {
  try {
    const root = (body as any)?.root?.children ?? []
    const items: TocItem[] = []
    for (const node of root) {
      if (node.type === 'heading' && (node.tag === 'h2' || node.tag === 'h3')) {
        const text = node.children?.map((c: any) => c.text ?? '').join('') ?? ''
        if (text) {
          const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
          items.push({ id, label: text })
        }
      }
    }
    return items.length > 0 ? items : [{ id: 'intro', label: 'Introduction' }]
  } catch {
    return [{ id: 'intro', label: 'Introduction' }]
  }
}

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

  const toc = extractToc(post.body)
  const tagName = typeof post.tag === 'object' && post.tag !== null ? (post.tag as any).name : String(post.tag ?? '')
  const publishedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : ''

  return (
    <div className="section-wide article-grid" style={{ paddingTop: 60, paddingBottom: 60 }}>
      <article>
        <Link href="/blog" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'var(--accent)', marginBottom: 28, display: 'inline-block', textDecoration: 'none' }}>
          ← Blog
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          {tagName && (
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--accent)', padding: '4px 9px', borderRadius: 7, background: 'var(--accent-soft)' }}>
              {tagName}
            </span>
          )}
          {post.readTime && (
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--faint)' }}>{post.readTime}</span>
          )}
          {publishedDate && (
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--faint)', marginLeft: 'auto' }}>{publishedDate}</span>
          )}
        </div>
        <h1 style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 800, fontSize: 44, lineHeight: 1.1, letterSpacing: '-0.03em', color: 'var(--ink)', marginBottom: 24 }}>
          {post.title}
        </h1>
        <p style={{ fontSize: 18, lineHeight: 1.65, color: 'var(--muted)', marginBottom: 40, maxWidth: 680, borderBottom: '1px solid var(--border)', paddingBottom: 40 }}>
          {post.excerpt}
        </p>

        {post.body && <RichText data={post.body as Record<string, unknown>} />}

        {relatedPosts.length > 0 && (
          <div style={{ marginTop: 60, paddingTop: 40, borderTop: '1px solid var(--border)' }}>
            <h3 style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 700, fontSize: 18, color: 'var(--ink)', marginBottom: 16 }}>Related reading</h3>
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
        <TocSidebar items={toc} />
      </aside>
    </div>
  )
}
