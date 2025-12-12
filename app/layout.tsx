import type { Metadata } from 'next'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import './globals.css'

export const metadata: Metadata = {
  title: 'Volcanic Colombian Coffee | Artisanal Roasted | SCA Certified | Farm Direct',
  description:
    'Hand-roasted by SCA-certified expert. Sensory evaluated by eye, smell, taste, heat. Volcanic terroir. Direct from farm. Join 2,800+ members seeking exceptional specialty coffee.',
  keywords: [
    'specialty coffee',
    'organic coffee',
    'farm direct coffee',
    'Colombian coffee',
    'volcanic coffee',
    'artisanal roasted',
    'SCA certified',
    'direct trade coffee',
  ],
  authors: [{ name: 'Volcanic Colombian Coffee' }],
  viewport: 'width=device-width, initial-scale=1, viewport-fit=cover',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'Volcanic Colombian Coffee',
    title: 'Volcanic Colombian Coffee | Artisanal Roasted | SCA Certified',
    description: 'Hand-roasted specialty coffee from Colombian volcanic highlands. Direct from farm to cup.',
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_APP_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Volcanic Colombian Coffee',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Volcanic Colombian Coffee',
    description: 'Artisanal roasted specialty coffee from Colombian volcanic highlands.',
    images: [`${process.env.NEXT_PUBLIC_APP_URL}/og-image.jpg`],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#2a1607" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Volcanic Colombian Coffee',
              url: process.env.NEXT_PUBLIC_APP_URL,
              logo: `${process.env.NEXT_PUBLIC_APP_URL}/logo.png`,
              description:
                'Hand-roasted specialty coffee from Colombian volcanic highlands. SCA-certified, direct from farm.',
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
                contactType: 'Customer Service',
              },
              sameAs: [
                'https://instagram.com/volcaniccolombianc offee',
                'https://twitter.com/volcaniccolomb',
              ],
            }),
          }}
        />
      </head>
      <body className="flex flex-col min-h-screen bg-light-bg">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
