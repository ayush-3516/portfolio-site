'use client'
import { useEffect } from 'react'

export function DomainAccent({ domain }: { domain: 'ai' | 'backend' | 'web3' | '' }) {
  useEffect(() => {
    document.documentElement.setAttribute('data-domain', domain)
    return () => document.documentElement.removeAttribute('data-domain')
  }, [domain])
  return null
}
