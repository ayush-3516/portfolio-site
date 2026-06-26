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
