'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/store/wishlist.store';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authApi.login({ email, password });
      const { user, accessToken } = res.data.data;
      setAuth(user, accessToken);
      toast.success(`Welcome back, ${user.firstName}!`);
      if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') router.push('/admin/dashboard');
      else router.push('/dashboard');
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Login failed. Please check your credentials.');
    } finally { setLoading(false); }
  };

  return (
    <>
      <Navbar />
      <main className="pt-[var(--nav-height)]" style={{ minHeight:'100vh',background:'#0a0a0a' }}>
        <div style={{ display:'flex',minHeight:'calc(100vh - var(--nav-height))' }}>
          {/* Left decorative panel */}
          <div className="hidden lg:flex lg:w-1/2 xl:w-3/5" style={{ background:'radial-gradient(ellipse at 30% 60%, #1a0d00 0%, #0a0a0a 70%)',position:'relative',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:48 }}>
            <div style={{ textAlign:'center' }}>
              <span style={{ fontFamily:'var(--font-cormorant)',fontSize:'clamp(3rem,5vw,5rem)',color:'#f5f0e8',fontWeight:300,letterSpacing:'0.4em',display:'block' }}>LUXORA</span>
              <div style={{ width:48,height:1,background:'#c9a96e',margin:'20px auto' }} />
              <p style={{ fontFamily:'var(--font-cormorant)',color:'rgba(245,240,232,0.4)',fontSize:20,fontWeight:300,fontStyle:'italic' }}>Where Spaces Become Sanctuaries</p>
            </div>
          </div>

          {/* Right form panel */}
          <div style={{ flex:1,display:'flex',alignItems:'center',justifyContent:'center',padding:'48px 24px' }}>
            <div style={{ width:'100%',maxWidth:380 }}>
              <Link href="/" className="lg:hidden block text-center mb-10">
                <span style={{ fontFamily:'var(--font-cormorant)',fontSize:32,color:'#f5f0e8',fontWeight:300,letterSpacing:'0.4em' }}>LUXORA</span>
              </Link>
              <div className="mb-8">
                <p className="label-gold mb-3" style={{ color:'#c9a96e' }}>Welcome Back</p>
                <h1 style={{ fontFamily:'var(--font-cormorant)',fontWeight:300,color:'#f5f0e8',fontSize:'clamp(2rem,4vw,3rem)',lineHeight:1.1 }}>Sign In</h1>
                <div style={{ width:48,height:1,background:'#c9a96e',marginTop:16 }} />
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label style={{ display:'block',fontFamily:'var(--font-jost)',fontSize:11,letterSpacing:'0.15em',textTransform:'uppercase',color:'rgba(245,240,232,0.4)',marginBottom:10 }}>Email Address</label>
                  <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="your@email.com"
                    style={{ width:'100%',background:'rgba(255,255,255,0.04)',border:'none',borderBottom:'1px solid rgba(245,240,232,0.15)',padding:'12px 0',fontFamily:'var(--font-jost)',fontSize:15,color:'#f5f0e8',outline:'none' }} />
                </div>
                <div>
                  <div style={{ display:'flex',justifyContent:'space-between',marginBottom:10 }}>
                    <label style={{ fontFamily:'var(--font-jost)',fontSize:11,letterSpacing:'0.15em',textTransform:'uppercase',color:'rgba(245,240,232,0.4)' }}>Password</label>
                    <Link href="/forgot-password" style={{ fontFamily:'var(--font-jost)',fontSize:12,color:'#c9a96e' }}>Forgot?</Link>
                  </div>
                  <div style={{ position:'relative' }}>
                    <input type={showPw?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)} required placeholder="••••••••"
                      style={{ width:'100%',background:'rgba(255,255,255,0.04)',border:'none',borderBottom:'1px solid rgba(245,240,232,0.15)',padding:'12px 36px 12px 0',fontFamily:'var(--font-jost)',fontSize:15,color:'#f5f0e8',outline:'none' }} />
                    <button type="button" onClick={()=>setShowPw(!showPw)} style={{ position:'absolute',right:0,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',color:'rgba(245,240,232,0.3)',cursor:'pointer' }}>
                      {showPw?<EyeOff size={16}/>:<Eye size={16}/>}
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={loading}
                  style={{ width:'100%',background:'#c9a96e',color:'#0a0a0a',padding:'16px',fontFamily:'var(--font-jost)',fontSize:12,letterSpacing:'0.15em',textTransform:'uppercase',border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:8,opacity:loading?0.6:1,minHeight:52 }}>
                  {loading ? 'Signing in...' : <><span>Sign In</span><ArrowRight size={14}/></>}
                </button>
              </form>

              <p className="text-center mt-8" style={{ fontFamily:'var(--font-jost)',fontSize:13,color:'rgba(245,240,232,0.35)' }}>
                Don&apos;t have an account?{' '}
                <Link href="/register" style={{ color:'#c9a96e' }}>Create Account</Link>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
