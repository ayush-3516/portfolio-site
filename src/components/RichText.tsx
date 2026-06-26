'use client'
import { RichText as PayloadRichText } from '@payloadcms/richtext-lexical/react'
import type { JSXConverters } from '@payloadcms/richtext-lexical/react'

const headingStyle = (tag: string) => ({
  fontFamily: "'Inter Tight', sans-serif",
  fontWeight: 700,
  color: 'var(--ink)',
  letterSpacing: '-0.02em',
  marginTop: '2.2em',
  marginBottom: '0.6em',
  lineHeight: 1.2,
  fontSize: tag === 'h2' ? 24 : tag === 'h3' ? 19 : 16,
})

function textToId(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function nodeText(node: any): string {
  if (node.text) return node.text
  if (Array.isArray(node.children)) return node.children.map(nodeText).join('')
  return ''
}

const converters: JSXConverters = {
  code: ({ node }) => {
    const text = nodeText(node)
    return (
      <pre key={text.slice(0, 20)} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px 24px', overflowX: 'auto', margin: '1.6em 0', lineHeight: 1.7, color: 'var(--ink)', fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>
        <code>{text}</code>
      </pre>
    )
  },
  heading: ({ node, nodesToJSX }) => {
    const tag = node.tag as 'h1' | 'h2' | 'h3' | 'h4'
    const text = nodeText(node)
    const id = textToId(text)
    const children = nodesToJSX({ nodes: node.children ?? [] })
    const Tag = tag
    return <Tag key={id} id={id} style={headingStyle(tag)}>{children}</Tag>
  },
}

export function RichText({ data }: { data: Record<string, unknown> }) {
  return (
    <div className="rich-text">
      <PayloadRichText
        data={data as any}
        converters={({ defaultConverters }) => ({ ...defaultConverters, ...converters })}
      />
    </div>
  )
}
