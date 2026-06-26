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
    <div className="section-wide" style={{ paddingTop: 80, paddingBottom: 60 }}>
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
