'use client';
import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Eye, EyeOff } from 'lucide-react';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token') ?? '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { toast.error('Passwords do not match'); return; }
    if (password.length < 8) { toast.error('Password must be at least 8 characters'); return; }
    setLoading(true);
    try {
      await api.post(`/auth/reset-password/${token}`, { password });
      toast.success('Password reset successfully!');
      router.push('/login');
    } catch (err:any) {
      toast.error(err.response?.data?.message ?? 'Reset link may have expired.');
    } finally { setLoading(false); }
  };

  return (
    <>
      <Navbar />
      <main className="pt-[var(--nav-height)]" style={{ background:'#0a0a0a',minHeight:'100vh' }}>
        <div className="flex items-center justify-center min-h-[calc(100vh-var(--nav-height))] section-px py-16">
          <div style={{ width:'100%',maxWidth:400 }}>
            <div className="text-center mb-10">
              <p className="label-gold mb-4" style={{ color:'#c9a96e' }}>Account Recovery</p>
              <h1 style={{ fontFamily:'var(--font-cormorant)',fontWeight:300,color:'#f5f0e8',fontSize:'clamp(2rem,5vw,3rem)',lineHeight:1.1 }}>Set New Password</h1>
              <div style={{ width:48,height:1,background:'#c9a96e',margin:'20px auto 0' }} />
            </div>
            {!token ? (
              <p className="text-center" style={{ fontFamily:'var(--font-jost)',color:'rgba(245,240,232,0.5)',fontSize:14 }}>
                Invalid reset link. <Link href="/forgot-password" style={{ color:'#c9a96e' }}>Request a new one.</Link>
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {[['New Password',password,setPassword,'password'],['Confirm Password',confirm,setConfirm,'confirm']].map(([label,val,setter,id]:any) => (
                  <div key={id}>
                    <label style={{ display:'block',fontFamily:'var(--font-jost)',fontSize:11,letterSpacing:'0.15em',textTransform:'uppercase',color:'rgba(245,240,232,0.4)',marginBottom:10 }}>{label}</label>
                    <div style={{ position:'relative' }}>
                      <input type={showPw?'text':'password'} value={val} onChange={e=>setter(e.target.value)} required
                        style={{ width:'100%',background:'rgba(255,255,255,0.05)',border:'none',borderBottom:'1px solid rgba(245,240,232,0.2)',padding:'12px 40px 12px 0',fontFamily:'var(--font-jost)',fontSize:15,color:'#f5f0e8',outline:'none' }} />
                      {id==='password' && (
                        <button type="button" onClick={()=>setShowPw(!showPw)} style={{ position:'absolute',right:0,top:'50%',transform:'translateY(-50%)',color:'rgba(245,240,232,0.4)',background:'none',border:'none',cursor:'pointer' }}>
                          {showPw?<EyeOff size={16}/>:<Eye size={16}/>}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                <button type="submit" disabled={loading} className="btn-primary w-full justify-center" style={{ background:'#c9a96e',color:'#0a0a0a',padding:'16px',opacity:loading?0.6:1 }}>
                  {loading?'Resetting...':'Reset Password'}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
