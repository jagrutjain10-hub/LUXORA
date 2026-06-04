'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Heart, User, Search, Menu, X, ChevronDown } from 'lucide-react';
import { useCartStore } from '@/store/cart.store';
import { useAuthStore } from '@/store/auth.store';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  {
    label: 'Collections',
    href: '/products',
    children: [
      { label: 'All Products', href: '/products' },
      { label: 'Wall Decor', href: '/products?category=wall-decor' },
      { label: 'Decorative Lights', href: '/products?category=decorative-lights' },
      { label: 'Luxury Vases', href: '/products?category=luxury-vases' },
      { label: 'Sculptures', href: '/products?category=sculptures' },
      { label: 'Table Decor', href: '/products?category=table-decor' },
      { label: 'Mirrors', href: '/products?category=mirrors' },
      { label: 'Premium Accessories', href: '/products?category=premium-accessories' },
    ],
  },
  { label: 'Featured', href: '/products?featured=true' },
  { label: 'Best Sellers', href: '/products?bestSeller=true' },
  { label: 'About', href: '/about' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const { items } = useCartStore();
  const { user } = useAuthStore();
  const cartCount = items.reduce((s, i) => s + i.quantity, 0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  const isTransparent = !scrolled && !mobileOpen;

  return (
    <>
      <nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-600',
          isTransparent
            ? 'bg-transparent'
            : 'bg-white/95 backdrop-blur-xl shadow-[0_1px_0_rgba(0,0,0,0.06)]'
        )}
        style={{ height: 'var(--nav-height)' }}
      >
        <div className="h-full max-w-8xl mx-auto px-6 md:px-10 lg:px-16 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <motion.div
              className={cn(
                'font-display font-light tracking-[0.35em] text-xl transition-colors duration-300',
                isTransparent ? 'text-ivory' : 'text-obsidian'
              )}
              whileHover={{ letterSpacing: '0.42em' }}
              transition={{ duration: 0.3 }}
            >
              LUXORA
            </motion.div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => link.children && setActiveDropdown(link.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={link.href}
                  className={cn(
                    'nav-link flex items-center gap-1 py-2 transition-colors duration-300',
                    isTransparent ? 'text-ivory/80 hover:text-ivory' : 'text-obsidian/70 hover:text-obsidian'
                  )}
                >
                  {link.label}
                  {link.children && <ChevronDown size={13} className={cn('transition-transform duration-200', activeDropdown === link.label && 'rotate-180')} />}
                </Link>

                {/* Dropdown */}
                {link.children && (
                  <AnimatePresence>
                    {activeDropdown === link.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 bg-white shadow-luxury border border-sand-200 py-2"
                      >
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block px-6 py-2.5 text-sm font-body text-obsidian/70 hover:text-obsidian hover:bg-ivory-100 transition-colors tracking-wide"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className={cn(
                'btn-icon border-transparent',
                isTransparent
                  ? 'text-ivory hover:bg-ivory/10 hover:border-ivory/20'
                  : 'text-obsidian hover:bg-obsidian hover:text-ivory hover:border-obsidian'
              )}
              aria-label="Search"
            >
              <Search size={18} />
            </button>

            {/* Wishlist */}
            <Link href="/wishlist" aria-label="Wishlist"
              className={cn(
                'btn-icon border-transparent',
                isTransparent
                  ? 'text-ivory hover:bg-ivory/10 hover:border-ivory/20'
                  : 'text-obsidian hover:bg-obsidian hover:text-ivory hover:border-obsidian'
              )}
            >
              <Heart size={18} />
            </Link>

            {/* Cart */}
            <Link href="/cart" aria-label="Cart" className="relative">
              <div className={cn(
                'btn-icon border-transparent',
                isTransparent
                  ? 'text-ivory hover:bg-ivory/10 hover:border-ivory/20'
                  : 'text-obsidian hover:bg-obsidian hover:text-ivory hover:border-obsidian'
              )}>
                <ShoppingBag size={18} />
              </div>
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-champagne-500 text-obsidian
                             text-[10px] font-mono font-medium rounded-full flex items-center justify-center"
                  style={{ width: 18, height: 18 }}
                >
                  {cartCount > 9 ? '9+' : cartCount}
                </motion.span>
              )}
            </Link>

            {/* Account */}
            <Link
              href={user ? '/dashboard' : '/login'}
              className={cn(
                'btn-icon border-transparent',
                isTransparent
                  ? 'text-ivory hover:bg-ivory/10 hover:border-ivory/20'
                  : 'text-obsidian hover:bg-obsidian hover:text-ivory hover:border-obsidian'
              )}
              aria-label={user ? 'Dashboard' : 'Login'}
            >
              <User size={18} />
            </Link>

            {/* Admin quick link */}
            {user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN' ? (
              <Link href="/admin" className="hidden md:block btn-secondary py-2 px-4 text-xs">
                Admin
              </Link>
            ) : null}

            {/* Mobile menu */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={cn(
                'lg:hidden btn-icon border-transparent ml-1',
                isTransparent ? 'text-ivory' : 'text-obsidian'
              )}
              aria-label="Menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 bg-obsidian flex flex-col pt-[var(--nav-height)]"
          >
            <div className="p-8 flex-1 overflow-y-auto">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block font-display text-3xl text-ivory font-light py-4 border-b border-obsidian-700 hover:text-champagne-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                  {link.children && (
                    <div className="py-3 pl-4 space-y-3">
                      {link.children.slice(1).map(child => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setMobileOpen(false)}
                          className="block text-ivory/50 font-body text-sm tracking-wider hover:text-champagne-400 transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}

              <div className="mt-12 flex gap-4">
                <Link href="/login" className="btn-ghost flex-1 text-center" onClick={() => setMobileOpen(false)}>
                  Sign In
                </Link>
                <Link href="/register" className="btn-primary flex-1 text-center" onClick={() => setMobileOpen(false)}>
                  Register
                </Link>
              </div>
            </div>

            <div className="p-8 border-t border-obsidian-700">
              <div className="label-gold text-champagne-600 text-center">hello@luxora.in</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-obsidian/95 backdrop-blur-xl flex items-start justify-center pt-32 px-6"
            onClick={(e) => e.target === e.currentTarget && setSearchOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-2xl"
            >
              <div className="flex items-center gap-4 border-b-2 border-champagne-600 pb-4">
                <Search size={22} className="text-champagne-500 flex-shrink-0" />
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search for vases, sculptures, mirrors..."
                  className="flex-1 bg-transparent text-ivory text-2xl font-display font-light placeholder:text-ivory/30 outline-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      window.location.href = `/products?search=${encodeURIComponent((e.target as HTMLInputElement).value)}`;
                    }
                    if (e.key === 'Escape') setSearchOpen(false);
                  }}
                />
                <button onClick={() => setSearchOpen(false)} className="text-ivory/40 hover:text-ivory transition-colors">
                  <X size={22} />
                </button>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                {['Luxury Vases', 'Wall Decor', 'Sculptures', 'Mirrors', 'Table Decor'].map(term => (
                  <button
                    key={term}
                    onClick={() => window.location.href = `/products?search=${encodeURIComponent(term)}`}
                    className="px-5 py-2 border border-champagne-800 text-champagne-400 text-label-sm uppercase tracking-widest
                               hover:bg-champagne-800/30 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
