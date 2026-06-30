'use client';

import Link from 'next/link';
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const FOOTER_LINKS = {
  Shop: [
    { label: 'All Products', href: '/products' },
    { label: 'Chandeliers', href: '/products?category=chandeliers' },
    { label: 'Wall Lamps', href: '/products?category=wall-lamps' },
    { label: 'Lamps', href: '/products?category=lamps' },
    { label: 'Hangings', href: '/products?category=hangings' },
    { label: 'Lights', href: '/products?category=lights' },
  ],
  Company: [
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Blog', href: '/blog' },
  ],
  Support: [
    { label: 'Shipping Policy', href: '/shipping' },
    { label: 'Returns & Refunds', href: '/refunds' },
    { label: 'Track Order', href: '/dashboard' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-obsidian text-ivory">
      {/* Main Footer */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">

          {/* Brand */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-1">
            <Link href="/">
              <span className="font-display text-2xl tracking-[0.3em] text-ivory font-light">LUXORA</span>
            </Link>
            <p className="mt-4 text-ivory/50 font-body text-sm leading-relaxed max-w-xs">
              Curated luxury décor for the discerning eye. Each piece is an heirloom in the making.
            </p>

            {/* Contact */}
            <div className="mt-6 space-y-2.5">
              {[
                { icon: Mail, text: 'luxora2010@gmail.com', href: 'mailto:luxora2010@gmail.com' },
                { icon: Phone, text: '+91 79729 90686', href: 'tel:+917972990686' },
                { icon: MapPin, text: 'Mumbai, India', href: null },
              ].map(({ icon: Icon, text, href }) => (
                <div key={text} className="flex items-center gap-2.5 text-ivory/40 text-sm font-body">
                  <Icon size={13} className="flex-shrink-0 text-champagne-600" />
                  {href ? (
                    <a href={href} className="hover:text-champagne-400 transition-colors">{text}</a>
                  ) : (
                    <span>{text}</span>
                  )}
                </div>
              ))}
            </div>

            {/* Social */}
            <div className="mt-6 flex gap-3">
              {[
                { icon: Instagram, href: 'https://instagram.com/luxora.in', label: 'Instagram' },
                { icon: Facebook, href: '#', label: 'Facebook' },
                { icon: Twitter, href: '#', label: 'Twitter' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 border border-white/10 flex items-center justify-center text-ivory/40 hover:text-champagne-400 hover:border-champagne-700 transition-all"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-body text-xs uppercase tracking-widest text-ivory/60 mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map(link => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-ivory/40 hover:text-champagne-400 transition-colors font-body text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="mt-12 pt-10 border-t border-white/8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <h4 className="font-display text-xl font-light text-ivory mb-1">Stay in the know</h4>
              <p className="text-ivory/40 font-body text-sm">New arrivals, exclusive offers, and interior inspiration.</p>
            </div>
            <div className="flex w-full sm:w-auto max-w-sm gap-0">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 bg-white/5 border border-white/10 px-4 py-3 text-ivory text-sm font-body placeholder:text-ivory/30 focus:outline-none focus:border-champagne-600/50 min-w-0"
                style={{ fontSize: 16 }}
              />
              <button className="bg-champagne-600 text-obsidian px-5 py-3 text-xs uppercase tracking-widest font-body font-medium hover:bg-champagne-500 transition-colors whitespace-nowrap flex-shrink-0">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/8">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-ivory/30 font-body text-xs text-center sm:text-left">
            © {new Date().getFullYear()} LUXORA. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {['Privacy', 'Terms', 'Cookies'].map(item => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                className="text-ivory/30 hover:text-ivory/60 font-body text-xs transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
