'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authApi } from '@/lib/api';
import toast from 'react-hot-toast';

const schema = z.object({ email: z.string().email('Enter a valid email') });

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async ({ email }: any) => {
    try {
      await authApi.forgotPassword(email);
      setSent(true);
    } catch {
      toast.error('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-obsidian flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        <Link href="/" className="block text-center mb-10">
          <span className="font-display text-3xl text-ivory tracking-[0.4em]">LUXORA</span>
        </Link>

        {sent ? (
          <div className="text-center">
            <div className="w-16 h-16 border border-champagne-600/40 flex items-center justify-center mx-auto mb-6">
              <span className="text-champagne-400 text-2xl">✓</span>
            </div>
            <h2 className="font-display text-2xl text-ivory font-light mb-3">Check your inbox</h2>
            <p className="text-ivory/50 font-body text-sm mb-8">
              If an account exists for that email, we have sent a password reset link.
            </p>
            <Link href="/login" className="text-champagne-400 text-sm font-body hover:text-champagne-300 transition-colors">
              Back to sign in
            </Link>
          </div>
        ) : (
          <>
            <h2 className="font-display text-3xl text-ivory font-light mb-2">Reset Password</h2>
            <p className="text-ivory/50 font-body text-sm mb-8">
              Enter your email and we will send you a reset link.
            </p>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-xs uppercase tracking-widest text-ivory/40 font-body mb-2">
                  Email Address
                </label>
                <input
                  {...register('email')}
                  type="email"
                  className="w-full bg-white/5 border border-white/10 text-ivory px-4 py-3 text-sm font-body focus:outline-none focus:border-champagne-500/50 placeholder:text-ivory/20"
                  placeholder="your@email.com"
                />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message as string}</p>}
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-champagne-600 text-obsidian py-3.5 text-xs uppercase tracking-widest font-body font-medium hover:bg-champagne-500 transition-colors disabled:opacity-60"
              >
                {isSubmitting ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
            <p className="text-center text-ivory/30 text-sm font-body mt-6">
              Remember your password?{' '}
              <Link href="/login" className="text-champagne-400 hover:text-champagne-300 transition-colors">
                Sign in
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}