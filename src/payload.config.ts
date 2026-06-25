import { buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { Users } from './collections/Users'
import { Projects } from './collections/Projects'
import { BlogPosts } from './collections/BlogPosts'
import { Tags } from './collections/Tags'
import { Media } from './collections/Media'
import { HeroContent } from './globals/HeroContent'
import { SiteSettings } from './globals/SiteSettings'
import { StackSection } from './globals/StackSection'
import { MetricsBand } from './globals/MetricsBand'
import { Timeline } from './globals/Timeline'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: 'users',
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Projects, BlogPosts, Tags, Media],
  globals: [HeroContent, SiteSettings, StackSection, MetricsBand, Timeline],
  editor: lexicalEditor({}),
  db: mongooseAdapter({ url: process.env.DATABASE_URI! }),
  secret: process.env.PAYLOAD_SECRET!,
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  sharp,
})
