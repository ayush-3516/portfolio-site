import Link from 'next/link'

export default function NotFound() {
  return (
    <div
      style={{
        maxWidth: 480,
        margin: '120px auto',
        textAlign: 'center',
        padding: '0 36px',
      }}
    >
      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 12,
          color: 'var(--accent)',
          marginBottom: 16,
        }}
      >
        404
      </div>
      <h1
        style={{
          fontFamily: "'Inter Tight', sans-serif",
          fontWeight: 800,
          fontSize: 32,
          color: 'var(--ink)',
          marginBottom: 12,
        }}
      >
        Page not found
      </h1>
      <p style={{ fontSize: 15, color: 'var(--muted)', marginBottom: 32 }}>
        This page doesn&apos;t exist or was removed.
      </p>
      <Link
        href="/"
        style={{
          padding: '11px 22px',
          borderRadius: 10,
          background: 'var(--accent)',
          color: '#fff',
          fontSize: 14,
          fontWeight: 600,
          fontFamily: "'Inter Tight', sans-serif",
          textDecoration: 'none',
        }}
      >
        Go home
      </Link>
    </div>
  )
}
