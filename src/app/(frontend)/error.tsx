'use client'
export default function Error({ reset }: { reset: () => void }) {
  return (
    <div style={{ maxWidth: 480, margin: '120px auto', textAlign: 'center', padding: '0 36px' }}>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'var(--accent)', marginBottom: 16 }}>
        Error
      </div>
      <h1 style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 800, fontSize: 32, color: 'var(--ink)', marginBottom: 12 }}>
        Something went wrong
      </h1>
      <button
        onClick={reset}
        style={{
          padding: '11px 22px',
          borderRadius: 10,
          background: 'var(--accent)',
          color: '#fff',
          fontSize: 14,
          fontWeight: 600,
          fontFamily: "'Inter Tight', sans-serif",
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Try again
      </button>
    </div>
  )
}
