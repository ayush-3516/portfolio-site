import type { GlobalConfig } from 'payload'

export const HeroContent: GlobalConfig = {
  slug: 'hero-content',
  fields: [
    { name: 'headline', type: 'text', required: true },
    { name: 'subheadline', type: 'textarea', required: true },
    { name: 'locationLine', type: 'text', required: true },
    { name: 'statusBadgeText', type: 'text', required: true },
    { name: 'terminalCode', type: 'textarea', required: true },
  ],
}
