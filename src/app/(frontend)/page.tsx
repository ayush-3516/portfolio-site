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
            <span style={{ width: 7, height: 7, borderRadius: 99, background: 'var(--color-online)', boxShadow: '0 0 8px var(--color-online)' }} />
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
            <Link key={card.href} href={card.href} style={{ flex: 1, minWidth: 180, padding: '16px 18px', borderRadius: 13, border: '1px solid var(--border)', background: 'var(--surface-2)', textDecoration: 'none', display: 'block', '--card-accent': card.accent } as React.CSSProperties}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--card-accent)', marginBottom: 5 }}>{card.path}</div>
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
