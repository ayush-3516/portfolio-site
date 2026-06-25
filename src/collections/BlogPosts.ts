import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const BlogPosts: CollectionConfig = {
  slug: 'blog-posts',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'tag', 'status', 'publishedAt'] },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { description: 'e.g. "rag-across-40-languages"' },
    },
    { name: 'tag', type: 'relationship', relationTo: 'tags' },
    { name: 'readTime', type: 'text', admin: { description: 'e.g. "8 min"' } },
    { name: 'excerpt', type: 'textarea', required: true },
    { name: 'publishedAt', type: 'date' },
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
    { name: 'body', type: 'richText', editor: lexicalEditor({}) },
    {
      name: 'relatedPosts',
      type: 'relationship',
      relationTo: 'blog-posts',
      hasMany: true,
      maxRows: 3,
    },
  ],
}
