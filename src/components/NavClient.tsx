'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
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

export function NavClient({
  githubUrl,
  resumeUrl,
  email,
}: {
  githubUrl: string
  resumeUrl: string
  email: string
}) {
  const pathname = usePathname()

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        gap: 24,
        padding: '14px 36px',
        background: 'var(--nav)',
        backdropFilter: 'blur(18px)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 9,
            background: 'linear-gradient(140deg, var(--accent), #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'Inter Tight', sans-serif",
            fontWeight: 800,
            color: '#fff',
            fontSize: 15,
          }}
        >
          A
        </div>
        <span
          style={{
            fontFamily: "'Inter Tight', sans-serif",
            fontWeight: 700,
            fontSize: 15,
            color: 'var(--ink)',
            letterSpacing: '-0.02em',
          }}
        >
          Ayush Chaudhari
        </span>
      </Link>

      <div style={{ flex: 1 }} />

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          padding: 4,
          background: 'var(--surface-2)',
          border: '1px solid var(--border)',
          borderRadius: 11,
        }}
      >
        {tabs.map((t) => (
          <Link key={t.href} href={t.href} style={tabStyle(pathname === t.href)}>
            {t.label}
          </Link>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Link href="/blog" style={linkStyle(pathname.startsWith('/blog'))}>Blog</Link>
        <a href="/admin" style={linkStyle(false)}>Admin</a>
      </div>

      <ThemeToggle />

      <a
        href={`mailto:${email}`}
        style={{
          padding: '9px 18px',
          borderRadius: 10,
          background: 'var(--ink)',
          color: 'var(--bg)',
          fontSize: 13,
          fontWeight: 600,
          fontFamily: "'Inter Tight', sans-serif",
          textDecoration: 'none',
        }}
      >
        Contact
      </a>
    </nav>
  )
}
