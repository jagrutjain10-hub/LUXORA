'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { authApi } from '@/lib/api';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try { await authApi.forgotPassword(email); setSent(true); }
    catch { toast.error('Something went wrong. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <>
      <Navbar />
      <main className="pt-[var(--nav-height)]" style={{ background:'#0a0a0a',minHeight:'100vh' }}>
        <div className="flex items-center justify-center min-h-[calc(100vh-var(--nav-height))] section-px py-16">
          <div style={{ width:'100%',maxWidth:400 }}>
            <div className="text-center mb-10">
              <p className="label-gold mb-4" style={{ color:'#c9a96e' }}>Account Recovery</p>
              <h1 style={{ fontFamily:'var(--font-cormorant)',fontWeight:300,color:'#f5f0e8',fontSize:'clamp(2rem,5vw,3rem)',lineHeight:1.1 }}>
                {sent ? 'Check Your Inbox' : 'Reset Password'}
              </h1>
              <div style={{ width:48,height:1,background:'#c9a96e',margin:'20px auto 0' }} />
            </div>
            {sent ? (
              <div className="text-center">
                <p style={{ fontFamily:'var(--font-jost)',color:'rgba(245,240,232,0.6)',fontSize:14,lineHeight:1.8,marginBottom:28 }}>
                  If an account exists for that email, we have sent a password reset link. Please check your inbox and spam folder.
                </p>
                <Link href="/login" style={{ fontFamily:'var(--font-jost)',color:'#c9a96e',fontSize:13,letterSpacing:'0.1em' }}>Back to Sign In</Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label style={{ display:'block',fontFamily:'var(--font-jost)',fontSize:11,letterSpacing:'0.15em',textTransform:'uppercase',color:'rgba(245,240,232,0.4)',marginBottom:10 }}>Email Address</label>
                  <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="your@email.com"
                    style={{ width:'100%',background:'rgba(255,255,255,0.05)',border:'none',borderBottom:'1px solid rgba(245,240,232,0.2)',padding:'12px 0',fontFamily:'var(--font-jost)',fontSize:15,color:'#f5f0e8',outline:'none' }} />
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full justify-center" style={{ background:'#c9a96e',color:'#0a0a0a',padding:'16px',opacity:loading?0.6:1 }}>
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
                <p className="text-center" style={{ fontFamily:'var(--font-jost)',fontSize:13,color:'rgba(245,240,232,0.4)' }}>
                  Remember your password?{' '}
                  <Link href="/login" style={{ color:'#c9a96e' }}>Sign In</Link>
                </p>
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
