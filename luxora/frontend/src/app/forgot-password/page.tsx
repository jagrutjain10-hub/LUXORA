'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch(process.env.NEXT_PUBLIC_API_URL + '/auth/forgot-password', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      setSent(true);
    } catch {}
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
          {sent ? (
            <div className="text-center">
              <div className="font-display text-5xl text-champagne-400 mb-4">✉</div>
              <h2 className="font-display text-2xl text-ivory font-light mb-3">Check Your Email</h2>
              <p className="font-body text-ivory/50 text-sm mb-8">If an account exists, a reset link has been sent.</p>
              <Link href="/login" className="label-gold text-champagne-400 hover:text-champagne-300 transition-colors">Back to Sign In</Link>
            </div>
          ) : (
            <>
              <h1 className="font-display text-3xl text-ivory font-light mb-2">Reset Password</h1>
              <p className="font-body text-ivory/50 text-sm mb-10">Enter your email and we will send a reset link.</p>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="label-gold text-ivory/40 block mb-3">Email Address</label>
                  <input
                    type="email" required value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-transparent border-0 border-b border-ivory/20 pb-3 text-ivory font-body text-sm focus:outline-none focus:border-champagne-500 transition-colors"
                    placeholder="hello@example.com"
                  />
                </div>
                <button type="submit" disabled={loading} className="btn-ghost w-full justify-center">
                  {loading ? 'Sending...' : 'Send Reset Link'}
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
