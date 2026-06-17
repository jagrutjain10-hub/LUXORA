'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Package, ShoppingBag, Users, BarChart3,
  LogOut, Menu, X, Bell, Settings, ChevronRight
} from 'lucide-react';
import { useAuthStore } from '@/store/wishlist.store';
import { authApi } from '@/lib/api';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
  { icon: Package, label: 'Products', href: '/admin/products' },
  { icon: ShoppingBag, label: 'Orders', href: '/admin/orders' },
  { icon: Users, label: 'Customers', href: '/admin/customers' },
  { icon: BarChart3, label: 'Analytics', href: '/admin/analytics' },
  { icon: Settings, label: 'Settings', href: '/admin/settings' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user, clearAuth } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => { setMounted(true); }, []);

  // On desktop, default sidebar to open
  useEffect(() => {
    if (mounted) {
      setSidebarOpen(window.innerWidth >= 1024);
    }
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      router.push('/login');
    }
  }, [user, router, mounted]);

  // Lock body when mobile sidebar open
  useEffect(() => {
    if (mobileSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileSidebarOpen]);

  const handleLogout = async () => {
    await authApi.logout().catch(() => null);
    clearAuth();
    router.push('/');
  };

  if (!mounted) return <div style={{ minHeight: '100vh', background: '#0f0f0f' }} />;
  if (!user) return <div style={{ minHeight: '100vh', background: '#0f0f0f' }} />;

  const NavContent = ({ onLinkClick }: { onLinkClick?: () => void }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-white/10 flex-shrink-0">
        <Link href="/admin/dashboard" onClick={onLinkClick}>
          <span className="font-display tracking-[0.3em] text-ivory font-light text-base">
            LUXORA
          </span>
        </Link>
        <span className="ml-2 text-[10px] font-mono text-champagne-700 border border-champagne-800/40 px-1.5 py-0.5 hidden sm:inline">
          ADMIN
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onLinkClick}
              className={cn(
                'flex items-center gap-3 px-5 py-3.5 transition-all duration-200 relative group',
                active
                  ? 'bg-champagne-900/20 text-champagne-400'
                  : 'text-ivory/50 hover:text-ivory hover:bg-white/5'
              )}
            >
              {active && (
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-champagne-500" />
              )}
              <item.icon size={18} className="flex-shrink-0" />
              <span className="text-sm font-body tracking-wide">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="p-4 border-t border-white/10 flex-shrink-0">
        <div className="flex items-center gap-3 mb-3 px-1">
          <div className="w-8 h-8 bg-champagne-800 rounded-full flex items-center justify-center text-champagne-300 text-sm font-display flex-shrink-0">
            {user.firstName?.[0] ?? 'A'}
          </div>
          <div className="min-w-0">
            <div className="text-xs font-body text-ivory truncate">{user.firstName} {user.lastName}</div>
            <div className="text-[10px] font-mono text-ivory/30">{user.role}</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-2 py-2.5 text-ivory/40 hover:text-ivory transition-colors text-sm font-body"
        >
          <LogOut size={15} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-ivory-50 overflow-hidden">

      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: sidebarOpen ? 240 : 64 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="hidden lg:flex flex-col flex-shrink-0 bg-obsidian overflow-hidden"
      >
        {/* Collapsed sidebar - icons only */}
        {!sidebarOpen ? (
          <div className="flex flex-col h-full">
            <div className="h-16 flex items-center justify-center border-b border-white/10">
              <span className="font-display text-ivory text-sm">L</span>
            </div>
            <nav className="flex-1 py-4">
              {NAV_ITEMS.map((item) => {
                const active = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={item.label}
                    className={cn(
                      'flex items-center justify-center h-12 transition-all relative',
                      active ? 'text-champagne-400 bg-champagne-900/20' : 'text-ivory/40 hover:text-ivory hover:bg-white/5'
                    )}
                  >
                    {active && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-champagne-500" />}
                    <item.icon size={18} />
                  </Link>
                );
              })}
            </nav>
            <div className="p-3 border-t border-white/10">
              <button onClick={handleLogout} className="flex items-center justify-center w-full py-2 text-ivory/30 hover:text-ivory transition-colors">
                <LogOut size={15} />
              </button>
            </div>
          </div>
        ) : (
          <NavContent />
        )}
      </motion.aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-obsidian/60 z-40 lg:hidden"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'tween', duration: 0.28 }}
              className="fixed left-0 top-0 bottom-0 w-64 bg-obsidian z-50 lg:hidden"
            >
              <NavContent onLinkClick={() => setMobileSidebarOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top Bar */}
        <header className="h-14 sm:h-16 bg-white border-b border-sand-200 flex items-center justify-between px-4 sm:px-6 flex-shrink-0 gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (window.innerWidth >= 1024) {
                  setSidebarOpen(!sidebarOpen);
                } else {
                  setMobileSidebarOpen(!mobileSidebarOpen);
                }
              }}
              className="text-obsidian/50 hover:text-obsidian transition-colors w-9 h-9 flex items-center justify-center"
            >
              <Menu size={20} />
            </button>

            <div className="flex items-center gap-1.5 text-sm font-body min-w-0">
              <span className="text-obsidian/40 hidden sm:inline">Admin</span>
              <ChevronRight size={12} className="text-obsidian/20 hidden sm:inline flex-shrink-0" />
              <span className="text-obsidian truncate">
                {NAV_ITEMS.find(n => pathname.startsWith(n.href))?.label ?? 'Dashboard'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="hidden md:block text-xs font-body text-obsidian/40 hover:text-obsidian transition-colors whitespace-nowrap"
            >
              View Store ↗
            </Link>
            <button className="relative w-9 h-9 flex items-center justify-center text-obsidian/50 hover:text-obsidian transition-colors">
              <Bell size={17} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-champagne-500 rounded-full" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
