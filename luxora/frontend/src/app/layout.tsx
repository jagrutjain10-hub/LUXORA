import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Jost, DM_Mono } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { Providers } from '@/components/Providers';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

const jost = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-jost',
  display: 'swap',
});

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-dm-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'LUXORA — Luxury Home Décor',
    template: '%s | LUXORA',
  },
  description: 'Discover LUXORA\'s curated collection of premium decorative items and luxury home décor. Elevate your living space with sculptural elegance.',
  keywords: ['luxury home decor', 'decorative items', 'premium vases', 'wall decor', 'luxury sculptures', 'home accessories India'],
  authors: [{ name: 'LUXORA' }],
  creator: 'LUXORA',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://luxora.in'),
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://luxora.in',
    siteName: 'LUXORA',
    title: 'LUXORA — Luxury Home Décor',
    description: 'Curated premium decorative items that transform spaces into sanctuaries of elegance.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'LUXORA Luxury Home Décor' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LUXORA — Luxury Home Décor',
    description: 'Curated premium decorative items.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
};

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable} ${dmMono.variable}`}>
      <body className="font-body bg-ivory-50 text-obsidian antialiased">
        <Providers>
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: '#0a0a0a',
                color: '#f5f0e8',
                fontFamily: 'var(--font-jost)',
                fontSize: '13px',
                letterSpacing: '0.02em',
                borderRadius: '2px',
                border: '1px solid rgba(201,169,110,0.2)',
                padding: '12px 20px',
              },
              success: { iconTheme: { primary: '#c9a96e', secondary: '#0a0a0a' } },
              error: { iconTheme: { primary: '#ef4444', secondary: '#0a0a0a' } },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
