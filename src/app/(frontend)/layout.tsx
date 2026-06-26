import type { Metadata } from 'next'
import { Inter, Inter_Tight, JetBrains_Mono } from 'next/font/google'
import { getCachedPayload } from '@/lib/payload'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { ThemeProvider } from '@/components/ThemeProvider'
import '@/app/globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600'],
})
const interTight = Inter_Tight({
  subsets: ['latin'],
  variable: '--font-inter-tight',
  weight: ['400', '500', '600', '700', '800'],
})
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  weight: ['400', '500', '600'],
})

export async function generateMetadata(): Promise<Metadata> {
  const payload = await getCachedPayload()
  const settings = await payload.findGlobal({ slug: 'site-settings' }).catch(() => null)
  return {
    title: settings?.metaTitle ?? 'Ayush Chaudhari',
    description: settings?.metaDescription ?? 'Backend & Generative AI Engineer',
  }
}

const themeScript = `(function(){var t=localStorage.getItem('theme');if(!t)t='dark';document.documentElement.classList.toggle('dark',t==='dark');})()`

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const payload = await getCachedPayload()
  const settings = await payload.findGlobal({ slug: 'site-settings' }).catch(() => ({
    email: 'ayushchaudhari3516@gmail.com',
    githubUrl: 'https://github.com/ayush-3516',
    resumeUrl: '',
  }))

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${inter.variable} ${interTight.variable} ${jetbrainsMono.variable}`}>
        <ThemeProvider>
          <Nav
            email={settings.email ?? ''}
            githubUrl={settings.githubUrl ?? ''}
            resumeUrl={settings.resumeUrl ?? ''}
          />
          {children}
          <Footer email={settings.email ?? ''} githubUrl={settings.githubUrl ?? ''} />
        </ThemeProvider>
      </body>
    </html>
  )
}
