import type { CollectionConfig } from 'payload'

export const Tags: CollectionConfig = {
  slug: 'tags',
  admin: { useAsTitle: 'name' },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { description: 'Lowercase, hyphenated. e.g. "ai-llm"' },
    },
    { name: 'color', type: 'text', admin: { description: 'Hex color e.g. #8b5cf6' } },
  ],
}
