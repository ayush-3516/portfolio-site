'use client'
import { useEffect, useRef, useState } from 'react'

export function AnimatedCounter({
  target,
  suffix = '',
  duration = 1400,
}: {
  target: number
  suffix?: string
  duration?: number
}) {
  const [value, setValue] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    if (started.current) return
    started.current = true
    const t0 = performance.now()
    const ease = (x: number) => 1 - Math.pow(1 - x, 3)
    const tick = (now: number) => {
      const k = Math.min(1, (now - t0) / duration)
      setValue(Math.round(target * ease(k)))
      if (k < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [target, duration])

  const formatted = target >= 1000 ? `${Math.round(value / 1000)}K+` : `${value}${suffix}`
  return <>{formatted}</>
}
