import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { LenisProvider } from '@/components/providers/LenisProvider'

const inter = Inter({
 subsets: ['latin'],
 variable: '--font-inter',
 display: 'swap',
})

const playfair = Playfair_Display({
 subsets: ['latin'],
 variable: '--font-playfair',
 display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.gudsampada.com'),
  title: {
    default: 'GudSampada — Pure Kolhapuri Jaggery | Authentic Farm Craft',
    template: '%s | GudSampada',
  },
  description:
    'Premium, unrefined jaggery from Kolhapur\'s finest native sugarcane farms. Organic, chemical-free, and traditionally crafted. Shop jaggery powders, bites, and bulk wholesale.',
  keywords: [
    'jaggery',
    'gud',
    'kolhapuri jaggery',
    'organic jaggery',
    'natural sweetener',
    'Indian jaggery online',
    'ginger jaggery powder',
    'paan jaggery bites',
  ],
  authors: [{ name: 'GudSampada' }],
  openGraph: {
    title: 'GudSampada — Pure Kolhapuri Jaggery',
    description:
      'Premium, unrefined jaggery from Kolhapur. 100% natural, farm to table, zero chemicals.',
    url: 'https://www.gudsampada.com',
    siteName: 'GudSampada',
    images: [
      {
        url: '/images/hero_sugarcane_farm_1782363941442.png',
        width: 1200,
        height: 630,
        alt: 'GudSampada Kolhapuri Sugarcane Fields',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GudSampada — Pure Kolhapuri Jaggery',
    description: 'Authentic Indian Jaggery crafted by Kolhapuri artisans. Delivered across India.',
    images: ['/images/hero_sugarcane_farm_1782363941442.png'],
  },
}

import Preloader from '@/components/Preloader'

export default function RootLayout({
 children,
}: Readonly<{
 children: React.ReactNode
}>) {
 return (
 <html lang="en" className={`${inter.variable} ${playfair.variable}`} data-scroll-behavior="smooth" suppressHydrationWarning>
 <body>
 <Preloader />
 <LenisProvider>{children}</LenisProvider>
 </body>
 </html>
 )
}
