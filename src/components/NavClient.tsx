'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
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

export function NavClient({ githubUrl, resumeUrl, email }: { githubUrl: string; resumeUrl: string; email: string }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <nav className="nav-inner" style={{ flexWrap: 'wrap' }}>
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
        <div style={{ width: 30, height: 30, borderRadius: 9, background: 'linear-gradient(140deg, var(--accent), var(--color-logo-end))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter Tight', sans-serif", fontWeight: 800, color: '#fff', fontSize: 15, flexShrink: 0 }}>
          A
        </div>
        <span style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 700, fontSize: 15, color: 'var(--ink)', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
          Ayush Chaudhari
        </span>
      </Link>

      <div style={{ flex: 1 }} />

      <div className="nav-tabs">
        {tabs.map((t) => (
          <Link key={t.href} href={t.href} style={tabStyle(pathname === t.href)}>
            {t.label}
          </Link>
        ))}
      </div>

      <div className="nav-links">
        <Link href="/blog" style={linkStyle(pathname.startsWith('/blog'))}>Blog</Link>
        <a href="/admin" style={linkStyle(false)}>Admin</a>
      </div>

      <ThemeToggle />

      {/* Hamburger — only visible on mobile */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Menu"
        style={{ display: 'none', width: 36, height: 36, borderRadius: 10, border: '1px solid var(--border)', background: 'var(--surface)', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--ink)', fontSize: 18, flexShrink: 0 }}
        className="nav-mobile-menu"
      >
        {open ? '✕' : '☰'}
      </button>

      <a href={`mailto:${email}`} className="nav-contact" style={{ padding: '9px 18px', borderRadius: 10, background: 'var(--ink)', color: 'var(--bg)', fontSize: 13, fontWeight: 600, fontFamily: "'Inter Tight', sans-serif", textDecoration: 'none', flexShrink: 0 }}>
        Contact
      </a>

      {/* Mobile dropdown */}
      {open && (
        <div style={{ width: '100%', borderTop: '1px solid var(--border)', paddingTop: 16, paddingBottom: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {[...tabs.map(t => ({ label: t.label, href: t.href })), { label: 'Blog', href: '/blog' }, { label: 'Admin', href: '/admin' }].map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)} style={{ padding: '10px 4px', fontSize: 15, fontWeight: pathname === item.href ? 600 : 400, color: pathname === item.href ? 'var(--accent)' : 'var(--ink)', textDecoration: 'none', fontFamily: "'Inter Tight', sans-serif" }}>
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
