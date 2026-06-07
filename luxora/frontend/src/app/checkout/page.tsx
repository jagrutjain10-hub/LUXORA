// @ts-nocheck
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Check, CreditCard, Smartphone, Truck, Lock, ChevronDown, ChevronUp } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useCartStore } from '@/store/cart.store';
import { useAuthStore } from '@/store/wishlist.store';
import { orderApi, paymentApi } from '@/lib/api';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import Image from 'next/image';

const shippingSchema = z.object({
  fullName: z.string().min(2, 'Full name required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(10, 'Valid phone number required').max(13),
  line1: z.string().min(5, 'Address required'),
  line2: z.string().optional(),
  city: z.string().min(2, 'City required'),
  state: z.string().min(2, 'State required'),
  pincode: z.string().length(6, 'Valid 6-digit pincode required'),
});

const PAYMENT_METHODS = [
  { id: 'RAZORPAY', icon: CreditCard, label: 'Credit / Debit Card', sub: 'Visa, Mastercard, RuPay' },
  { id: 'UPI', icon: Smartphone, label: 'UPI', sub: 'GPay, PhonePe, Paytm' },
  { id: 'COD', icon: Truck, label: 'Cash on Delivery', sub: 'Pay when you receive' },
];

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu & Kashmir', 'Ladakh',
];

async function loadRazorpay() {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);
    if (window.Razorpay) return resolve(true);
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export default function CheckoutPage() {
  const [step, setStep] = useState('shipping');
  const [paymentMethod, setPaymentMethod] = useState('RAZORPAY');
  const [shippingData, setShippingData] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [orderSummaryOpen, setOrderSummaryOpen] = useState(false);

  const { items, subtotal, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const router = useRouter();

  const sub = subtotal();
  const shipping = sub >= 2999 ? 0 : 199;
  const total = sub + shipping;

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      fullName: user ? `${user.firstName} ${user.lastName}` : '',
      email: user?.email ?? '',
    },
  });

  const onShippingSubmit = (data) => {
    setShippingData(data);
    setStep('payment');
  };

  const handlePlaceOrder = async () => {
    if (!shippingData || !items.length) return;
    setProcessing(true);

    try {
      const { data: orderRes } = await orderApi.create({
        items: items.map(i => ({ productId: i.productId, quantity: i.quantity })),
        paymentMethod,
        shippingAddress: shippingData,
      });

      const orderId = orderRes.data.id;

      if (paymentMethod === 'COD') {
        clearCart();
        router.push(`/dashboard/orders/${orderId}?success=true`);
        return;
      }

      const loaded = await loadRazorpay();
      if (!loaded) throw new Error('Razorpay SDK failed to load');

      const { data: rzpRes } = await paymentApi.createRazorpayOrder(orderId);

      const options = {
        key: rzpRes.data.keyId,
        amount: rzpRes.data.amount,
        currency: rzpRes.data.currency,
        name: 'LUXORA',
        description: 'Luxury Home Decor',
        order_id: rzpRes.data.razorpayOrderId,
        handler: async (response) => {
          const { data: verifyRes } = await paymentApi.verify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            orderId,
          });
          if (verifyRes.success) {
            clearCart();
            router.push(`/dashboard/orders/${orderId}?success=true`);
          }
        },
        prefill: {
          name: shippingData.fullName,
          email: shippingData.email,
          contact: shippingData.phone,
        },
        notes: { orderId },
        theme: { color: '#c9a96e' },
        modal: { ondismiss: () => setProcessing(false) },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Failed to place order. Please try again.');
      setProcessing(false);
    }
  };

  if (typeof window !== 'undefined' && !items.length) {
    router.push('/cart');
    return null;
  }

  return (
    <>
      <Navbar />
      <main className="pt-[var(--nav-height)] min-h-screen bg-ivory-50">
        <div className="bg-obsidian py-10 section-px text-center">
          <div className="label-gold text-champagne-400 mb-2">Secure Checkout</div>
          <h1 className="font-display text-display-sm text-ivory font-light">Complete Your Order</h1>
          <div className="flex items-center justify-center gap-4 mt-6">
            {(['shipping', 'payment', 'review']).map((s, i) => (
              <div key={s} className="flex items-center gap-4">
                <div className={cn(
                  'w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono transition-all duration-300',
                  step === s ? 'bg-champagne-500 text-obsidian'
                    : i < ['shipping', 'payment', 'review'].indexOf(step) ? 'bg-champagne-800 text-champagne-400'
                    : 'bg-obsidian-700 text-ivory/30 border border-ivory/10'
                )}>
                  {i < ['shipping', 'payment', 'review'].indexOf(step) ? <Check size={12} /> : i + 1}
                </div>
                <span className={cn('text-xs font-body uppercase tracking-widest', step === s ? 'text-champagne-400' : 'text-ivory/30')}>
                  {s}
                </span>
                {i < 2 && <div className="w-8 h-px bg-ivory/10" />}
              </div>
            ))}
          </div>
        </div>

        <div className="container-luxury py-10">
          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-6">

              {/* Step 1: Shipping */}
              <div className={cn('bg-white border transition-all', step === 'shipping' ? 'border-champagne-300' : 'border-sand-200')}>
                <button className="w-full flex items-center justify-between p-6 text-left" onClick={() => step !== 'shipping' && setStep('shipping')}>
                  <div className="flex items-center gap-3">
                    <div className={cn('w-7 h-7 rounded-full flex items-center justify-center text-xs', step === 'shipping' ? 'bg-champagne-500 text-obsidian' : 'bg-green-100 text-green-700')}>
                      {step === 'shipping' ? '1' : <Check size={12} />}
                    </div>
                    <span className="font-body text-sm uppercase tracking-widest font-medium text-obsidian">Shipping Information</span>
                  </div>
                  {step !== 'shipping' && shippingData && (
                    <span className="text-xs text-obsidian/40 font-body">{shippingData.city}, {shippingData.state}</span>
                  )}
                </button>
                <AnimatePresence>
                  {step === 'shipping' && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <form onSubmit={handleSubmit(onShippingSubmit)} className="px-6 pb-6 space-y-5">
                        <div className="grid grid-cols-2 gap-5">
                          <div className="col-span-2 md:col-span-1">
                            <label className="block text-xs font-body text-obsidian/50 mb-2 uppercase tracking-wider">Full Name *</label>
                            <input {...register('fullName')} className="input-luxury w-full" placeholder="Priya Mehta" />
                            {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
                          </div>
                          <div>
                            <label className="block text-xs font-body text-obsidian/50 mb-2 uppercase tracking-wider">Phone *</label>
                            <input {...register('phone')} className="input-luxury w-full" placeholder="+91 98765 43210" />
                            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                          </div>
                          <div className="col-span-2">
                            <label className="block text-xs font-body text-obsidian/50 mb-2 uppercase tracking-wider">Email *</label>
                            <input {...register('email')} type="email" className="input-luxury w-full" placeholder="priya@example.com" />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                          </div>
                          <div className="col-span-2">
                            <label className="block text-xs font-body text-obsidian/50 mb-2 uppercase tracking-wider">Address Line 1 *</label>
                            <input {...register('line1')} className="input-luxury w-full" placeholder="House / Flat / Building No, Street" />
                            {errors.line1 && <p className="text-red-500 text-xs mt-1">{errors.line1.message}</p>}
                          </div>
                          <div className="col-span-2">
                            <label className="block text-xs font-body text-obsidian/50 mb-2 uppercase tracking-wider">Address Line 2</label>
                            <input {...register('line2')} className="input-luxury w-full" placeholder="Locality / Area (optional)" />
                          </div>
                          <div>
                            <label className="block text-xs font-body text-obsidian/50 mb-2 uppercase tracking-wider">City *</label>
                            <input {...register('city')} className="input-luxury w-full" placeholder="Mumbai" />
                            {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
                          </div>
                          <div>
                            <label className="block text-xs font-body text-obsidian/50 mb-2 uppercase tracking-wider">Pincode *</label>
                            <input {...register('pincode')} className="input-luxury w-full" placeholder="400001" maxLength={6} />
                            {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode.message}</p>}
                          </div>
                          <div className="col-span-2">
                            <label className="block text-xs font-body text-obsidian/50 mb-2 uppercase tracking-wider">State *</label>
                            <select {...register('state')} className="input-luxury w-full bg-transparent">
                              <option value="">Select State</option>
                              {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>}
                          </div>
                        </div>
                        <button type="submit" className="btn-primary w-full justify-center mt-4">Continue to Payment</button>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Step 2: Payment */}
              <div className={cn('bg-white border transition-all', step === 'payment' ? 'border-champagne-300' : 'border-sand-200', step === 'shipping' && 'opacity-60 pointer-events-none')}>
                <button className="w-full flex items-center p-6 gap-3 text-left" onClick={() => step === 'review' && setStep('payment')}>
                  <div className={cn('w-7 h-7 rounded-full flex items-center justify-center text-xs', step === 'payment' ? 'bg-champagne-500 text-obsidian' : step === 'review' ? 'bg-green-100 text-green-700' : 'bg-ivory-100 text-obsidian/30')}>
                    {step === 'review' ? <Check size={12} /> : '2'}
                  </div>
                  <span className="font-body text-sm uppercase tracking-widest font-medium text-obsidian">Payment Method</span>
                </button>
                <AnimatePresence>
                  {step === 'payment' && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden px-6 pb-6">
                      <div className="space-y-3 mb-6">
                        {PAYMENT_METHODS.map((pm) => (
                          <label key={pm.id} className={cn('flex items-center gap-4 p-4 border cursor-pointer transition-all duration-200', paymentMethod === pm.id ? 'border-champagne-400 bg-champagne-50/40' : 'border-sand-200 hover:border-sand-300')}>
                            <input type="radio" name="paymentMethod" value={pm.id} checked={paymentMethod === pm.id} onChange={() => setPaymentMethod(pm.id)} className="accent-champagne-500" />
                            <pm.icon size={20} className={cn(paymentMethod === pm.id ? 'text-champagne-600' : 'text-obsidian/40')} />
                            <div>
                              <div className="text-sm font-body font-medium text-obsidian">{pm.label}</div>
                              <div className="text-xs text-obsidian/40 font-body">{pm.sub}</div>
                            </div>
                          </label>
                        ))}
                      </div>
                      <button onClick={() => setStep('review')} className="btn-primary w-full justify-center">Review Order</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Step 3: Review */}
              <div className={cn('bg-white border transition-all', step === 'review' ? 'border-champagne-300' : 'border-sand-200', step !== 'review' && 'opacity-60 pointer-events-none')}>
                <div className="flex items-center p-6 gap-3">
                  <div className={cn('w-7 h-7 rounded-full flex items-center justify-center text-xs', step === 'review' ? 'bg-champagne-500 text-obsidian' : 'bg-ivory-100 text-obsidian/30')}>3</div>
                  <span className="font-body text-sm uppercase tracking-widest font-medium text-obsidian">Review & Place Order</span>
                </div>
                <AnimatePresence>
                  {step === 'review' && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden px-6 pb-6">
                      {shippingData && (
                        <div className="bg-ivory-50 p-4 mb-6 text-sm font-body">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs uppercase tracking-wider text-obsidian/50">Delivering To</span>
                            <button onClick={() => setStep('shipping')} className="text-xs text-champagne-700 hover:text-obsidian transition-colors">Edit</button>
                          </div>
                          <div className="text-obsidian font-medium">{shippingData.fullName}</div>
                          <div className="text-obsidian/60">{shippingData.line1}{shippingData.line2 && `, ${shippingData.line2}`}</div>
                          <div className="text-obsidian/60">{shippingData.city}, {shippingData.state} — {shippingData.pincode}</div>
                          <div className="text-obsidian/60">{shippingData.phone}</div>
                        </div>
                      )}
                      <div className="bg-ivory-50 p-4 mb-6 text-sm font-body">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs uppercase tracking-wider text-obsidian/50">Payment</span>
                          <button onClick={() => setStep('payment')} className="text-xs text-champagne-700 hover:text-obsidian transition-colors">Edit</button>
                        </div>
                        <div className="text-obsidian font-medium">{PAYMENT_METHODS.find(p => p.id === paymentMethod)?.label}</div>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-100 mb-6">
                        <Lock size={16} className="text-green-600 flex-shrink-0" />
                        <p className="text-xs text-green-700 font-body">Your order is protected by SSL encryption.</p>
                      </div>
                      <button onClick={handlePlaceOrder} disabled={processing} className={cn('btn-primary w-full justify-center text-base py-4', processing && 'opacity-70 cursor-not-allowed')}>
                        {processing ? 'Processing...' : `Place Order · Rs.${total.toLocaleString('en-IN')}`}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <div className="bg-white border border-sand-200 sticky top-24">
                <button className="w-full flex items-center justify-between p-5 border-b border-sand-100" onClick={() => setOrderSummaryOpen(!orderSummaryOpen)}>
                  <span className="font-body text-sm uppercase tracking-widest font-medium text-obsidian">Order Summary ({items.length})</span>
                  <span className="lg:hidden text-obsidian/50">{orderSummaryOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</span>
                </button>
                <div className={cn('lg:block', !orderSummaryOpen && 'hidden')}>
                  <div className="p-5 space-y-4 max-h-72 overflow-y-auto">
                    {items.map(item => (
                      <div key={item.productId} className="flex gap-3">
                        <div className="relative w-14 h-14 bg-ivory-100 flex-shrink-0">
                          {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" sizes="56px" />}
                          <span className="absolute -top-1.5 -right-1.5 bg-obsidian text-ivory text-[10px] rounded-full flex items-center justify-center font-mono" style={{ width: 18, height: 18 }}>
                            {item.quantity}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-body text-obsidian line-clamp-2">{item.name}</div>
                          <div className="font-display text-sm text-obsidian mt-1">Rs.{(item.price * item.quantity).toLocaleString('en-IN')}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-sand-100 p-5 space-y-3">
                    <div className="flex justify-between text-sm font-body text-obsidian/60">
                      <span>Subtotal</span>
                      <span>Rs.{sub.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-sm font-body text-obsidian/60">
                      <span>Shipping</span>
                      <span className={shipping === 0 ? 'text-green-600' : ''}>{shipping === 0 ? 'Free' : `Rs.${shipping}`}</span>
                    </div>
                    <div className="flex justify-between items-baseline pt-3 border-t border-sand-100">
                      <span className="text-sm font-body font-medium text-obsidian">Total</span>
                      <span className="font-display text-2xl text-obsidian">Rs.{total.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}