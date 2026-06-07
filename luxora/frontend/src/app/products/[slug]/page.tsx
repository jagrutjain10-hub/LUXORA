// @ts-nocheck
'use client';

import { useState } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Heart, Share2, Star, Minus, Plus, ZoomIn, Check, Truck, RefreshCw, Shield } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/product/ProductCard';
import { ReviewsSection } from '@/components/product/ReviewsSection';
import { useCartStore } from '@/store/cart.store';
import { useWishlistStore } from '@/store/wishlist.store';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import { useProduct } from '@/hooks/useProduct';

// Mock product for static generation fallback
const GUARANTEES = [
  { icon: Truck, title: 'Free Delivery', desc: 'On orders above ₹2,999' },
  { icon: RefreshCw, title: '15-Day Returns', desc: 'Hassle-free returns' },
  { icon: Shield, title: 'Authenticity', desc: '100% genuine pieces' },
];

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const { data: product, isLoading } = useProduct(params.slug);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false);

  const { addItem } = useCartStore();
  const { toggle, isWishlisted } = useWishlistStore();

  if (isLoading) return <ProductDetailSkeleton />;
  if (!product) notFound();

  const wishlisted = isWishlisted(product.id);
  const soldOut = product.stockQty === 0;
  const discount = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : null;

  const handleAddToCart = async () => {
    if (soldOut || isAdding) return;
    setIsAdding(true);

    addItem({
      productId: product.id,
      name: product.name,
      price: product.discountPrice ?? product.price,
      image: product.images[0]?.url,
      slug: product.slug,
      quantity,
    });

    toast.success(`${product.name} added to cart`);
    setTimeout(() => setIsAdding(false), 1000);
  };

  const currentImage = product.images[selectedImage];

  return (
    <>
      <Navbar />
      <main className="pt-[var(--nav-height)] min-h-screen bg-white">

        {/* Breadcrumb */}
        <div className="bg-ivory-100 border-b border-sand-200">
          <div className="container-luxury py-4">
            <div className="flex items-center gap-2 text-xs font-body text-obsidian/40 tracking-wide">
              <a href="/" className="hover:text-obsidian transition-colors">Home</a>
              <span>/</span>
              <a href="/products" className="hover:text-obsidian transition-colors">Collections</a>
              <span>/</span>
              <a href={`/products?category=${product.category.slug}`} className="hover:text-obsidian transition-colors">
                {product.category.name}
              </a>
              <span>/</span>
              <span className="text-obsidian">{product.name}</span>
            </div>
          </div>
        </div>

        {/* Product Content */}
        <div className="container-luxury py-12 lg:py-16">
          <div className="grid lg:grid-cols-2 gap-12 xl:gap-20">

            {/* Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div
                className="relative aspect-square bg-ivory-100 overflow-hidden cursor-zoom-in group"
                onClick={() => setZoomOpen(true)}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedImage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0"
                  >
                    {currentImage && (
                      <Image
                        src={currentImage.url}
                        alt={currentImage.altText ?? product.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        priority
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Zoom hint */}
                <div className="absolute top-4 right-4 w-9 h-9 bg-white/80 backdrop-blur-sm flex items-center justify-center
                                opacity-0 group-hover:opacity-100 transition-opacity">
                  <ZoomIn size={16} className="text-obsidian" />
                </div>

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.isNew && <span className="badge-new">New</span>}
                  {discount && <span className="badge-sale">–{discount}% Off</span>}
                </div>
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={cn(
                        'relative flex-shrink-0 w-20 h-20 overflow-hidden transition-all duration-200',
                        selectedImage === i
                          ? 'ring-2 ring-champagne-500 ring-offset-2'
                          : 'opacity-60 hover:opacity-100'
                      )}
                    >
                      <Image
                        src={img.url}
                        alt={img.altText ?? `View ${i + 1}`}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div>
              {/* Category & SKU */}
              <div className="flex items-center justify-between mb-4">
                <a
                  href={`/products?category=${product.category.slug}`}
                  className="label-gold hover:text-champagne-700 transition-colors"
                >
                  {product.category.name}
                </a>
                <span className="font-mono text-xs text-obsidian/30">SKU: {product.sku}</span>
              </div>

              <h1 className="font-display text-display-sm text-obsidian font-light mb-4">
                {product.name}
              </h1>

              {/* Rating */}
              {product.avgRating && (
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={15}
                        className={cn(
                          i < Math.floor(product.avgRating!)
                            ? 'text-champagne-500 fill-champagne-500'
                            : 'text-sand-300 fill-sand-200'
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-body text-obsidian/60">
                    {product.avgRating} ({product.reviewCount} reviews)
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="flex items-baseline gap-4 mb-8 pb-8 border-b border-sand-200">
                <span className="font-display text-4xl text-obsidian font-light">
                  ₹{(product.discountPrice ?? product.price).toLocaleString('en-IN')}
                </span>
                {product.discountPrice && (
                  <>
                    <span className="font-body text-xl text-obsidian/35 line-through">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    <span className="badge-sale">Save {discount}%</span>
                  </>
                )}
              </div>

              {/* Short Description */}
              {product.shortDesc && (
                <p className="text-obsidian/70 font-body leading-relaxed mb-6">
                  {product.shortDesc}
                </p>
              )}

              {/* Details */}
              {(product.material || product.dimensions) && (
                <div className="grid grid-cols-2 gap-4 mb-8 p-5 bg-ivory-100">
                  {product.material && (
                    <div>
                      <div className="label-gold text-obsidian/40 mb-1">Material</div>
                      <div className="text-sm font-body text-obsidian">{product.material}</div>
                    </div>
                  )}
                  {product.dimensions && (
                    <div>
                      <div className="label-gold text-obsidian/40 mb-1">Dimensions</div>
                      <div className="text-sm font-body text-obsidian">
                        {typeof product.dimensions === 'string'
                          ? product.dimensions
                          : JSON.stringify(product.dimensions)}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Quantity + Add to Cart */}
              {!soldOut ? (
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-6">
                    <div className="label-gold text-obsidian/40">Quantity</div>
                    <div className="flex items-center border border-obsidian/15">
                      <button
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        className="w-10 h-10 flex items-center justify-center text-obsidian hover:bg-ivory-100 transition-colors"
                        disabled={quantity <= 1}
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-12 text-center font-mono text-sm">{quantity}</span>
                      <button
                        onClick={() => setQuantity(q => Math.min(product.stockQty, q + 1))}
                        className="w-10 h-10 flex items-center justify-center text-obsidian hover:bg-ivory-100 transition-colors"
                        disabled={quantity >= product.stockQty}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <span className="text-xs font-mono text-obsidian/30">
                      {product.stockQty} in stock
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <motion.button
                      onClick={handleAddToCart}
                      disabled={isAdding}
                      whileTap={{ scale: 0.98 }}
                      className={cn(
                        'flex-1 btn-primary py-4',
                        isAdding && 'bg-champagne-500 text-obsidian'
                      )}
                    >
                      {isAdding ? (
                        <>
                          <Check size={16} /> Added to Cart
                        </>
                      ) : (
                        <>
                          <ShoppingBag size={16} /> Add to Cart
                        </>
                      )}
                    </motion.button>

                    <button
                      onClick={() => toggle(product.id)}
                      className={cn(
                        'w-14 h-14 flex items-center justify-center border transition-all duration-200',
                        wishlisted
                          ? 'bg-rose-50 border-rose-200 text-rose-500'
                          : 'border-obsidian/15 text-obsidian/50 hover:border-obsidian hover:text-obsidian'
                      )}
                      aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                      <Heart size={18} fill={wishlisted ? 'currentColor' : 'none'} />
                    </button>

                    <button className="w-14 h-14 flex items-center justify-center border border-obsidian/15 text-obsidian/50 hover:border-obsidian hover:text-obsidian transition-all duration-200"
                      aria-label="Share">
                      <Share2 size={18} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mb-8">
                  <div className="w-full py-4 text-center badge-sold-out text-base">
                    Currently Out of Stock
                  </div>
                  <button className="w-full mt-3 btn-secondary py-4 flex items-center justify-center gap-2">
                    <Heart size={16} /> Notify When Available
                  </button>
                </div>
              )}

              {/* Guarantees */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-sand-200">
                {GUARANTEES.map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="text-center">
                    <Icon size={20} className="text-champagne-600 mx-auto mb-2" />
                    <div className="text-xs font-body font-medium text-obsidian">{title}</div>
                    <div className="text-xs font-body text-obsidian/40 mt-0.5">{desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Description Tabs */}
          <ProductTabs product={product} />

          {/* Reviews */}
          <ReviewsSection productId={product.id} reviews={product.reviews} />

          {/* Related Products */}
          {product.related?.length > 0 && (
            <div className="mt-20 pt-16 border-t border-sand-200">
              <div className="text-center mb-12">
                <div className="label-gold mb-3">You May Also Love</div>
                <h2 className="font-display text-display-sm text-obsidian font-light">Related Pieces</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                {product.related.map((p: any) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Zoom Modal */}
      <AnimatePresence>
        {zoomOpen && currentImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-obsidian/95 flex items-center justify-center p-4"
            onClick={() => setZoomOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative w-full max-w-3xl aspect-square"
              onClick={e => e.stopPropagation()}
            >
              <Image
                src={currentImage.url}
                alt={product.name}
                fill
                className="object-contain"
                sizes="100vw"
              />
              <button
                onClick={() => setZoomOpen(false)}
                className="absolute top-4 right-4 w-10 h-10 bg-obsidian/80 text-ivory flex items-center justify-center hover:bg-obsidian transition-colors"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}

function ProductTabs({ product }: { product: any }) {
  const [activeTab, setActiveTab] = useState('description');

  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'details', label: 'Details & Care' },
    { id: 'shipping', label: 'Shipping Info' },
  ];

  return (
    <div className="mt-16 pt-16 border-t border-sand-200">
      <div className="flex gap-0 border-b border-sand-200 mb-10">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'px-8 py-4 text-sm font-body uppercase tracking-widest transition-all duration-200 relative',
              activeTab === tab.id ? 'text-obsidian' : 'text-obsidian/40 hover:text-obsidian/70'
            )}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-champagne-500" />
            )}
          </button>
        ))}
      </div>

      <div className="max-w-3xl">
        {activeTab === 'description' && (
          <div className="font-body text-obsidian/70 leading-relaxed space-y-4">
            {product.description.split('\n').map((p: string, i: number) => p && (
              <p key={i}>{p}</p>
            ))}
          </div>
        )}
        {activeTab === 'details' && (
          <div className="space-y-4 font-body">
            {product.material && (
              <div className="grid grid-cols-3 py-3 border-b border-sand-100">
                <span className="text-obsidian/50 text-sm">Material</span>
                <span className="col-span-2 text-obsidian text-sm">{product.material}</span>
              </div>
            )}
            {product.weight && (
              <div className="grid grid-cols-3 py-3 border-b border-sand-100">
                <span className="text-obsidian/50 text-sm">Weight</span>
                <span className="col-span-2 text-obsidian text-sm">{product.weight} kg</span>
              </div>
            )}
            {product.careInstructions && (
              <div className="mt-6">
                <h4 className="label-gold text-obsidian/60 mb-3">Care Instructions</h4>
                <p className="text-sm text-obsidian/70 leading-relaxed">{product.careInstructions}</p>
              </div>
            )}
          </div>
        )}
        {activeTab === 'shipping' && (
          <div className="space-y-5 font-body">
            {[
              ['Standard Delivery', '5–7 business days · ₹199', 'Free on orders above ₹2,999'],
              ['Express Delivery', '2–3 business days · ₹499', 'Available for select pin codes'],
              ['White Glove Delivery', 'Scheduled · ₹999', 'Luxury packaging + room placement assistance'],
            ].map(([title, sub, note]) => (
              <div key={title} className="flex gap-4 p-5 bg-ivory-100">
                <Truck size={20} className="text-champagne-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-obsidian">{title}</div>
                  <div className="text-sm text-obsidian/60 mt-0.5">{sub}</div>
                  <div className="text-xs text-champagne-700 mt-1">{note}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProductDetailSkeleton() {
  return (
    <>
      <Navbar />
      <main className="pt-[var(--nav-height)]">
        <div className="container-luxury py-12">
          <div className="grid lg:grid-cols-2 gap-16">
            <div className="aspect-square skeleton" />
            <div className="space-y-6">
              <div className="h-4 w-24 skeleton" />
              <div className="h-10 w-3/4 skeleton" />
              <div className="h-4 w-1/2 skeleton" />
              <div className="h-12 w-1/3 skeleton" />
              <div className="h-32 skeleton" />
              <div className="h-14 skeleton" />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
