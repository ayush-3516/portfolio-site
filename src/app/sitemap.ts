import type { MetadataRoute } from 'next'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

  const static_: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/ai`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/backend`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/web3`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
  ]

  // Only query Payload at runtime — PAYLOAD_SECRET is not available at build time
  if (!process.env.PAYLOAD_SECRET) return static_

  try {
    const { getCachedPayload } = await import('@/lib/payload')
    const payload = await getCachedPayload()
    const [posts, projects] = await Promise.all([
      payload.find({ collection: 'blog-posts', where: { status: { equals: 'published' } }, limit: 500 }).then((r) => r.docs).catch(() => []),
      payload.find({ collection: 'projects', where: { status: { equals: 'published' } }, limit: 500 }).then((r) => r.docs).catch(() => []),
    ])

    const postUrls: MetadataRoute.Sitemap = posts.map((p) => ({
      url: `${base}/blog/${p.slug}`,
      lastModified: p.publishedAt ? new Date(p.publishedAt) : new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    }))

    const projectUrls: MetadataRoute.Sitemap = projects.map((p) => ({
      url: `${base}/work/${p.slug}`,
      lastModified: new Date(p.updatedAt),
      changeFrequency: 'monthly',
      priority: 0.6,
    }))

    return [...static_, ...postUrls, ...projectUrls]
  } catch {
    return static_
  }
}
