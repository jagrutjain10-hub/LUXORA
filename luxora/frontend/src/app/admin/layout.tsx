'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Package, ShoppingBag, Users, BarChart3,
  LogOut, Menu, X, Bell, Settings, AlertTriangle, ChevronRight
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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user, clearAuth } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      router.push('/login');
    }
  }, [user, router, mounted]);

  const handleLogout = async () => {
    await authApi.logout().catch(() => null);
    clearAuth();
    router.push('/');
  };

  if (!mounted) return <div style={{minHeight:'100vh',background:'#0f0f0f'}} />;
  if (!user) return <div style={{minHeight:'100vh',background:'#0f0f0f'}} />;

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="h-16 flex items-center px-6 border-b border-champagne-900/30">
        <Link href="/admin/dashboard">
          <span className={cn(
            'font-display tracking-[0.3em] text-ivory font-light transition-all duration-300',
            sidebarOpen ? 'text-lg' : 'text-sm'
          )}>
            {sidebarOpen ? 'LUXORA' : 'L'}
          </span>
        </Link>
        {sidebarOpen && (
          <span className="ml-2 text-xs font-mono text-champagne-700 border border-champagne-800/40 px-2 py-0.5">
            ADMIN
          </span>
        )}
      </div>

      <nav className="flex-1 py-6 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-5 py-3 transition-all duration-200 group relative',
                active
                  ? 'bg-champagne-900/20 text-champagne-400'
                  : 'text-ivory/50 hover:text-ivory hover:bg-white/5'
              )}
            >
              {active && (
                <motion.div
                  layoutId="admin-nav-indicator"
                  className="absolute left-0 top-0 bottom-0 w-0.5 bg-champagne-500"
                />
              )}
              <item.icon size={18} className="flex-shrink-0" />
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="text-sm font-body tracking-wide whitespace-nowrap overflow-hidden"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-champagne-900/30">
        {sidebarOpen && (
          <div className="flex items-center gap-3 mb-4 px-1">
            <div className="w-8 h-8 bg-champagne-800 rounded-full flex items-center justify-center text-champagne-300 text-sm font-display">
              {user.firstName[0]}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-body text-ivory truncate">{user.firstName} {user.lastName}</div>
              <div className="text-xs font-mono text-ivory/30">{user.role}</div>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-2 py-2 text-ivory/40 hover:text-ivory transition-colors text-sm font-body"
        >
          <LogOut size={16} />
          {sidebarOpen && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-ivory-50 overflow-hidden">
      <motion.aside
        animate={{ width: sidebarOpen ? 240 : 64 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="hidden lg:flex flex-col flex-shrink-0 bg-obsidian overflow-hidden"
      >
        <SidebarContent />
      </motion.aside>

      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-obsidian/50 z-40 lg:hidden"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed left-0 top-0 bottom-0 w-64 bg-obsidian z-50 lg:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-sand-200 flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setSidebarOpen(!sidebarOpen);
                setMobileSidebarOpen(!mobileSidebarOpen);
              }}
              className="text-obsidian/50 hover:text-obsidian transition-colors"
            >
              <Menu size={20} />
            </button>

            <div className="hidden md:flex items-center gap-2 text-sm font-body">
              <Link href="/admin/dashboard" className="text-obsidian/40 hover:text-obsidian transition-colors">
                Admin
              </Link>
              <ChevronRight size={13} className="text-obsidian/20" />
              <span className="text-obsidian">
                {NAV_ITEMS.find(n => pathname.startsWith(n.href))?.label ?? 'Dashboard'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="hidden md:block text-xs font-body text-obsidian/40 hover:text-obsidian transition-colors"
            >
              View Store ↗
            </Link>
            <button className="relative w-9 h-9 flex items-center justify-center text-obsidian/50 hover:text-obsidian transition-colors">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-champagne-500 rounded-full" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}