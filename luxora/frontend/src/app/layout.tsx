import type { Metadata } from 'next';
import { Cormorant_Garamond, Jost } from 'next/font/google';
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

export const metadata: Metadata = {
  title: {
    default: 'LUXORA — Luxury Home Decor',
    template: '%s | LUXORA',
  },
  description: 'Discover LUXORA curated collection of premium decorative items and luxury home decor.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable}`}>
      <body className="font-body bg-ivory-50 text-obsidian antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}