'use client';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';

function ResetPasswordForm() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { setError('Passwords do not match'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters'); return; }
    setLoading(true);
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/auth/reset-password/' + token, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      if (data.success) { setDone(true); setTimeout(() => router.push('/login'), 2000); }
      else setError(data.message || 'Failed to reset password');
    } catch { setError('Something went wrong. Please try again.'); }
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <main className="pt-[var(--nav-height)] min-h-screen bg-obsidian flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link href="/" className="block text-center mb-12">
            <span className="font-display text-2xl text-ivory tracking-[0.35em] font-light">LUXORA</span>
          </Link>
          {done ? (
            <div className="text-center">
              <div className="font-display text-5xl text-champagne-400 mb-4">✓</div>
              <h2 className="font-display text-2xl text-ivory font-light mb-2">Password Reset!</h2>
              <p className="font-body text-ivory/50 text-sm">Redirecting to sign in...</p>
            </div>
          ) : (
            <>
              <h1 className="font-display text-3xl text-ivory font-light mb-2">New Password</h1>
              <p className="font-body text-ivory/50 text-sm mb-10">Enter your new password below.</p>
              {error && <div className="bg-red-900/20 border border-red-800/30 text-red-400 p-4 mb-6 font-body text-sm">{error}</div>}
              <form onSubmit={handleSubmit} className="space-y-6">
                {[['New Password', password, setPassword], ['Confirm Password', confirm, setConfirm]].map(([label, val, setter]: any) => (
                  <div key={label as string}>
                    <label className="label-gold text-ivory/40 block mb-3">{label}</label>
                    <input
                      type="password" required value={val}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setter(e.target.value)}
                      className="w-full bg-transparent border-0 border-b border-ivory/20 pb-3 text-ivory font-body text-sm focus:outline-none focus:border-champagne-500 transition-colors"
                      placeholder="••••••••"
                    />
                  </div>
                ))}
                <button type="submit" disabled={loading} className="btn-ghost w-full justify-center">
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
                <div className="text-center">
                  <Link href="/login" className="font-body text-ivory/40 text-sm hover:text-ivory/70 transition-colors">Back to Sign In</Link>
                </div>
              </form>
            </>
          )}
        </div>
      </main>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-obsidian" />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
