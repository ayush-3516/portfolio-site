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
