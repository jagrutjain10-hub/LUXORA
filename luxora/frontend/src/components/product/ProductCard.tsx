'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, ZoomIn, Star } from 'lucide-react';
import { useCartStore } from '@/store/cart.store';
import { useWishlistStore } from '@/store/wishlist.store';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    discountPrice?: number | null;
    category: { name: string };
    images: { url: string; isPrimary?: boolean }[];
    avgRating?: number | null;
    reviewCount?: number;
    isNew?: boolean;
    stockQty: number;
    tags?: string[];
  };
  variant?: 'default' | 'compact' | 'wide';
}

export function ProductCard({ product, variant = 'default' }: ProductCardProps) {
  const [isWishing, setIsWishing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const { addItem } = useCartStore();
  const { toggle, isWishlisted } = useWishlistStore();

  const wishlisted = isWishlisted(product.id);
  const soldOut = product.stockQty === 0;
  const discount = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : null;

  const primaryImage = product.images.find(i => i.isPrimary) ?? product.images[0];
  const secondImage = product.images[1];

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (soldOut || isAdding) return;

    setIsAdding(true);
    addItem({ productId: product.id, name: product.name, price: product.discountPrice ?? product.price, image: primaryImage?.url, slug: product.slug });
    toast.success(`${product.name} added to cart`);
    setTimeout(() => setIsAdding(false), 800);
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishing(true);
    toggle(product.id);
    setTimeout(() => setIsWishing(false), 400);
  };

  return (
    <Link href={`/products/${product.slug}`} className="card-product block group">
      {/* Image Container */}
      <div className="relative overflow-hidden bg-ivory-100" style={{ aspectRatio: variant === 'wide' ? '4/3' : '3/4' }}>
        {/* Skeleton */}
        {!imgLoaded && <div className="absolute inset-0 skeleton" />}

        {/* Primary Image */}
        {primaryImage && (
          <div className={cn(
            'absolute inset-0 transition-all duration-700 ease-luxury',
            secondImage && 'group-hover:opacity-0'
          )}>
            <Image
              src={primaryImage.url}
              alt={product.name}
              fill
              className={cn(
                'object-cover transition-all duration-700 ease-luxury group-hover:scale-105',
                !imgLoaded && 'opacity-0'
              )}
              onLoad={() => setImgLoaded(true)}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          </div>
        )}

        {/* Secondary Image on hover */}
        {secondImage && (
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
            <Image
              src={secondImage.url}
              alt={`${product.name} - alternate view`}
              fill
              className="object-cover transition-transform duration-700 ease-luxury group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-obsidian/0 group-hover:bg-obsidian/10 transition-colors duration-400 z-10" />

        {/* Badges */}
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
          {product.isNew && <span className="badge-new">New</span>}
          {discount && !soldOut && (
            <span className="badge-sale">–{discount}%</span>
          )}
          {soldOut && <span className="badge-sold-out">Sold Out</span>}
        </div>

        {/* Action buttons */}
        <div className="absolute top-3 right-3 z-20 flex flex-col gap-2
                        translate-x-10 group-hover:translate-x-0 transition-transform duration-400 ease-luxury">
          {/* Wishlist */}
          <motion.button
            onClick={handleWishlist}
            whileTap={{ scale: 0.85 }}
            className={cn(
              'w-9 h-9 flex items-center justify-center bg-white shadow-sm transition-all duration-200',
              wishlisted ? 'text-rose-500' : 'text-obsidian/60 hover:text-rose-500'
            )}
            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart size={16} fill={wishlisted ? 'currentColor' : 'none'} />
          </motion.button>

          {/* Quick view */}
          <Link
            href={`/products/${product.slug}`}
            onClick={e => e.stopPropagation()}
            className="w-9 h-9 flex items-center justify-center bg-white shadow-sm text-obsidian/60 hover:text-obsidian transition-colors"
            aria-label="Quick view"
          >
            <ZoomIn size={16} />
          </Link>
        </div>

        {/* Add to cart bar */}
        <AnimatePresence>
          <motion.div
            className="absolute bottom-0 left-0 right-0 z-20"
            initial={{ y: '100%' }}
            whileInView={{ y: 0 }}
            style={{ y: 0 }}
          >
            <div className="translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-luxury">
              <button
                onClick={handleAddToCart}
                disabled={soldOut || isAdding}
                className={cn(
                  'w-full py-3.5 flex items-center justify-center gap-2 text-label-sm uppercase tracking-widest font-body transition-colors duration-200',
                  soldOut
                    ? 'bg-sand-200 text-obsidian/40 cursor-not-allowed'
                    : isAdding
                    ? 'bg-champagne-500 text-obsidian'
                    : 'bg-obsidian text-ivory hover:bg-champagne-600 hover:text-obsidian'
                )}
              >
                <ShoppingBag size={14} />
                {soldOut ? 'Sold Out' : isAdding ? 'Added!' : 'Add to Cart'}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Product Info */}
      <div className="pt-4 pb-2 px-1">
        <div className="text-obsidian/40 text-xs font-body tracking-wider uppercase mb-1.5">
          {product.category.name}
        </div>
        <h3 className="font-body text-sm font-medium text-obsidian leading-snug mb-2 line-clamp-2 group-hover:text-champagne-700 transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        {product.avgRating && (
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={11}
                  className={cn(
                    i < Math.floor(product.avgRating!) ? 'text-champagne-500 fill-champagne-500' : 'text-sand-300 fill-sand-200'
                  )}
                />
              ))}
            </div>
            <span className="text-obsidian/40 text-xs font-mono">({product.reviewCount})</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2.5">
          <span className="font-display text-xl text-obsidian">
            ₹{(product.discountPrice ?? product.price).toLocaleString('en-IN')}
          </span>
          {product.discountPrice && (
            <span className="text-sm text-obsidian/35 line-through font-body">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
