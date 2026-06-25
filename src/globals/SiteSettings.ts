import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  fields: [
    { name: 'email', type: 'email', required: true },
    { name: 'githubUrl', type: 'text', required: true },
    { name: 'resumeUrl', type: 'text' },
    { name: 'metaTitle', type: 'text', required: true },
    { name: 'metaDescription', type: 'textarea', required: true },
  ],
}
