import type { GlobalConfig } from 'payload'

export const MetricsBand: GlobalConfig = {
  slug: 'metrics-band',
  fields: [
    { name: 'm1Value', type: 'text', required: true, admin: { description: 'e.g. 50000' } },
    { name: 'm1Label', type: 'text', required: true, admin: { description: 'e.g. leads co-managed' } },
    { name: 'm2Value', type: 'text', required: true },
    { name: 'm2Label', type: 'text', required: true },
    { name: 'm3Value', type: 'text', required: true },
    { name: 'm3Label', type: 'text', required: true },
    { name: 'm4Value', type: 'text', required: true },
    { name: 'm4Label', type: 'text', required: true },
  ],
}
