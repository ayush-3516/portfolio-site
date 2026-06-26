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
    <div data-domain="backend">
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
        <div className="section-wide proof-grid" style={{ paddingTop: 36, paddingBottom: 36 }}>
          {proof.map((p) => (
            <div key={p.big}>
              <div style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 800, fontSize: 32, color: 'var(--accent)', letterSpacing: '-0.02em' }}>{p.big}</div>
              <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>{p.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="section-wide" style={{ paddingTop: 60, paddingBottom: 40 }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'var(--accent)', marginBottom: 10 }}>BACKEND PROJECTS</div>
        <h2 style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 700, fontSize: 32, color: 'var(--ink)', letterSpacing: '-0.02em', marginBottom: 32 }}>Systems I've built</h2>
        <div className="projects-grid">
          {projects.map((p) => <ProjectCard key={p.id} project={p} />)}
        </div>
      </section>

      {recentPosts.length > 0 && (
        <section className="section-wide" style={{ paddingTop: 20, paddingBottom: 60 }}>
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
