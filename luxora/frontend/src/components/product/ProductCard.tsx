'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { useCartStore } from '@/store/cart.store';
import { useWishlistStore } from '@/store/wishlist.store';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  discountPrice?: number | null;
  images?: { url: string; isPrimary: boolean }[];
  category?: { name: string };
  stockQty: number;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  material?: string;
}

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const { addItem } = useCartStore();
  const { toggle, isWishlisted } = useWishlistStore();
  const wishlisted = isWishlisted(product.id);

  const image = product.images?.find(i => i.isPrimary)?.url ?? product.images?.[0]?.url;
  const isOutOfStock = product.stockQty === 0;
  const discountPct = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isOutOfStock) return;
    addItem({
      productId: product.id,
      name: product.name,
      price: Number(product.discountPrice ?? product.price),
      image,
      slug: product.slug,
    });
    toast.success('Added to cart');
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggle(product.id);
    toast.success(wishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  return (
    <motion.div
      className={cn('group relative bg-white overflow-hidden', className)}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5 }}
    >
      <Link href={`/products/${product.slug}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-ivory-100">
          {image && !imgError ? (
            <img
              src={image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              onError={() => setImgError(true)}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-4xl text-sand-300">◇</span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {discountPct && (
              <span className="badge-sale text-[10px] px-1.5 py-0.5">−{discountPct}%</span>
            )}
            {product.isBestSeller && (
              <span className="badge-new text-[10px] px-1.5 py-0.5">Best Seller</span>
            )}
            {product.isFeatured && !product.isBestSeller && (
              <span style={{ background: '#8a7a6a' }} className="text-ivory text-[10px] px-1.5 py-0.5 uppercase tracking-wider font-body">Featured</span>
            )}
            {isOutOfStock && (
              <span className="badge-sold-out text-[10px] px-1.5 py-0.5">Sold Out</span>
            )}
          </div>

          {/* Action Buttons - visible on hover (desktop) or always on mobile */}
          <div className="absolute top-2 right-2 flex flex-col gap-1.5 z-10">
            <button
              onClick={handleWishlist}
              className={cn(
                'w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center transition-all duration-300',
                'bg-white/90 backdrop-blur-sm shadow-sm',
                'opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:translate-x-2 sm:group-hover:translate-x-0',
                wishlisted ? 'text-red-500' : 'text-obsidian/60 hover:text-red-500'
              )}
              aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart size={14} fill={wishlisted ? 'currentColor' : 'none'} />
            </button>
            <Link
              href={`/products/${product.slug}`}
              onClick={e => e.stopPropagation()}
              className={cn(
                'w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center transition-all duration-300',
                'bg-white/90 backdrop-blur-sm shadow-sm text-obsidian/60 hover:text-obsidian',
                'hidden sm:flex opacity-0 sm:group-hover:opacity-100 sm:translate-x-2 sm:group-hover:translate-x-0 sm:[transition-delay:50ms]'
              )}
              aria-label="Quick view"
            >
              <Eye size={14} />
            </Link>
          </div>

          {/* Add to Cart overlay - desktop hover */}
          {!isOutOfStock && (
            <button
              onClick={handleAddToCart}
              className={cn(
                'absolute bottom-0 left-0 right-0 py-3 bg-obsidian text-ivory',
                'text-xs uppercase tracking-widest font-body',
                'translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-out',
                'hidden sm:flex items-center justify-center gap-2'
              )}
            >
              <ShoppingBag size={13} /> Add to Cart
            </button>
          )}
        </div>

        {/* Product Info */}
        <div className="p-3 sm:p-4">
          {product.category && (
            <p className="text-[10px] uppercase tracking-widest text-obsidian/40 font-body mb-1">
              {product.category.name}
            </p>
          )}
          <h3 className="font-body text-sm text-obsidian font-medium leading-snug line-clamp-2 group-hover:text-champagne-700 transition-colors mb-2">
            {product.name}
          </h3>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="font-display text-lg text-obsidian leading-none">
                ₹{Number(product.discountPrice ?? product.price).toLocaleString('en-IN')}
              </span>
              {product.discountPrice && (
                <span className="font-body text-xs text-obsidian/40 line-through">
                  ₹{Number(product.price).toLocaleString('en-IN')}
                </span>
              )}
            </div>
            {/* Mobile add to cart button */}
            {!isOutOfStock && (
              <button
                onClick={handleAddToCart}
                className="sm:hidden w-8 h-8 flex items-center justify-center bg-obsidian text-ivory hover:bg-champagne-700 transition-colors flex-shrink-0"
                aria-label="Add to cart"
              >
                <ShoppingBag size={13} />
              </button>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
