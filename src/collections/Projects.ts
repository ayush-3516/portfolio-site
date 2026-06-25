import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'domain', 'status', 'updatedAt'] },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { description: 'Auto-fill from title. e.g. "meraki"' },
    },
    {
      name: 'domain',
      type: 'select',
      required: true,
      options: [
        { label: 'AI / LLM', value: 'ai' },
        { label: 'Backend', value: 'backend' },
        { label: 'Web3', value: 'web3' },
        { label: 'Full Stack', value: 'fullstack' },
      ],
    },
    { name: 'tag', type: 'text', admin: { description: 'e.g. FLAGSHIP, RAG, AGENTS' } },
    { name: 'metric', type: 'text', admin: { description: 'e.g. 50K+ leads' } },
    { name: 'excerpt', type: 'textarea', required: true },
    { name: 'stack', type: 'text', admin: { description: 'e.g. Python · Flask · MongoDB' } },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Published', value: 'published' },
        { label: 'Draft', value: 'draft' },
        { label: 'Scheduled', value: 'scheduled' },
      ],
    },
    { name: 'scheduledAt', type: 'date', admin: { condition: (data) => data.status === 'scheduled' } },
    { name: 'featured', type: 'checkbox', defaultValue: false, admin: { description: 'Show on Home page' } },
    { name: 'body', type: 'richText', editor: lexicalEditor({}) },
    { name: 'order', type: 'number', defaultValue: 0, admin: { description: 'Lower = first' } },
  ],
}
