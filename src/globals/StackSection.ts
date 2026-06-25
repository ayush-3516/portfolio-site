import type { GlobalConfig } from 'payload'

export const StackSection: GlobalConfig = {
  slug: 'stack-section',
  fields: [
    {
      name: 'groups',
      type: 'array',
      fields: [
        { name: 'domain', type: 'text', required: true },
        {
          name: 'items',
          type: 'array',
          fields: [{ name: 'item', type: 'text', required: true }],
        },
      ],
    },
  ],
}
