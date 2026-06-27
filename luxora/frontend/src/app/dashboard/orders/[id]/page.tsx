'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Clock, Package, Truck, ArrowRight, Download } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { api } from '@/lib/api';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function OrderDetailPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const isSuccess = searchParams.get('success') === 'true';
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api.get(`/orders/my/${id}`)
      .then(res => setOrder(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const STATUS_STEPS = [
    { key: 'PENDING', label: 'Order Placed', icon: Package, desc: 'Your order has been received' },
    { key: 'CONFIRMED', label: 'Payment Verified', icon: CheckCircle, desc: 'Payment confirmed by admin' },
    { key: 'PROCESSING', label: 'Processing', icon: Package, desc: 'Your items are being prepared' },
    { key: 'SHIPPED', label: 'Shipped', icon: Truck, desc: 'On its way to you' },
    { key: 'DELIVERED', label: 'Delivered', icon: CheckCircle, desc: 'Delivered successfully' },
  ];

  const currentStepIdx = STATUS_STEPS.findIndex(s => s.key === order?.status) ?? 0;

  return (
    <>
      <Navbar />
      <main className="pt-[var(--nav-height)] min-h-screen bg-ivory-50">
        {/* Success Banner */}
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-600 text-white py-4 px-4 text-center"
          >
            <div className="flex items-center justify-center gap-2">
              <CheckCircle size={18} />
              <p className="font-body text-sm font-medium">
                Order placed successfully! We'll verify your payment and confirm your order shortly.
              </p>
            </div>
          </motion.div>
        )}

        <div className="container-luxury py-10 sm:py-14">
          {loading ? (
            <div className="space-y-4 max-w-2xl mx-auto">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-16 bg-sand-100 animate-pulse" />
              ))}
            </div>
          ) : !order ? (
            <div className="text-center py-20">
              <p className="text-obsidian/50 font-body mb-6">Order not found.</p>
              <Link href="/dashboard" className="btn-primary">My Orders</Link>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto space-y-6">
              {/* Order Header */}
              <div className="bg-white border border-sand-200 p-5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-obsidian/40 font-body mb-1">Order Number</p>
                    <p className="font-display text-2xl text-obsidian">#{order.orderNumber}</p>
                    <p className="text-xs text-obsidian/40 font-body mt-1">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'long', year: 'numeric',
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-widest text-obsidian/40 font-body mb-1">Total</p>
                    <p className="font-display text-2xl text-obsidian">₹{Number(order.totalAmount).toLocaleString('en-IN')}</p>
                  </div>
                </div>
              </div>

              {/* Payment Status */}
              <div className={`p-4 border ${
                order.payment?.status === 'PENDING'
                  ? 'bg-amber-50 border-amber-200'
                  : order.payment?.status === 'PAID'
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center gap-3">
                  {order.payment?.status === 'PENDING' && <Clock size={18} className="text-amber-600 flex-shrink-0" />}
                  {order.payment?.status === 'PAID' && <CheckCircle size={18} className="text-green-600 flex-shrink-0" />}
                  <div>
                    <p className="font-body text-sm font-medium text-obsidian">
                      {order.payment?.status === 'PENDING' && 'Payment Pending Verification'}
                      {order.payment?.status === 'PAID' && 'Payment Verified ✓'}
                      {order.payment?.status === 'FAILED' && 'Payment Rejected'}
                    </p>
                    <p className="text-xs text-obsidian/50 font-body mt-0.5">
                      {order.payment?.status === 'PENDING' && 'Our team will verify your UPI payment screenshot within 24 hours.'}
                      {order.payment?.status === 'PAID' && `Verified on ${new Date(order.payment.paidAt).toLocaleDateString('en-IN')}`}
                      {order.payment?.status === 'FAILED' && 'Please contact us at hello@luxora.in for assistance.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Timeline */}
              <div className="bg-white border border-sand-200 p-5 sm:p-6">
                <p className="text-xs uppercase tracking-widest text-obsidian/50 font-body mb-5">Order Progress</p>
                <div className="space-y-4">
                  {STATUS_STEPS.map((step, i) => {
                    const done = i <= currentStepIdx;
                    const active = i === currentStepIdx;
                    const Icon = step.icon;
                    return (
                      <div key={step.key} className="flex items-start gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                            done ? 'bg-champagne-500 text-obsidian' : 'bg-sand-100 text-obsidian/30'
                          }`}>
                            <Icon size={14} />
                          </div>
                          {i < STATUS_STEPS.length - 1 && (
                            <div className={`w-px h-6 mt-1 transition-all ${done && i < currentStepIdx ? 'bg-champagne-400' : 'bg-sand-200'}`} />
                          )}
                        </div>
                        <div className="pb-4">
                          <p className={`text-sm font-body font-medium ${active ? 'text-obsidian' : done ? 'text-obsidian/70' : 'text-obsidian/30'}`}>
                            {step.label}
                          </p>
                          <p className={`text-xs font-body ${active ? 'text-obsidian/60' : 'text-obsidian/30'}`}>
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Items */}
              <div className="bg-white border border-sand-200 p-5 sm:p-6">
                <p className="text-xs uppercase tracking-widest text-obsidian/50 font-body mb-4">Items</p>
                <div className="space-y-3">
                  {order.items?.map((item: any, i: number) => (
                    <div key={i} className="flex items-center gap-3">
                      {item.imageUrl && (
                        <div className="relative w-12 h-12 bg-ivory-100 flex-shrink-0">
                          <Image src={item.imageUrl} alt={item.productName} fill className="object-cover" sizes="48px" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-body text-obsidian truncate">{item.productName}</p>
                        <p className="text-xs text-obsidian/50 font-mono">
                          Qty {item.quantity} × ₹{Number(item.unitPrice).toLocaleString('en-IN')}
                        </p>
                      </div>
                      <p className="font-display text-sm text-obsidian flex-shrink-0">
                        ₹{(Number(item.unitPrice) * item.quantity).toLocaleString('en-IN')}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-sand-100 flex justify-between">
                  <span className="font-body text-sm text-obsidian">Total</span>
                  <span className="font-display text-xl text-obsidian">₹{Number(order.totalAmount).toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/products" className="btn-secondary flex-1 justify-center">
                  Continue Shopping
                </Link>
                <Link href="/dashboard" className="btn-primary flex-1 justify-center">
                  My Orders <ArrowRight size={14} />
                </Link>
              </div>

              {/* Help */}
              <p className="text-center text-xs text-obsidian/40 font-body">
                Questions? Email us at{' '}
                <a href="mailto:hello@luxora.in" className="text-champagne-700 hover:text-obsidian transition-colors">
                  hello@luxora.in
                </a>
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
