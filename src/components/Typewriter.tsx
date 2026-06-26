'use client'
import { useEffect, useRef, useState } from 'react'

export function Typewriter({ code }: { code: string }) {
  const [typed, setTyped] = useState('')
  const done = useRef(false)

  useEffect(() => {
    if (done.current) return
    done.current = true
    let i = 0
    const id = setInterval(() => {
      i += 2
      setTyped(code.slice(0, i))
      if (i >= code.length) clearInterval(id)
    }, 22)
    return () => clearInterval(id)
  }, [code])

  return (
    <pre
      style={{
        padding: 20,
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 13,
        lineHeight: 1.7,
        color: 'var(--muted)',
        whiteSpace: 'pre-wrap',
        minHeight: 240,
      }}
    >
      {typed}
      <span
        style={{
          display: 'inline-block',
          width: 8,
          height: 15,
          background: 'var(--accent)',
          verticalAlign: '-2px',
          animation: 'blink 1s step-end infinite',
        }}
      />
    </pre>
  )
}
