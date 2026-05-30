import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { getSiteSettings } from '@/lib/site-settings'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSiteSettings();
  return {
    title: { default: s.site_title, template: `%s | ${s.site_title}` },
    description: s.site_description,
    keywords: s.site_keywords.split(",").map((k) => k.trim()),
    verification: { google: s.google_verification || undefined },
    twitter: { card: "summary_large_image", site: s.twitter_handle },
    openGraph: {
      title: s.site_title,
      description: s.site_description,
      images: s.og_image_url ? [s.og_image_url] : [],
    },
    icons: s.favicon_url ? { icon: s.favicon_url } : undefined,
  };
}

// Viewport Configuration
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
  colorScheme: 'light dark',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className="font-sans antialiased" suppressHydrationWarning>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
