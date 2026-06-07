// @ts-nocheck
'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, ArrowRight, Loader } from 'lucide-react';
import { useLogin } from '@/hooks/useProducts';
import { cn } from '@/lib/utils';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().default(false),
});

type LoginFormData = z.infer<typeof loginSchema>;

function LoginForm() {
  const [showPass, setShowPass] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') ?? '/dashboard';
  const sessionExpired = searchParams.get('session') === 'expired';

  const { mutate: login, isPending } = useLogin();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    login(data, {
      onSuccess: () => router.push(redirectTo),
    });
  };

  return (
    <div className="min-h-screen bg-obsidian flex">
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden"
        style={{ background: 'radial-gradient(ellipse at 40% 60%, #2d1f0e 0%, #0a0a0a 70%)' }}
      >
        <div className="absolute inset-0 bg-noise opacity-40" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full border border-champagne-800/20" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full border border-champagne-800/10" />
        <div className="relative z-10 text-center px-16">
          <Link href="/">
            <div className="font-display text-4xl text-ivory tracking-[0.4em] font-light mb-4">LUXORA</div>
          </Link>
          <div className="w-12 h-px bg-champagne-600 mx-auto mb-8" />
          <p className="text-ivory/50 font-body text-lg leading-relaxed font-light italic">
            "Where every space becomes a sanctuary of refined living."
          </p>
          <div className="mt-12 grid grid-cols-3 gap-6 text-center">
            {[['2,400+', 'Products'], ['48K+', 'Clients'], ['4.9★', 'Rating']].map(([v, l]) => (
              <div key={l}>
                <div className="font-display text-2xl text-champagne-400 font-light">{v}</div>
                <div className="text-ivory/30 text-xs font-body uppercase tracking-widest mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <Link href="/" className="lg:hidden block text-center mb-10">
            <span className="font-display text-3xl text-ivory tracking-[0.4em]">LUXORA</span>
          </Link>

          <div className="mb-10">
            <div className="label-gold text-champagne-400 mb-3">Welcome Back</div>
            <h1 className="font-display text-display-sm text-ivory font-light">Sign In</h1>
          </div>

          {sessionExpired && (
            <div className="mb-6 p-4 bg-amber-900/30 border border-amber-800/40 text-amber-300 text-sm font-body">
              Your session expired. Please sign in again.
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-xs font-body text-ivory/50 uppercase tracking-widest mb-3">Email Address</label>
              <input
                {...register('email')}
                type="email"
                placeholder="hello@example.com"
                className={cn(
                  'w-full bg-transparent border-b py-3 text-ivory placeholder:text-ivory/25 font-body text-sm focus:outline-none transition-colors',
                  errors.email ? 'border-red-500' : 'border-ivory/15 focus:border-champagne-500'
                )}
              />
              {errors.email && <p className="text-red-400 text-xs mt-2">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-body text-ivory/50 uppercase tracking-widest mb-3">Password</label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={cn(
                    'w-full bg-transparent border-b py-3 pr-10 text-ivory placeholder:text-ivory/25 font-body text-sm focus:outline-none transition-colors',
                    errors.password ? 'border-red-500' : 'border-ivory/15 focus:border-champagne-500'
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-ivory/30 hover:text-ivory/60 transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-2">{errors.password.message}</p>}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input {...register('rememberMe')} type="checkbox" className="accent-champagne-500 w-4 h-4" />
                <span className="text-sm font-body text-ivory/50">Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-sm font-body text-champagne-500 hover:text-champagne-400 transition-colors">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-4 bg-champagne-500 text-obsidian font-body text-sm uppercase tracking-widest
                         hover:bg-champagne-400 disabled:opacity-60 transition-all duration-200 flex items-center justify-center gap-2"
            >
              {isPending ? <Loader size={16} className="animate-spin" /> : <ArrowRight size={16} />}
              {isPending ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm font-body text-ivory/40">
            Don't have an account?{' '}
            <Link href="/register" className="text-champagne-500 hover:text-champagne-400 transition-colors">
              Create Account
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-obsidian" />}>
      <LoginForm />
    </Suspense>
  );
}