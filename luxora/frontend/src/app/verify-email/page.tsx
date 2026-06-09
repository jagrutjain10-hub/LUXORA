'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) { setStatus('error'); return; }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/verify-email?token=${token}`)
      .then(res => res.ok ? setStatus('success') : setStatus('error'))
      .catch(() => setStatus('error'));
  }, [searchParams]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f0f0f' }}>
      <div style={{ textAlign: 'center', color: '#fff', fontFamily: 'Georgia, serif' }}>
        {status === 'loading' && <p style={{ color: '#c9a96e' }}>Verifying your email...</p>}
        {status === 'success' && (
          <>
            <h1 style={{ color: '#c9a96e', letterSpacing: '0.3em', marginBottom: 16 }}>LUXORA</h1>
            <p style={{ marginBottom: 24 }}>Your email has been verified successfully!</p>
            <button onClick={() => router.push('/login')}
              style={{ background: '#c9a96e', color: '#0f0f0f', border: 'none', padding: '14px 36px', cursor: 'pointer', letterSpacing: '0.15em', textTransform: 'uppercase', fontSize: 13 }}>
              Sign In
            </button>
          </>
        )}
        {status === 'error' && (
          <>
            <p style={{ color: '#ff6b6b', marginBottom: 24 }}>Verification failed. Link may be expired.</p>
            <button onClick={() => router.push('/register')}
              style={{ background: '#c9a96e', color: '#0f0f0f', border: 'none', padding: '14px 36px', cursor: 'pointer', letterSpacing: '0.15em', textTransform: 'uppercase', fontSize: 13 }}>
              Register Again
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#0f0f0f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p style={{ color: '#c9a96e', fontFamily: 'Georgia, serif' }}>Loading...</p></div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}