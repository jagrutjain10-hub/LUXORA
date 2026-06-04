'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Minus, Plus, X, ShoppingBag, ArrowRight, Tag } from 'lucide-react';
import { useCartStore } from '@/store/cart.store';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, total } = useCartStore();

  const sub = subtotal();
  const shipping = sub >= 2999 ? 0 : 199;
  const grandTotal = sub + shipping;

  return (
    <>
      <Navbar />
      <main className="pt-[var(--nav-height)] min-h-screen bg-ivory-50">
        {/* Header */}
        <div className="bg-obsidian py-12 section-px text-center">
          <div className="label-gold text-champagne-400 mb-2">Your Selection</div>
          <h1 className="font-display text-display-md text-ivory font-light">Shopping Cart</h1>
        </div>

        <div className="container-luxury py-12">
          {items.length === 0 ? (
            <div className="text-center py-24">
              <div className="font-display text-8xl text-sand-200 mb-6">◇</div>
              <h2 className="font-display text-3xl text-obsidian font-light mb-3">Your cart is empty</h2>
              <p className="text-obsidian/50 font-body mb-10">Discover our curated collections to find something exceptional.</p>
              <Link href="/products" className="btn-primary">
                <ShoppingBag size={16} /> Explore Collections
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-10">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-sand-200">
                  <span className="text-sm font-body text-obsidian/60 uppercase tracking-widest">
                    {items.length} {items.length === 1 ? 'Item' : 'Items'}
                  </span>
                  <button
                    onClick={() => useCartStore.getState().clearCart()}
                    className="text-xs text-obsidian/40 font-body uppercase tracking-widest hover:text-red-500 transition-colors"
                  >
                    Clear All
                  </button>
                </div>

                <AnimatePresence>
                  {items.map((item) => (
                    <motion.div
                      key={item.productId}
                      layout
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex gap-5 bg-white p-5 border border-sand-200"
                    >
                      {/* Image */}
                      <div className="relative w-24 h-24 flex-shrink-0 bg-ivory-100">
                        {item.image ? (
                          <Image src={item.image} alt={item.name} fill className="object-cover" sizes="96px" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag size={20} className="text-sand-400" />
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <Link
                            href={`/products/${item.slug}`}
                            className="font-body text-sm font-medium text-obsidian hover:text-champagne-700 transition-colors leading-snug"
                          >
                            {item.name}
                          </Link>
                          <button
                            onClick={() => removeItem(item.productId)}
                            className="text-obsidian/30 hover:text-red-500 transition-colors flex-shrink-0"
                            aria-label="Remove item"
                          >
                            <X size={16} />
                          </button>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                          {/* Quantity */}
                          <div className="flex items-center border border-sand-200">
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center text-obsidian/50 hover:text-obsidian transition-colors"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-8 text-center text-sm font-mono">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center text-obsidian/50 hover:text-obsidian transition-colors"
                            >
                              <Plus size={12} />
                            </button>
                          </div>

                          {/* Price */}
                          <div className="font-display text-lg text-obsidian">
                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Order Summary */}
              <div className="space-y-4">
                <div className="bg-white border border-sand-200 p-6">
                  <h2 className="font-display text-xl text-obsidian font-medium mb-6">Order Summary</h2>

                  <div className="space-y-4 pb-6 border-b border-sand-100">
                    <div className="flex justify-between text-sm font-body">
                      <span className="text-obsidian/60">Subtotal ({items.length} items)</span>
                      <span className="text-obsidian">₹{sub.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-sm font-body">
                      <span className="text-obsidian/60">Shipping</span>
                      {shipping === 0 ? (
                        <span className="text-green-600 font-medium">Free</span>
                      ) : (
                        <span className="text-obsidian">₹{shipping}</span>
                      )}
                    </div>
                    {shipping > 0 && (
                      <div className="bg-champagne-50 px-4 py-3 text-xs font-body text-champagne-800">
                        Add ₹{(2999 - sub).toLocaleString('en-IN')} more for free shipping
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-baseline py-5">
                    <span className="font-body font-medium text-obsidian">Total</span>
                    <span className="font-display text-3xl text-obsidian font-light">
                      ₹{grandTotal.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <Link href="/checkout" className="btn-primary w-full justify-center">
                    Proceed to Checkout <ArrowRight size={16} />
                  </Link>

                  <Link href="/products" className="btn-secondary w-full justify-center mt-3">
                    Continue Shopping
                  </Link>
                </div>

                {/* Coupon */}
                <div className="bg-white border border-sand-200 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Tag size={15} className="text-champagne-600" />
                    <span className="text-sm font-body font-medium text-obsidian">Coupon Code</span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter code"
                      className="flex-1 border border-sand-200 px-3 py-2.5 text-sm font-body focus:outline-none focus:border-champagne-400"
                    />
                    <button className="px-4 bg-obsidian text-ivory text-xs font-body uppercase tracking-wider hover:bg-champagne-600 hover:text-obsidian transition-colors">
                      Apply
                    </button>
                  </div>
                </div>

                {/* Trust badges */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  {['🔒 Secure', '📦 Insured', '↩ 15-Day Return'].map(badge => (
                    <div key={badge} className="bg-white border border-sand-200 p-3 text-xs font-body text-obsidian/60">
                      {badge}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
