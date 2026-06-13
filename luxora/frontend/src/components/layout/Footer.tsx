'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Instagram, Facebook, Twitter, Youtube, MapPin, Phone, Mail } from 'lucide-react';
import { useCategories } from '@/hooks/useProducts';

const STATIC_FOOTER_LINKS = {
  'Customer Care': [
    { label: 'My Account', href: '/dashboard' },
    { label: 'Track Order', href: '/dashboard/orders' },
    { label: 'Returns & Exchanges', href: '/returns' },
    { label: 'Shipping Policy', href: '/shipping' },
    { label: 'FAQs', href: '/faq' },
    { label: 'Contact Us', href: '/contact' },
  ],
  'Company': [
    { label: 'About LUXORA', href: '/about' },
    { label: 'Our Story', href: '/about#story' },
    { label: 'Sustainability', href: '/sustainability' },
    { label: 'Press & Media', href: '/press' },
    { label: 'Careers', href: '/careers' },
    { label: 'Blog', href: '/blog' },
  ],
  'Legal': [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
    { label: 'Refund Policy', href: '/refunds' },
  ],
};

const SOCIALS = [
  { icon: Instagram, href: 'https://instagram.com/luxora.in', label: 'Instagram' },
  { icon: Facebook, href: 'https://facebook.com/luxora.in', label: 'Facebook' },
  { icon: Twitter, href: 'https://twitter.com/luxora_in', label: 'Twitter' },
  { icon: Youtube, href: 'https://youtube.com/@luxora', label: 'YouTube' },
];

export function Footer() {
  const { data: categories } = useCategories();

  const FOOTER_LINKS = {
    Collections: (categories ?? []).map(c => ({ label: c.name, href: `/products?category=${c.slug}` })),
    ...STATIC_FOOTER_LINKS,
  };

  return (
    <footer className="bg-obsidian text-ivory">
      {/* Top band */}
      <div className="border-b border-champagne-900/30">
        <div className="container-luxury py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="label-gold text-champagne-400 mb-4">Stay Connected</div>
              <h3 className="font-display text-display-sm text-ivory font-light mb-3">
                Join the LUXORA Circle
              </h3>
              <p className="text-ivory/50 font-body text-sm max-w-md">
                Exclusive previews, styling inspiration, and early access to new collections — delivered elegantly to your inbox.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 bg-transparent border border-champagne-800/50 px-5 py-3.5
                           text-ivory text-sm font-body placeholder:text-ivory/30
                           focus:outline-none focus:border-champagne-500 transition-colors"
              />
              <button className="btn-ghost whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer links */}
      <div className="container-luxury py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <div className="font-display text-2xl text-ivory tracking-[0.35em] font-light mb-4">
              LUXORA
            </div>
            <p className="text-ivory/40 text-sm font-body leading-relaxed mb-6">
              Premium decorative items &amp; luxury home décor for the discerning home.
            </p>
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3 text-ivory/50 text-sm font-body">
                <MapPin size={14} className="text-champagne-600 flex-shrink-0" />
                <span>Mumbai, Maharashtra, India</span>
              </div>
              <div className="flex items-center gap-3 text-ivory/50 text-sm font-body">
                <Phone size={14} className="text-champagne-600 flex-shrink-0" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-3 text-ivory/50 text-sm font-body">
                <Mail size={14} className="text-champagne-600 flex-shrink-0" />
                <span>hello@luxora.in</span>
              </div>
            </div>
            <div className="flex gap-3">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 border border-champagne-800/50 flex items-center justify-center
                             text-ivory/50 hover:text-champagne-400 hover:border-champagne-600 transition-all duration-300"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="label-gold text-champagne-500 mb-5">{heading}</h4>
              <ul className="space-y-3">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-ivory/45 text-sm font-body hover:text-ivory transition-colors duration-200 tracking-wide"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-champagne-900/20">
        <div className="container-luxury py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-ivory/30 text-xs font-body tracking-wide">
            © {new Date().getFullYear()} LUXORA. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {['Visa', 'Mastercard', 'UPI', 'Razorpay'].map(pm => (
              <span key={pm} className="text-ivory/25 text-xs font-mono tracking-wider">{pm}</span>
            ))}
          </div>
          <p className="text-ivory/20 text-xs font-body">
            Made with care in India 🇮🇳
          </p>
        </div>
      </div>
    </footer>
  );
}
