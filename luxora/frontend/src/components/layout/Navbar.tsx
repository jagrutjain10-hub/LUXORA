'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Heart, User, Search, Menu, X, ChevronDown, ChevronRight } from 'lucide-react';
import { useCartStore } from '@/store/cart.store';
import { useAuthStore } from '@/store/wishlist.store';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  {
    label: 'Collections',
    href: '/products',
    children: [
      { label: 'All Products', href: '/products' },
      { label: 'Chandeliers', href: '/products?category=chandeliers' },
      { label: 'Wall Lamps', href: '/products?category=wall-lamps' },
      { label: 'Lamps', href: '/products?category=lamps' },
      { label: 'Hangings', href: '/products?category=hangings' },
      { label: 'Lights', href: '/products?category=lights' },
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
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
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
    if (searchOpen) setTimeout(() => searchRef.current?.focus(), 100);
  }, [searchOpen]);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const pathname = usePathname();
  const closeMobile = () => { setMobileOpen(false); setMobileExpanded(null); };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchVal.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchVal.trim())}`;
    }
    if (e.key === 'Escape') { setSearchOpen(false); setSearchVal(''); }
  };

  return (
    <>
      <nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          isTransparent
            ? 'bg-transparent'
            : 'bg-white/95 backdrop-blur-xl shadow-[0_1px_0_rgba(0,0,0,0.06)]'
        )}
        style={{ height: 'var(--nav-height)' }}
      >
        <div className="h-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0" onClick={closeMobile}>
            <span className={cn(
              'font-display font-light tracking-[0.3em] text-lg sm:text-xl transition-colors duration-300',
              isTransparent ? 'text-ivory' : 'text-obsidian'
            )}>
              LUXORA
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
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
                  {link.children && <ChevronDown size={12} className={cn('transition-transform duration-200', activeDropdown === link.label && 'rotate-180')} />}
                </Link>

                {link.children && (
                  <AnimatePresence>
                    {activeDropdown === link.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.18 }}
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-52 bg-white shadow-xl border border-sand-200 py-2 z-50"
                      >
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block px-5 py-2.5 text-sm font-body text-obsidian/70 hover:text-obsidian hover:bg-ivory-100 transition-colors tracking-wide"
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
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className={cn(
                'w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center transition-colors rounded-none',
                isTransparent ? 'text-ivory hover:bg-ivory/10' : 'text-obsidian hover:bg-obsidian/5'
              )}
              aria-label="Search"
            >
              <Search size={18} />
            </button>

            {/* Wishlist - hidden on very small screens */}
            <Link href="/wishlist" aria-label="Wishlist"
              className={cn(
                'hidden sm:flex w-10 h-10 sm:w-11 sm:h-11 items-center justify-center transition-colors',
                isTransparent ? 'text-ivory hover:bg-ivory/10' : 'text-obsidian hover:bg-obsidian/5'
              )}
            >
              <Heart size={18} />
            </Link>

            {/* Cart */}
            <Link href="/cart" aria-label="Cart" className="relative">
              <div className={cn(
                'w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center transition-colors',
                isTransparent ? 'text-ivory hover:bg-ivory/10' : 'text-obsidian hover:bg-obsidian/5'
              )}>
                <ShoppingBag size={18} />
              </div>
              {cartCount > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 w-[18px] h-[18px] bg-champagne-500 text-obsidian
                             text-[10px] font-mono font-semibold rounded-full flex items-center justify-center"
                >
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {/* Account */}
            <Link
              href={user ? '/dashboard' : '/login'}
              className={cn(
                'hidden sm:flex w-10 h-10 sm:w-11 sm:h-11 items-center justify-center transition-colors',
                isTransparent ? 'text-ivory hover:bg-ivory/10' : 'text-obsidian hover:bg-obsidian/5'
              )}
              aria-label={user ? 'Dashboard' : 'Login'}
            >
              <User size={18} />
            </Link>

            {/* Admin quick link */}
            {(user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') && (
              <Link href="/admin/dashboard" className="hidden md:block ml-1 px-3 py-2 border border-obsidian/20 text-obsidian text-xs font-body uppercase tracking-wider hover:bg-obsidian hover:text-ivory transition-colors">
                Admin
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={cn(
                'lg:hidden w-10 h-10 flex items-center justify-center ml-1 transition-colors',
                isTransparent ? 'text-ivory' : 'text-obsidian'
              )}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={mobileOpen ? 'close' : 'open'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                </motion.div>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-obsidian/60 lg:hidden"
              onClick={closeMobile}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-0 right-0 bottom-0 z-50 w-[85vw] max-w-sm bg-obsidian flex flex-col lg:hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 border-b border-white/10"
                style={{ height: 'var(--nav-height)' }}>
                <span className="font-display text-ivory tracking-[0.3em] text-lg">LUXORA</span>
                <button onClick={closeMobile} className="w-10 h-10 flex items-center justify-center text-ivory/60 hover:text-ivory">
                  <X size={20} />
                </button>
              </div>

              {/* Nav Items */}
              <nav className="flex-1 overflow-y-auto py-4">
                {NAV_LINKS.map((link) => (
                  <div key={link.label}>
                    <div className="flex items-center justify-between px-6">
                      <Link
                        href={link.href}
                        onClick={link.children ? undefined : closeMobile}
                        className="flex-1 font-display text-2xl text-ivory font-light py-4 hover:text-champagne-400 transition-colors"
                      >
                        {link.label}
                      </Link>
                      {link.children && (
                        <button
                          onClick={() => setMobileExpanded(mobileExpanded === link.label ? null : link.label)}
                          className="w-10 h-10 flex items-center justify-center text-ivory/40"
                        >
                          <ChevronRight size={18} className={cn('transition-transform', mobileExpanded === link.label && 'rotate-90')} />
                        </button>
                      )}
                    </div>

                    <AnimatePresence>
                      {link.children && mobileExpanded === link.label && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden bg-white/5"
                        >
                          {link.children.map(child => (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={closeMobile}
                              className="block px-8 py-3 text-ivory/60 font-body text-sm tracking-wide hover:text-champagne-400 transition-colors"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <div className="h-px bg-white/5 mx-6" />
                  </div>
                ))}

                {/* Mobile-only links */}
                <div className="px-6 pt-2">
                  <Link href="/wishlist" onClick={closeMobile} className="flex items-center gap-3 py-4 text-ivory/60 font-body text-sm tracking-wide hover:text-ivory transition-colors">
                    <Heart size={16} /> Wishlist
                  </Link>
                  <Link href={user ? '/dashboard' : '/login'} onClick={closeMobile} className="flex items-center gap-3 py-4 text-ivory/60 font-body text-sm tracking-wide hover:text-ivory transition-colors">
                    <User size={16} /> {user ? 'My Account' : 'Sign In'}
                  </Link>
                  {(user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') && (
                    <Link href="/admin/dashboard" onClick={closeMobile} className="flex items-center gap-3 py-4 text-champagne-400 font-body text-sm tracking-wide">
                      Admin Dashboard
                    </Link>
                  )}
                </div>
              </nav>

              {/* Footer */}
              <div className="px-6 py-6 border-t border-white/10 flex gap-3">
                {!user ? (
                  <>
                    <Link href="/login" className="flex-1 py-3 border border-champagne-700 text-champagne-400 text-xs uppercase tracking-widest font-body text-center hover:bg-champagne-900/30 transition-colors" onClick={closeMobile}>
                      Sign In
                    </Link>
                    <Link href="/register" className="flex-1 py-3 bg-champagne-600 text-obsidian text-xs uppercase tracking-widest font-body text-center hover:bg-champagne-500 transition-colors" onClick={closeMobile}>
                      Register
                    </Link>
                  </>
                ) : (
                  <p className="text-ivory/30 text-xs font-body">hello@luxora.in</p>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-obsidian/95 backdrop-blur-xl flex items-start justify-center pt-20 sm:pt-32 px-4 sm:px-6"
            onClick={(e) => { if (e.target === e.currentTarget) { setSearchOpen(false); setSearchVal(''); } }}
          >
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-2xl"
            >
              <div className="flex items-center gap-3 border-b-2 border-champagne-600 pb-3">
                <Search size={20} className="text-champagne-500 flex-shrink-0" />
                <input
                  ref={searchRef}
                  type="text"
                  value={searchVal}
                  onChange={e => setSearchVal(e.target.value)}
                  onKeyDown={handleSearch}
                  placeholder="Search chandeliers, lamps..."
                  className="flex-1 bg-transparent text-ivory text-lg sm:text-2xl font-display font-light placeholder:text-ivory/30 outline-none"
                  style={{ fontSize: 'clamp(1.1rem, 4vw, 1.5rem)' }}
                />
                <button onClick={() => { setSearchOpen(false); setSearchVal(''); }} className="text-ivory/40 hover:text-ivory transition-colors flex-shrink-0">
                  <X size={20} />
                </button>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {['Chandeliers', 'Wall Lamps', 'Lamps', 'Hangings', 'Lights'].map(term => (
                  <button
                    key={term}
                    onClick={() => window.location.href = `/products?search=${encodeURIComponent(term)}`}
                    className="px-4 py-2 border border-champagne-800 text-champagne-400 text-xs uppercase tracking-widest hover:bg-champagne-800/30 transition-colors"
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
