'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/store/wishlist.store';
import toast from 'react-hot-toast';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
  remember: z.boolean().optional(),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { setAuth } = useAuthStore();
  const router = useRouter();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { remember: true },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await authApi.login(data.email, data.password);
      const { user, accessToken } = res.data.data;
      setAuth(user, accessToken);
      toast.success(`Welcome back, ${user.firstName}!`);
      if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
        router.push('/admin/dashboard');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? 'Login failed';
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen bg-obsidian flex flex-col lg:flex-row">
      {/* Left panel - decorative, hidden on small mobile */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative overflow-hidden">
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at 30% 60%, #2d1a0a 0%, #0a0a0a 70%)'
        }} />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
          <span className="font-display text-5xl xl:text-6xl text-ivory tracking-[0.4em] font-light mb-6">LUXORA</span>
          <div className="w-12 h-px bg-champagne-500 mb-6" />
          <p className="font-display text-ivory/50 text-xl font-light italic">Where Spaces Become Sanctuaries</p>
        </div>
        {/* Decorative lines */}
        <div className="absolute top-1/4 left-1/4 w-px h-1/3 bg-gradient-to-b from-transparent via-champagne-500/20 to-transparent" />
        <div className="absolute bottom-1/4 right-1/3 w-px h-1/4 bg-gradient-to-t from-transparent via-champagne-500/15 to-transparent" />
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex flex-col items-center justify-center min-h-screen lg:min-h-0 px-6 py-12 sm:px-10">
        {/* Mobile logo */}
        <Link href="/" className="lg:hidden mb-10">
          <span className="font-display text-3xl text-ivory tracking-[0.4em] font-light">LUXORA</span>
        </Link>

        <div className="w-full max-w-sm">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-widest text-champagne-600 font-body mb-2">Welcome Back</p>
            <h1 className="font-display text-3xl sm:text-4xl text-ivory font-light">Sign In</h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
            {/* Email */}
            <div>
              <label className="block text-xs uppercase tracking-widest text-ivory/40 font-body mb-2">
                Email Address
              </label>
              <input
                {...register('email')}
                type="email"
                autoComplete="email"
                className="w-full bg-white/5 border border-white/10 text-ivory px-4 py-3.5 text-base font-body focus:outline-none focus:border-champagne-500/50 placeholder:text-ivory/20 rounded-none"
                placeholder="your@email.com"
                style={{ fontSize: 16 }}
              />
              {errors.email && <p className="text-red-400 text-xs mt-1.5 font-body">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs uppercase tracking-widest text-ivory/40 font-body">Password</label>
                <Link href="/forgot-password" className="text-xs text-champagne-600 hover:text-champagne-400 font-body transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  className="w-full bg-white/5 border border-white/10 text-ivory px-4 py-3.5 pr-12 text-base font-body focus:outline-none focus:border-champagne-500/50 placeholder:text-ivory/20 rounded-none"
                  placeholder="••••••••"
                  style={{ fontSize: 16 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-ivory/30 hover:text-ivory/60 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1.5 font-body">{errors.password.message}</p>}
            </div>

            {/* Remember */}
            <label className="flex items-center gap-3 cursor-pointer group">
              <input {...register('remember')} type="checkbox" className="accent-champagne-500 w-4 h-4" />
              <span className="text-sm text-ivory/50 font-body group-hover:text-ivory/70 transition-colors">Remember me</span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-champagne-600 text-obsidian py-4 text-xs uppercase tracking-widest font-body font-medium hover:bg-champagne-500 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 min-h-[52px]"
            >
              {isSubmitting ? 'Signing in...' : (<>Sign In <ArrowRight size={14} /></>)}
            </button>
          </form>

          <p className="text-center text-ivory/30 text-sm font-body mt-8">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-champagne-400 hover:text-champagne-300 transition-colors">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
