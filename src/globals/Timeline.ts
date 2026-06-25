import type { GlobalConfig } from 'payload'

export const Timeline: GlobalConfig = {
  slug: 'timeline',
  fields: [
    {
      name: 'entries',
      type: 'array',
      fields: [
        { name: 'time', type: 'text', required: true },
        { name: 'role', type: 'text', required: true },
        { name: 'org', type: 'text', required: true },
        { name: 'place', type: 'text', required: true },
      ],
    },
  ],
}
