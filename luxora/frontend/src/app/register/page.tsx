'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Check, ArrowRight } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { authApi } from '@/lib/api';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [form, setForm] = useState({ firstName:'',lastName:'',email:'',password:'',confirmPassword:'',phone:'' });
  const [showPw, setShowPw] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const pw = form.password;
  const checks = [pw.length>=8, /[A-Z]/.test(pw), /[0-9]/.test(pw)];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) { toast.error('Please agree to the Terms of Service'); return; }
    if (form.password !== form.confirmPassword) { toast.error('Passwords do not match'); return; }
    setLoading(true);
    try {
      await authApi.register(form);
      toast.success('Account created! You can now sign in.');
      router.push('/login');
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Registration failed.');
    } finally { setLoading(false); }
  };

  return (
    <>
      <Navbar />
      <main className="pt-[var(--nav-height)]" style={{ minHeight:'100vh',background:'#0a0a0a' }}>
        <div style={{ display:'flex',alignItems:'center',justifyContent:'center',minHeight:'calc(100vh - var(--nav-height))',padding:'48px 24px' }}>
          <div style={{ width:'100%',maxWidth:440 }}>
            <Link href="/" className="block text-center mb-8">
              <span style={{ fontFamily:'var(--font-cormorant)',fontSize:32,color:'#f5f0e8',fontWeight:300,letterSpacing:'0.4em' }}>LUXORA</span>
            </Link>
            <div className="mb-8 text-center">
              <p className="label-gold mb-3" style={{ color:'#c9a96e' }}>New Member</p>
              <h1 style={{ fontFamily:'var(--font-cormorant)',fontWeight:300,color:'#f5f0e8',fontSize:'clamp(2rem,4vw,3rem)',lineHeight:1.1 }}>Create Account</h1>
              <div style={{ width:48,height:1,background:'#c9a96e',margin:'16px auto 0' }} />
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:16 }}>
                {[['firstName','First Name'],['lastName','Last Name']].map(([f,l]) => (
                  <div key={f}>
                    <label style={{ display:'block',fontFamily:'var(--font-jost)',fontSize:11,letterSpacing:'0.15em',textTransform:'uppercase',color:'rgba(245,240,232,0.4)',marginBottom:8 }}>{l}</label>
                    <input type="text" value={(form as any)[f]} onChange={e=>setForm(p=>({...p,[f]:e.target.value}))} required placeholder={l}
                      style={{ width:'100%',background:'rgba(255,255,255,0.04)',border:'none',borderBottom:'1px solid rgba(245,240,232,0.15)',padding:'10px 0',fontFamily:'var(--font-jost)',fontSize:15,color:'#f5f0e8',outline:'none' }} />
                  </div>
                ))}
              </div>
              {[['email','Email Address','email'],['phone','Phone (Optional)','tel']].map(([f,l,t]) => (
                <div key={f}>
                  <label style={{ display:'block',fontFamily:'var(--font-jost)',fontSize:11,letterSpacing:'0.15em',textTransform:'uppercase',color:'rgba(245,240,232,0.4)',marginBottom:8 }}>{l}</label>
                  <input type={t} value={(form as any)[f]} onChange={e=>setForm(p=>({...p,[f]:e.target.value}))} required={f==='email'} placeholder={l}
                    style={{ width:'100%',background:'rgba(255,255,255,0.04)',border:'none',borderBottom:'1px solid rgba(245,240,232,0.15)',padding:'10px 0',fontFamily:'var(--font-jost)',fontSize:15,color:'#f5f0e8',outline:'none' }} />
                </div>
              ))}
              <div>
                <label style={{ display:'block',fontFamily:'var(--font-jost)',fontSize:11,letterSpacing:'0.15em',textTransform:'uppercase',color:'rgba(245,240,232,0.4)',marginBottom:8 }}>Password</label>
                <div style={{ position:'relative' }}>
                  <input type={showPw?'text':'password'} value={form.password} onChange={e=>setForm(p=>({...p,password:e.target.value}))} required placeholder="Min 8 characters"
                    style={{ width:'100%',background:'rgba(255,255,255,0.04)',border:'none',borderBottom:'1px solid rgba(245,240,232,0.15)',padding:'10px 36px 10px 0',fontFamily:'var(--font-jost)',fontSize:15,color:'#f5f0e8',outline:'none' }} />
                  <button type="button" onClick={()=>setShowPw(!showPw)} style={{ position:'absolute',right:0,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',color:'rgba(245,240,232,0.3)',cursor:'pointer' }}>
                    {showPw?<EyeOff size={16}/>:<Eye size={16}/>}
                  </button>
                </div>
                {pw && (
                  <div style={{ display:'flex',gap:16,marginTop:8 }}>
                    {[['8+ chars',checks[0]],['Uppercase',checks[1]],['Number',checks[2]]].map(([l,ok]:any) => (
                      <span key={l} style={{ fontFamily:'var(--font-jost)',fontSize:11,color:ok?'#c9a96e':'rgba(245,240,232,0.3)',display:'flex',alignItems:'center',gap:4 }}>
                        {ok && <Check size={10}/>}{l}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label style={{ display:'block',fontFamily:'var(--font-jost)',fontSize:11,letterSpacing:'0.15em',textTransform:'uppercase',color:'rgba(245,240,232,0.4)',marginBottom:8 }}>Confirm Password</label>
                <input type="password" value={form.confirmPassword} onChange={e=>setForm(p=>({...p,confirmPassword:e.target.value}))} required placeholder="Repeat password"
                  style={{ width:'100%',background:'rgba(255,255,255,0.04)',border:'none',borderBottom:'1px solid rgba(245,240,232,0.15)',padding:'10px 0',fontFamily:'var(--font-jost)',fontSize:15,color:'#f5f0e8',outline:'none' }} />
              </div>
              <label style={{ display:'flex',alignItems:'flex-start',gap:12,cursor:'pointer' }}>
                <input type="checkbox" checked={agreed} onChange={e=>setAgreed(e.target.checked)} style={{ marginTop:2,accentColor:'#c9a96e',flexShrink:0 }} />
                <span style={{ fontFamily:'var(--font-jost)',fontSize:13,color:'rgba(245,240,232,0.5)',lineHeight:1.6 }}>
                  I agree to LUXORA&apos;s{' '}
                  <Link href="/terms" style={{ color:'#c9a96e' }}>Terms of Service</Link>{' '}and{' '}
                  <Link href="/privacy" style={{ color:'#c9a96e' }}>Privacy Policy</Link>
                </span>
              </label>
              <button type="submit" disabled={loading||!agreed}
                style={{ width:'100%',background:'#c9a96e',color:'#0a0a0a',padding:'16px',fontFamily:'var(--font-jost)',fontSize:12,letterSpacing:'0.15em',textTransform:'uppercase',border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:8,opacity:(loading||!agreed)?0.5:1,minHeight:52 }}>
                {loading?'Creating Account...':<><span>Create Account</span><ArrowRight size={14}/></>}
              </button>
            </form>
            <p className="text-center mt-6" style={{ fontFamily:'var(--font-jost)',fontSize:13,color:'rgba(245,240,232,0.35)' }}>
              Already have an account?{' '}
              <Link href="/login" style={{ color:'#c9a96e' }}>Sign In</Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
