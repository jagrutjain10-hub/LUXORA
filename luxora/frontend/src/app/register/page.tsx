'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, ArrowRight, Loader, Check } from 'lucide-react';
import { useRegister } from '@/hooks/useProducts';
import { cn } from '@/lib/utils';

const registerSchema = z.object({
  firstName: z.string().min(2, 'First name required'),
  lastName: z.string().min(2, 'Last name required'),
  email: z.string().email('Valid email required'),
  phone: z.string().optional(),
  password: z.string()
    .min(8, 'At least 8 characters')
    .regex(/[A-Z]/, 'Include at least one uppercase letter')
    .regex(/[0-9]/, 'Include at least one number'),
  confirmPassword: z.string(),
  agreeToTerms: z.boolean().refine(v => v === true, 'You must agree to the terms'),
}).refine(d => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [showPass, setShowPass] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  const { mutate: register, isPending } = useRegister();

  const { register: rf, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const password = watch('password', '');
  const passwordChecks = [
    { label: '8+ characters', pass: password.length >= 8 },
    { label: 'Uppercase letter', pass: /[A-Z]/.test(password) },
    { label: 'Number', pass: /[0-9]/.test(password) },
  ];

  const onSubmit = (data: RegisterFormData) => {
    register(data, {
      onSuccess: () => setSubmitted(true),
    });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-16 h-16 bg-champagne-900/40 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={28} className="text-champagne-400" />
          </div>
          <div className="label-gold text-champagne-400 mb-3">Account Created</div>
          <h2 className="font-display text-3xl text-ivory font-light mb-4">Verify Your Email</h2>
          <p className="text-ivory/50 font-body mb-8 leading-relaxed">
            We've sent a verification link to your email address. Please check your inbox and click the link to activate your account.
          </p>
          <Link href="/login" className="btn-ghost">
            Return to Sign In
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-obsidian flex">
      {/* Decorative Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden"
        style={{ background: 'radial-gradient(ellipse at 60% 40%, #0e1a2e 0%, #0a0a0a 70%)' }}
      >
        <div className="absolute inset-0 bg-noise opacity-40" />
        <div className="absolute top-1/3 right-1/4 w-72 h-72 rounded-full border border-champagne-900/20" />
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 rounded-full border border-champagne-900/10" />

        <div className="relative z-10 text-center px-16">
          <Link href="/">
            <div className="font-display text-4xl text-ivory tracking-[0.4em] font-light mb-4">LUXORA</div>
          </Link>
          <div className="w-12 h-px bg-champagne-600 mx-auto mb-8" />
          <p className="text-ivory/50 font-body leading-relaxed italic">
            Join thousands who've transformed their spaces with LUXORA's curated luxury collection.
          </p>
          <div className="mt-12 space-y-4">
            {[
              'Exclusive member-only previews',
              'Early access to new arrivals',
              'Order tracking & history',
              'Curated recommendations',
            ].map(benefit => (
              <div key={benefit} className="flex items-center gap-3 text-ivory/50 text-sm font-body">
                <Check size={14} className="text-champagne-600 flex-shrink-0" />
                {benefit}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md py-8"
        >
          <Link href="/" className="lg:hidden block text-center mb-10">
            <span className="font-display text-3xl text-ivory tracking-[0.4em]">LUXORA</span>
          </Link>

          <div className="mb-10">
            <div className="label-gold text-champagne-400 mb-3">New Member</div>
            <h1 className="font-display text-display-sm text-ivory font-light">Create Account</h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-body text-ivory/50 uppercase tracking-widest mb-2">First Name *</label>
                <input
                  {...rf('firstName')}
                  placeholder="Priya"
                  className={cn(
                    'w-full bg-transparent border-b py-3 text-ivory placeholder:text-ivory/25 font-body text-sm focus:outline-none transition-colors',
                    errors.firstName ? 'border-red-500' : 'border-ivory/15 focus:border-champagne-500'
                  )}
                />
                {errors.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-body text-ivory/50 uppercase tracking-widest mb-2">Last Name *</label>
                <input
                  {...rf('lastName')}
                  placeholder="Mehta"
                  className={cn(
                    'w-full bg-transparent border-b py-3 text-ivory placeholder:text-ivory/25 font-body text-sm focus:outline-none transition-colors',
                    errors.lastName ? 'border-red-500' : 'border-ivory/15 focus:border-champagne-500'
                  )}
                />
                {errors.lastName && <p className="text-red-400 text-xs mt-1">{errors.lastName.message}</p>}
              </div>
            </div>

            {[
              { name: 'email' as const, label: 'Email Address *', type: 'email', placeholder: 'hello@example.com' },
              { name: 'phone' as const, label: 'Phone (Optional)', type: 'tel', placeholder: '+91 98765 43210' },
            ].map(({ name, label, type, placeholder }) => (
              <div key={name}>
                <label className="block text-xs font-body text-ivory/50 uppercase tracking-widest mb-2">{label}</label>
                <input
                  {...rf(name)}
                  type={type}
                  placeholder={placeholder}
                  className={cn(
                    'w-full bg-transparent border-b py-3 text-ivory placeholder:text-ivory/25 font-body text-sm focus:outline-none transition-colors',
                    errors[name] ? 'border-red-500' : 'border-ivory/15 focus:border-champagne-500'
                  )}
                />
                {errors[name] && <p className="text-red-400 text-xs mt-1">{(errors[name] as any)?.message}</p>}
              </div>
            ))}

            <div>
              <label className="block text-xs font-body text-ivory/50 uppercase tracking-widest mb-2">Password *</label>
              <div className="relative">
                <input
                  {...rf('password')}
                  type={showPass ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  className={cn(
                    'w-full bg-transparent border-b py-3 pr-10 text-ivory placeholder:text-ivory/25 font-body text-sm focus:outline-none transition-colors',
                    errors.password ? 'border-red-500' : 'border-ivory/15 focus:border-champagne-500'
                  )}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-0 top-1/2 -translate-y-1/2 text-ivory/30 hover:text-ivory/60 transition-colors">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Password strength */}
              {password && (
                <div className="flex gap-3 mt-3">
                  {passwordChecks.map(({ label, pass }) => (
                    <div key={label} className={cn('flex items-center gap-1.5 text-xs font-body', pass ? 'text-green-400' : 'text-ivory/30')}>
                      <Check size={10} className={cn(pass && 'text-green-400')} />
                      {label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-body text-ivory/50 uppercase tracking-widest mb-2">Confirm Password *</label>
              <input
                {...rf('confirmPassword')}
                type="password"
                placeholder="Repeat password"
                className={cn(
                  'w-full bg-transparent border-b py-3 text-ivory placeholder:text-ivory/25 font-body text-sm focus:outline-none transition-colors',
                  errors.confirmPassword ? 'border-red-500' : 'border-ivory/15 focus:border-champagne-500'
                )}
              />
              {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <label className="flex items-start gap-3 cursor-pointer pt-2">
              <input {...rf('agreeToTerms')} type="checkbox" className="accent-champagne-500 w-4 h-4 mt-0.5 flex-shrink-0" />
              <span className="text-sm font-body text-ivory/50 leading-relaxed">
                I agree to LUXORA's{' '}
                <Link href="/terms" className="text-champagne-500 hover:text-champagne-400">Terms of Service</Link>
                {' '}and{' '}
                <Link href="/privacy" className="text-champagne-500 hover:text-champagne-400">Privacy Policy</Link>
              </span>
            </label>
            {errors.agreeToTerms && <p className="text-red-400 text-xs">{errors.agreeToTerms.message}</p>}

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-4 bg-champagne-500 text-obsidian font-body text-sm uppercase tracking-widest
                         hover:bg-champagne-400 disabled:opacity-60 transition-all duration-200 flex items-center justify-center gap-2 mt-4"
            >
              {isPending ? <Loader size={16} className="animate-spin" /> : <ArrowRight size={16} />}
              {isPending ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm font-body text-ivory/40">
            Already a member?{' '}
            <Link href="/login" className="text-champagne-500 hover:text-champagne-400 transition-colors">Sign In</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
