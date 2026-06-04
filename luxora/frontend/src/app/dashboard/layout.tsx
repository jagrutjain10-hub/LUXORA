'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, ShoppingBag, Heart, MapPin, LogOut, ChevronRight } from 'lucide-react';
import { useAuthStore } from '@/store/wishlist.store';
import { authApi } from '@/lib/api';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { icon: User, label: 'My Profile', href: '/dashboard' },
  { icon: ShoppingBag, label: 'My Orders', href: '/dashboard/orders' },
  { icon: Heart, label: 'Wishlist', href: '/dashboard/wishlist' },
  { icon: MapPin, label: 'Addresses', href: '/dashboard/addresses' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, clearAuth } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push('/login?redirect=/dashboard');
  }, [user, router]);

  const handleLogout = async () => {
    await authApi.logout().catch(() => null);
    clearAuth();
    router.push('/');
  };

  if (!user) return null;

  return (
    <>
      <Navbar />
      <main className="pt-[var(--nav-height)] min-h-screen bg-ivory-50">
        {/* Header */}
        <div className="bg-obsidian py-10 section-px">
          <div className="max-w-8xl mx-auto">
            <div className="label-gold text-champagne-400 mb-2">Member Area</div>
            <h1 className="font-display text-display-sm text-ivory font-light">
              Hello, {user.firstName}
            </h1>
          </div>
        </div>

        <div className="container-luxury py-10">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="bg-white border border-sand-200 overflow-hidden sticky top-24">
                {/* User info */}
                <div className="p-5 border-b border-sand-100 bg-ivory-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-champagne-100 rounded-full flex items-center justify-center text-champagne-700 font-display text-lg font-light">
                      {user.firstName[0]}
                    </div>
                    <div>
                      <div className="text-sm font-body font-medium text-obsidian">{user.firstName} {user.lastName}</div>
                      <div className="text-xs font-mono text-obsidian/40">{user.email}</div>
                    </div>
                  </div>
                </div>

                <nav className="py-2">
                  {NAV_ITEMS.map(item => {
                    const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          'flex items-center justify-between px-5 py-3.5 text-sm font-body transition-all duration-200 group',
                          active
                            ? 'bg-champagne-50 text-champagne-700 border-l-2 border-champagne-500'
                            : 'text-obsidian/60 hover:text-obsidian hover:bg-ivory-50 border-l-2 border-transparent'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon size={16} />
                          {item.label}
                        </div>
                        <ChevronRight size={13} className="opacity-40" />
                      </Link>
                    );
                  })}

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-5 py-3.5 w-full text-sm font-body text-obsidian/40 hover:text-red-500 transition-colors"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </nav>
              </div>
            </aside>

            {/* Content */}
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                {children}
              </motion.div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
