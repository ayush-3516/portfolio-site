'use client'
import { useEffect, useState } from 'react'

export type TocItem = { id: string; label: string }

export function TocSidebar({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState(items[0]?.id ?? '')

  useEffect(() => {
    const handler = () => {
      let current = items[0]?.id ?? ''
      for (const item of items) {
        const el = document.getElementById(item.id)
        if (el && el.getBoundingClientRect().top <= 120) current = item.id
      }
      setActive(current)
    }
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [items])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 90, behavior: 'smooth' })
  }

  return (
    <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => scrollTo(item.id)}
          style={{
            padding: '6px 14px',
            marginLeft: -1,
            fontSize: 13,
            color: active === item.id ? 'var(--accent)' : 'var(--muted)',
            fontFamily: "'Inter Tight', sans-serif",
            fontWeight: active === item.id ? 600 : 400,
            cursor: 'pointer',
            background: 'none',
            border: 'none',
            borderLeft: `2px solid ${active === item.id ? 'var(--accent)' : 'transparent'}`,
            textAlign: 'left',
          }}
        >
          {item.label}
        </button>
      ))}
    </nav>
  )
}
