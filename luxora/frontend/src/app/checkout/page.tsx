'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Check, Truck, Lock, ChevronDown, ChevronUp,
  Copy, CheckCircle, Upload, X, Image as ImageIcon
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useCartStore } from '@/store/cart.store';
import { useAuthStore } from '@/store/wishlist.store';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import Image from 'next/image';

// ─── UPI CONFIG ───────────────────────────────────────────────────────────────
const UPI_CONFIG = {
  upiId: 'jagrutjain10@okaxis',
  businessName: 'LUXORA',
  qrCodeUrl: '/images/upi-qr.png',
};

// ─── FORM SCHEMA ──────────────────────────────────────────────────────────────
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

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu & Kashmir', 'Ladakh',
];

const STEPS = ['shipping', 'payment', 'review'] as const;
type Step = typeof STEPS[number];

// ─── STEP INDICATOR ───────────────────────────────────────────────────────────
function StepIndicator({ current }: { current: Step }) {
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4 mt-6 flex-wrap">
      {STEPS.map((s, i) => {
        const done = STEPS.indexOf(current) > i;
        const active = current === s;
        return (
          <div key={s} className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <div className={cn(
                'w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono transition-all duration-300',
                active ? 'bg-champagne-500 text-obsidian'
                  : done ? 'bg-champagne-800 text-champagne-400'
                  : 'bg-obsidian-700 text-ivory/30 border border-ivory/10'
              )}>
                {done ? <Check size={12} /> : i + 1}
              </div>
              <span className={cn(
                'text-xs font-body uppercase tracking-widest capitalize',
                active ? 'text-champagne-400' : 'text-ivory/30'
              )}>
                {s}
              </span>
            </div>
            {i < 2 && <div className="w-6 sm:w-8 h-px bg-ivory/10 hidden sm:block" />}
          </div>
        );
      })}
    </div>
  );
}

// ─── ORDER SUMMARY SIDEBAR ────────────────────────────────────────────────────
function OrderSummary({ items, sub, shipping, total, collapsed, onToggle }: any) {
  return (
    <div className="bg-white border border-sand-200 sticky top-24">
      <button
        className="w-full flex items-center justify-between p-4 sm:p-5 border-b border-sand-100"
        onClick={onToggle}
      >
        <span className="font-body text-sm uppercase tracking-widest font-medium text-obsidian">
          Order Summary ({items.length})
        </span>
        <span className="lg:hidden text-obsidian/50">
          {collapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
        </span>
      </button>
      <div className={cn('lg:block', collapsed && 'hidden')}>
        <div className="p-4 sm:p-5 space-y-4 max-h-64 overflow-y-auto">
          {items.map((item: any) => (
            <div key={item.productId} className="flex gap-3">
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 bg-ivory-100 flex-shrink-0">
                {item.image && (
                  <Image src={item.image} alt={item.name} fill className="object-cover" sizes="56px" />
                )}
                <span className="absolute -top-1.5 -right-1.5 bg-obsidian text-ivory text-[10px] rounded-full flex items-center justify-center font-mono w-[18px] h-[18px]">
                  {item.quantity}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-body text-obsidian line-clamp-2">{item.name}</div>
                <div className="font-display text-sm text-obsidian mt-1">
                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-sand-100 p-4 sm:p-5 space-y-3">
          <div className="flex justify-between text-sm font-body text-obsidian/60">
            <span>Subtotal</span>
            <span>₹{sub.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between text-sm font-body text-obsidian/60">
            <span>Shipping</span>
            <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
              {shipping === 0 ? 'Free' : `₹${shipping}`}
            </span>
          </div>
          {shipping > 0 && (
            <p className="text-xs text-obsidian/40 font-body">Free shipping on orders above ₹2,999</p>
          )}
          <div className="flex justify-between items-baseline pt-3 border-t border-sand-100">
            <span className="text-sm font-body font-medium text-obsidian">Total</span>
            <span className="font-display text-2xl text-obsidian">₹{total.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SHIPPING STEP ────────────────────────────────────────────────────────────
function ShippingStep({ register, errors, handleSubmit, onSubmit, isActive, shippingData, onEdit }: any) {
  const done = !!shippingData;
  return (
    <div className={cn('bg-white border transition-all', isActive ? 'border-champagne-300' : 'border-sand-200')}>
      <button
        className="w-full flex items-center justify-between p-5 sm:p-6 text-left"
        onClick={onEdit}
      >
        <div className="flex items-center gap-3">
          <div className={cn(
            'w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0',
            isActive ? 'bg-champagne-500 text-obsidian' : done ? 'bg-green-100 text-green-700' : 'bg-ivory-100 text-obsidian/30'
          )}>
            {done && !isActive ? <Check size={12} /> : '1'}
          </div>
          <span className="font-body text-sm uppercase tracking-widest font-medium text-obsidian">
            Shipping Information
          </span>
        </div>
        {!isActive && shippingData && (
          <span className="text-xs text-obsidian/40 font-body truncate ml-2">
            {shippingData.city}, {shippingData.state}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="px-4 sm:px-6 pb-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-1">
                  <label className="block text-xs font-body text-obsidian/50 mb-2 uppercase tracking-wider">Full Name *</label>
                  <input {...register('fullName')} className="input-luxury w-full" placeholder="Priya Mehta" />
                  {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-body text-obsidian/50 mb-2 uppercase tracking-wider">Phone *</label>
                  <input {...register('phone')} className="input-luxury w-full" placeholder="+91 98765 43210" />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-body text-obsidian/50 mb-2 uppercase tracking-wider">Email *</label>
                  <input {...register('email')} type="email" className="input-luxury w-full" placeholder="priya@example.com" />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-body text-obsidian/50 mb-2 uppercase tracking-wider">Address Line 1 *</label>
                  <input {...register('line1')} className="input-luxury w-full" placeholder="House / Flat / Building No, Street" />
                  {errors.line1 && <p className="text-red-500 text-xs mt-1">{errors.line1.message}</p>}
                </div>
                <div className="sm:col-span-2">
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
                <div className="sm:col-span-2">
                  <label className="block text-xs font-body text-obsidian/50 mb-2 uppercase tracking-wider">State *</label>
                  <select {...register('state')} className="input-luxury w-full bg-transparent" style={{ fontSize: 16 }}>
                    <option value="">Select State</option>
                    {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>}
                </div>
              </div>
              <button type="submit" className="btn-primary w-full justify-center mt-2">
                Continue to Payment
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── UPI PAYMENT STEP ─────────────────────────────────────────────────────────
function UpiPaymentStep({
  isActive, isDone, total, screenshot, onScreenshotChange, onContinue, onEdit
}: {
  isActive: boolean;
  isDone: boolean;
  total: number;
  screenshot: File | null;
  onScreenshotChange: (file: File | null) => void;
  onContinue: () => void;
  onEdit: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const copyUpiId = () => {
    navigator.clipboard.writeText(UPI_CONFIG.upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('UPI ID copied!');
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!allowed.includes(file.type)) {
      toast.error('Please upload JPG, PNG or PDF only');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be under 5MB');
      return;
    }
    onScreenshotChange(file);
  };

  const handleContinue = () => {
    if (!screenshot) {
      toast.error('Please upload payment screenshot to continue');
      return;
    }
    onContinue();
  };

  return (
    <div className={cn(
      'bg-white border transition-all',
      isActive ? 'border-champagne-300' : 'border-sand-200',
      !isActive && !isDone && 'opacity-50 pointer-events-none'
    )}>
      <button
        className="w-full flex items-center justify-between p-5 sm:p-6 text-left"
        onClick={isDone && !isActive ? onEdit : undefined}
      >
        <div className="flex items-center gap-3">
          <div className={cn(
            'w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0',
            isActive ? 'bg-champagne-500 text-obsidian'
              : isDone ? 'bg-green-100 text-green-700'
              : 'bg-ivory-100 text-obsidian/30'
          )}>
            {isDone && !isActive ? <Check size={12} /> : '2'}
          </div>
          <span className="font-body text-sm uppercase tracking-widest font-medium text-obsidian">
            Scan & Pay via UPI
          </span>
        </div>
        {isDone && !isActive && screenshot && (
          <span className="text-xs text-green-600 font-body flex items-center gap-1">
            <CheckCircle size={12} /> Screenshot uploaded
          </span>
        )}
      </button>

      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 sm:px-6 pb-6 space-y-6">
              {/* Amount */}
              <div className="bg-champagne-50 border border-champagne-200 p-4 text-center">
                <p className="text-xs uppercase tracking-widest text-obsidian/50 font-body mb-1">Amount to Pay</p>
                <p className="font-display text-3xl text-obsidian">₹{total.toLocaleString('en-IN')}</p>
              </div>

              {/* QR + UPI ID */}
              <div className="flex flex-col sm:flex-row gap-6 items-center">
                {/* QR Code */}
                <div className="flex-shrink-0">
                  <div className="w-44 h-44 sm:w-48 sm:h-48 border-2 border-sand-200 p-2 bg-white mx-auto">
                    <div className="w-full h-full bg-ivory-100 flex items-center justify-center relative">
                      <Image
                        src={UPI_CONFIG.qrCodeUrl}
                        alt="UPI QR Code"
                        fill
                        className="object-contain p-1"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                      {/* Fallback if no QR image */}
                      <div className="text-xs text-obsidian/40 font-body text-center px-2 z-0 hidden">
                        <ImageIcon size={32} className="mx-auto mb-2 text-sand-400" />
                        <p>QR Code</p>
                        <p className="text-[10px]">Add upi-qr.png to public/images/</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-center text-xs text-obsidian/40 font-body mt-2">Scan with any UPI app</p>
                </div>

                {/* UPI ID + Instructions */}
                <div className="flex-1 space-y-4 w-full">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-obsidian/50 font-body mb-2">UPI ID</p>
                    <div className="flex items-center gap-2 border border-sand-200 p-3 bg-ivory-50">
                      <span className="flex-1 font-mono text-sm text-obsidian truncate">{UPI_CONFIG.upiId}</span>
                      <button
                        onClick={copyUpiId}
                        className={cn(
                          'flex items-center gap-1 px-3 py-1.5 text-xs font-body transition-all border',
                          copied
                            ? 'bg-green-50 border-green-200 text-green-700'
                            : 'bg-white border-sand-200 text-obsidian hover:bg-obsidian hover:text-ivory hover:border-obsidian'
                        )}
                      >
                        {copied ? <CheckCircle size={12} /> : <Copy size={12} />}
                        {copied ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  </div>

                  {/* Instructions */}
                  <div>
                    <p className="text-xs uppercase tracking-widest text-obsidian/50 font-body mb-2">Instructions</p>
                    <ol className="space-y-1.5">
                      {[
                        'Open GPay, PhonePe, Paytm or any UPI app',
                        'Scan the QR code or search UPI ID above',
                        `Pay ₹${total.toLocaleString('en-IN')} to ${UPI_CONFIG.businessName}`,
                        'Take a screenshot of successful payment',
                        'Upload the screenshot below',
                      ].map((step, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs font-body text-obsidian/60">
                          <span className="w-4 h-4 rounded-full bg-champagne-100 text-champagne-700 flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>

              {/* Screenshot Upload */}
              <div>
                <p className="text-xs uppercase tracking-widest text-obsidian/50 font-body mb-3">
                  Upload Payment Screenshot *
                </p>

                {screenshot ? (
                  <div className="border border-green-200 bg-green-50 p-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <CheckCircle size={18} className="text-green-600 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-body text-green-700 truncate">{screenshot.name}</p>
                        <p className="text-xs text-green-600/70">{(screenshot.size / 1024).toFixed(0)} KB</p>
                      </div>
                    </div>
                    <button
                      onClick={() => { onScreenshotChange(null); if (fileRef.current) fileRef.current.value = ''; }}
                      className="text-green-600 hover:text-red-500 transition-colors flex-shrink-0"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-sand-300 hover:border-champagne-400 p-8 cursor-pointer transition-colors group">
                    <Upload size={24} className="text-obsidian/30 group-hover:text-champagne-500 mb-3 transition-colors" />
                    <p className="text-sm font-body text-obsidian/60 text-center">
                      Click to upload payment screenshot
                    </p>
                    <p className="text-xs text-obsidian/40 font-body mt-1">JPG, PNG or PDF · Max 5MB</p>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,application/pdf"
                      className="hidden"
                      onChange={handleFile}
                    />
                  </label>
                )}
              </div>

              <button
                onClick={handleContinue}
                className="btn-primary w-full justify-center"
                disabled={!screenshot}
              >
                {screenshot ? 'Review Order →' : 'Upload screenshot to continue'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── REVIEW STEP ──────────────────────────────────────────────────────────────
function ReviewStep({
  isActive, shippingData, screenshot, total, processing, onPlaceOrder, onEditShipping, onEditPayment
}: any) {
  return (
    <div className={cn(
      'bg-white border transition-all',
      isActive ? 'border-champagne-300' : 'border-sand-200',
      !isActive && 'opacity-50 pointer-events-none'
    )}>
      <div className="flex items-center p-5 sm:p-6 gap-3">
        <div className={cn(
          'w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0',
          isActive ? 'bg-champagne-500 text-obsidian' : 'bg-ivory-100 text-obsidian/30'
        )}>3</div>
        <span className="font-body text-sm uppercase tracking-widest font-medium text-obsidian">
          Review & Place Order
        </span>
      </div>

      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 sm:px-6 pb-6 space-y-4">
              {/* Shipping Summary */}
              {shippingData && (
                <div className="bg-ivory-50 p-4 text-sm font-body">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-obsidian/50">
                      <Truck size={12} /> Delivering To
                    </div>
                    <button onClick={onEditShipping} className="text-xs text-champagne-700 hover:text-obsidian transition-colors">
                      Edit
                    </button>
                  </div>
                  <div className="text-obsidian font-medium">{shippingData.fullName}</div>
                  <div className="text-obsidian/60 text-xs mt-0.5">
                    {shippingData.line1}{shippingData.line2 && `, ${shippingData.line2}`}
                  </div>
                  <div className="text-obsidian/60 text-xs">
                    {shippingData.city}, {shippingData.state} — {shippingData.pincode}
                  </div>
                  <div className="text-obsidian/60 text-xs">{shippingData.phone}</div>
                </div>
              )}

              {/* Payment Summary */}
              <div className="bg-ivory-50 p-4 text-sm font-body">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs uppercase tracking-wider text-obsidian/50">Payment</span>
                  <button onClick={onEditPayment} className="text-xs text-champagne-700 hover:text-obsidian transition-colors">
                    Edit
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-green-600" />
                  <span className="text-obsidian font-medium">UPI Payment</span>
                </div>
                {screenshot && (
                  <p className="text-xs text-green-600 mt-1">Screenshot: {screenshot.name}</p>
                )}
              </div>

              {/* Security Badge */}
              <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-100">
                <Lock size={15} className="text-green-600 flex-shrink-0" />
                <p className="text-xs text-green-700 font-body">
                  Your order will be confirmed after admin verifies your payment screenshot.
                </p>
              </div>

              {/* Place Order Button */}
              <button
                onClick={onPlaceOrder}
                disabled={processing}
                className={cn(
                  'btn-primary w-full justify-center py-4 text-sm',
                  processing && 'opacity-70 cursor-not-allowed'
                )}
              >
                {processing ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Placing Order...
                  </span>
                ) : (
                  `Place Order · ₹${total.toLocaleString('en-IN')}`
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── MAIN CHECKOUT PAGE ───────────────────────────────────────────────────────
export default function CheckoutPage() {
  const [step, setStep] = useState<Step>('shipping');
  const [shippingData, setShippingData] = useState<any>(null);
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotUrl, setScreenshotUrl] = useState<string>('');
  const [processing, setProcessing] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);

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

  const onShippingSubmit = (data: any) => {
    setShippingData(data);
    setStep('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScreenshotChange = async (file: File | null) => {
    setScreenshot(file);
    if (!file) { setScreenshotUrl(''); return; }

    // Upload to cloudinary via our API
    try {
      const formData = new FormData();
      formData.append('image', file);
      const { data } = await api.post('/upload/single', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setScreenshotUrl(data.data?.url ?? '');
    } catch {
      // Use object URL as fallback
      setScreenshotUrl(URL.createObjectURL(file));
    }
  };

  const handlePaymentContinue = () => {
    setStep('review');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlaceOrder = async () => {
    if (!shippingData || !items.length || !screenshot) return;
    setProcessing(true);

    try {
      const { data } = await api.post('/orders', {
        items: items.map(i => ({ productId: i.productId, quantity: i.quantity })),
        paymentMethod: 'UPI',
        paymentScreenshotUrl: screenshotUrl || 'pending-upload',
        shippingAddress: shippingData,
      });

      clearCart();
      toast.success('Order placed! We will verify your payment shortly.');
      router.push(`/dashboard/orders/${data.data.id}?success=true`);
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? 'Failed to place order. Please try again.');
      setProcessing(false);
    }
  };

  // Redirect if cart empty
  if (typeof window !== 'undefined' && !items.length && !processing) {
    router.push('/cart');
    return null;
  }

  return (
    <>
      <Navbar />
      <main className="pt-[var(--nav-height)] min-h-screen bg-ivory-50">
        {/* Header */}
        <div className="bg-obsidian py-8 sm:py-10 section-px text-center">
          <div className="label-gold text-champagne-400 mb-2">Secure Checkout</div>
          <h1 className="font-display text-2xl sm:text-display-sm text-ivory font-light">
            Complete Your Order
          </h1>
          <StepIndicator current={step} />
        </div>

        <div className="container-luxury py-8 sm:py-10">
          <div className="grid lg:grid-cols-3 gap-6 lg:gap-10">
            {/* Left: Steps */}
            <div className="lg:col-span-2 space-y-4">
              <ShippingStep
                register={register}
                errors={errors}
                handleSubmit={handleSubmit}
                onSubmit={onShippingSubmit}
                isActive={step === 'shipping'}
                shippingData={shippingData}
                onEdit={() => step !== 'shipping' && setStep('shipping')}
              />

              <UpiPaymentStep
                isActive={step === 'payment'}
                isDone={step === 'review'}
                total={total}
                screenshot={screenshot}
                onScreenshotChange={handleScreenshotChange}
                onContinue={handlePaymentContinue}
                onEdit={() => setStep('payment')}
              />

              <ReviewStep
                isActive={step === 'review'}
                shippingData={shippingData}
                screenshot={screenshot}
                total={total}
                processing={processing}
                onPlaceOrder={handlePlaceOrder}
                onEditShipping={() => setStep('shipping')}
                onEditPayment={() => setStep('payment')}
              />
            </div>

            {/* Right: Order Summary */}
            <div>
              <OrderSummary
                items={items}
                sub={sub}
                shipping={shipping}
                total={total}
                collapsed={!summaryOpen}
                onToggle={() => setSummaryOpen(!summaryOpen)}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
