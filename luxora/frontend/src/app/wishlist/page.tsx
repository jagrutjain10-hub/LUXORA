'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/wishlist.store';
import toast from 'react-hot-toast';

export default function WishlistPage() {
  const { user } = useAuthStore();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    if (!user) { setLoading(false); return; }
    try {
      const { data } = await api.get('/wishlist');
      setItems(data.data ?? []);
    } catch { } finally { setLoading(false); }
  };

  useEffect(() => { fetchWishlist(); }, [user]);

  const removeItem = async (productId: string) => {
    try {
      await api.post(`/wishlist/${productId}`);
      setItems(prev => prev.filter(i => i.productId !== productId));
      toast.success('Removed from wishlist');
    } catch { toast.error('Failed to remove'); }
  };

  return (
    <div className="min-h-screen bg-ivory-50 pt-24">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-widest text-champagne-600 font-body mb-2">Your Collection</p>
          <h1 className="font-display text-4xl text-obsidian font-light">Wishlist</h1>
        </div>

        {!user ? (
          <div className="text-center py-24">
            <Heart size={40} className="text-sand-300 mx-auto mb-4" />
            <p className="font-body text-obsidian/50 mb-6">Sign in to view your wishlist</p>
            <Link href="/login" className="inline-block bg-obsidian text-ivory px-10 py-4 text-xs uppercase tracking-widest font-body">Sign In</Link>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white border border-sand-200 p-4 animate-pulse">
                <div className="aspect-square bg-sand-100 mb-4" />
                <div className="h-4 bg-sand-100 rounded mb-2" />
                <div className="h-3 bg-sand-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-24">
            <Heart size={40} className="text-sand-300 mx-auto mb-4" />
            <p className="font-body text-obsidian/50 mb-6">Your wishlist is empty</p>
            <Link href="/products" className="inline-block bg-obsidian text-ivory px-10 py-4 text-xs uppercase tracking-widest font-body">Browse Products</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item: any) => (
              <div key={item.id} className="bg-white border border-sand-200 group">
                <Link href={`/products/${item.product.slug}`} className="block aspect-square overflow-hidden">
                  {item.product.images?.[0]?.url ? (
                    <img
                      src={item.product.images[0].url}
                      alt={item.product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-sand-100 flex items-center justify-center">
                      <Heart size={32} className="text-sand-300" />
                    </div>
                  )}
                </Link>
                <div className="p-4">
                  <Link href={`/products/${item.product.slug}`}>
                    <h3 className="font-body text-sm text-obsidian font-medium truncate hover:text-champagne-700 transition-colors">
                      {item.product.name}
                    </h3>
                  </Link>
                  <p className="font-display text-lg text-obsidian mt-1">
                    ₹{Number(item.product.discountPrice ?? item.product.price).toLocaleString('en-IN')}
                  </p>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="flex-1 flex items-center justify-center gap-2 bg-obsidian text-ivory py-2.5 text-xs uppercase tracking-widest font-body hover:bg-champagne-700 transition-colors"
                    >
                      <ShoppingBag size={13} /> Add to Cart
                    </button>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="w-10 flex items-center justify-center border border-sand-200 text-obsidian/40 hover:text-red-500 hover:border-red-200 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}