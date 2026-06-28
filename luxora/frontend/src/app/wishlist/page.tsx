'use client';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useWishlistStore } from '@/store/wishlist.store';

export default function WishlistPage() {
  const { ids } = useWishlistStore();
  return (
    <>
      <Navbar />
      <main className="pt-[var(--nav-height)] min-h-screen">
        <div className="bg-obsidian py-24 section-px text-center">
          <div className="label-gold text-champagne-400 mb-4">Your Favourites</div>
          <h1 className="font-display text-display-lg text-ivory font-light">Wishlist</h1>
          <div className="w-12 h-px bg-champagne-500 mx-auto mt-8" />
        </div>
        <div className="bg-ivory-50">
          <div className="container-luxury py-20 text-center">
            {ids.length === 0 ? (
              <div>
                <div className="font-display text-7xl text-sand-300 mb-6">♡</div>
                <h2 className="font-display text-display-sm text-obsidian font-light mb-4">Your wishlist is empty</h2>
                <p className="font-body text-obsidian/50 mb-10">Save pieces you love and come back to them anytime.</p>
                <Link href="/products" className="btn-primary inline-flex">Explore Collections</Link>
              </div>
            ) : (
              <div>
                <p className="font-body text-obsidian/50 mb-8">{ids.length} saved {ids.length === 1 ? 'item' : 'items'}</p>
                <Link href="/products" className="btn-secondary inline-flex">Continue Shopping</Link>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
