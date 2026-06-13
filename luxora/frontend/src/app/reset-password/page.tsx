'use client';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

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
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      if (data.success) { setDone(true); setTimeout(() => router.push('/login'), 2000); }
      else setError(data.message || 'Failed to reset password');
    } catch { setError('Something went wrong. Please try again.'); }
    setLoading(false);
  };

  return (
    <main style={{minHeight:'100vh',background:'#0a0a0a',display:'flex',alignItems:'center',justifyContent:'center',padding:'32px'}}>
      <div style={{width:'100%',maxWidth:'400px'}}>
        <Link href="/" style={{display:'block',textAlign:'center',marginBottom:'48px',textDecoration:'none'}}>
          <span style={{fontFamily:'var(--font-cormorant)',fontSize:'28px',color:'#f5f0e8',letterSpacing:'0.4em',fontWeight:300}}>LUXORA</span>
        </Link>
        {done ? (
          <div style={{textAlign:'center'}}>
            <div style={{fontSize:'48px',marginBottom:'16px',color:'#c9a96e'}}>✓</div>
            <h2 style={{fontFamily:'var(--font-cormorant)',fontSize:'1.5rem',color:'#f5f0e8',fontWeight:300,marginBottom:'12px'}}>Password Reset!</h2>
            <p style={{color:'rgba(245,240,232,0.5)',fontFamily:'var(--font-jost)',fontSize:'14px'}}>Redirecting to sign in...</p>
          </div>
        ) : (
          <>
            <h1 style={{fontFamily:'var(--font-cormorant)',fontSize:'2rem',color:'#f5f0e8',fontWeight:300,marginBottom:'8px'}}>New Password</h1>
            <p style={{color:'rgba(245,240,232,0.5)',fontFamily:'var(--font-jost)',fontSize:'14px',marginBottom:'40px'}}>Enter your new password below.</p>
            {error && <div style={{background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.3)',color:'#fca5a5',padding:'12px 16px',marginBottom:'24px',fontFamily:'var(--font-jost)',fontSize:'13px'}}>{error}</div>}
            <form onSubmit={handleSubmit}>
              {[['New Password', password, setPassword], ['Confirm Password', confirm, setConfirm]].map(([label, val, setter]: any) => (
                <div key={label as string} style={{marginBottom:'24px'}}>
                  <label style={{display:'block',fontSize:'11px',letterSpacing:'0.2em',textTransform:'uppercase',color:'rgba(245,240,232,0.5)',fontFamily:'var(--font-jost)',marginBottom:'12px'}}>{label}</label>
                  <input type="password" required value={val} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setter(e.target.value)} style={{width:'100%',background:'transparent',border:'none',borderBottom:'1px solid rgba(245,240,232,0.15)',padding:'12px 0',color:'#f5f0e8',fontFamily:'var(--font-jost)',fontSize:'14px',outline:'none'}} placeholder="••••••••" />
                </div>
              ))}
              <button type="submit" disabled={loading} style={{width:'100%',background:'#c9a96e',color:'#0a0a0a',padding:'16px',border:'none',fontSize:'11px',letterSpacing:'0.15em',textTransform:'uppercase',fontFamily:'var(--font-jost)',cursor:'pointer',marginBottom:'24px',opacity:loading?0.7:1}}>
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
              <div style={{textAlign:'center'}}>
                <Link href="/login" style={{color:'rgba(245,240,232,0.4)',fontFamily:'var(--font-jost)',fontSize:'13px',textDecoration:'none'}}>Back to Sign In</Link>
              </div>
            </form>
          </>
        )}
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div style={{minHeight:'100vh',background:'#0a0a0a'}} />}>
      <ResetPasswordForm />
    </Suspense>
  );
}