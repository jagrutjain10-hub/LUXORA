'use client';
import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [form, setForm] = useState({ name:'',email:'',subject:'',message:'' });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    await new Promise(r => setTimeout(r, 1200));
    toast.success('Message sent! We will respond within 24 hours.');
    setForm({ name:'',email:'',subject:'',message:'' });
    setSending(false);
  };

  return (
    <>
      <Navbar />
      <main className="pt-[var(--nav-height)]">
        <section style={{ background:'#0a0a0a' }} className="py-20 sm:py-28 text-center section-px">
          <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ duration:0.8 }}>
            <p className="label-gold mb-4" style={{ color:'#c9a96e' }}>Get In Touch</p>
            <h1 style={{ fontFamily:'var(--font-cormorant)',fontWeight:300,color:'#f5f0e8',fontSize:'clamp(2.5rem,6vw,4.5rem)',lineHeight:1.1 }}>Contact Us</h1>
            <div style={{ width:48,height:1,background:'#c9a96e',margin:'28px auto 0' }} />
          </motion.div>
        </section>
        <section style={{ background:'#faf7f2' }} className="section-py section-px">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 lg:gap-20">
            <div>
              <h2 style={{ fontFamily:'var(--font-cormorant)',fontWeight:300,fontSize:'clamp(1.8rem,3vw,2.5rem)',color:'#0a0a0a',marginBottom:16 }}>We'd love to hear from you</h2>
              <p style={{ fontFamily:'var(--font-jost)',color:'rgba(10,10,10,0.6)',lineHeight:1.8,fontSize:15,marginBottom:32 }}>Whether you have a question about a product, need help with an order, or just want to say hello — our team is here for you.</p>
              <div className="space-y-5">
                {([['email','hello@luxora.in',Mail],['phone','+91 98765 43210',Phone],['location','Mumbai, India',MapPin]] as any[]).map(([k,v,Icon]) => (
                  <div key={k} className="flex items-center gap-4">
                    <div style={{ width:40,height:40,border:'1px solid #e8dfd0',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
                      <Icon size={16} style={{ color:'#c9a96e' }} />
                    </div>
                    <span style={{ fontFamily:'var(--font-jost)',fontSize:14,color:'rgba(10,10,10,0.7)' }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              {[['name','Full Name','text'],['email','Email Address','email'],['subject','Subject','text']].map(([f,ph,t]) => (
                <div key={f}>
                  <label style={{ display:'block',fontFamily:'var(--font-jost)',fontSize:11,letterSpacing:'0.15em',textTransform:'uppercase',color:'rgba(10,10,10,0.5)',marginBottom:8 }}>{ph}</label>
                  <input type={t} value={(form as any)[f]} onChange={e=>setForm(p=>({...p,[f]:e.target.value}))} required placeholder={ph}
                    style={{ width:'100%',background:'transparent',border:'none',borderBottom:'1px solid rgba(10,10,10,0.2)',padding:'10px 0',fontFamily:'var(--font-jost)',fontSize:15,color:'#0a0a0a',outline:'none' }} />
                </div>
              ))}
              <div>
                <label style={{ display:'block',fontFamily:'var(--font-jost)',fontSize:11,letterSpacing:'0.15em',textTransform:'uppercase',color:'rgba(10,10,10,0.5)',marginBottom:8 }}>Message</label>
                <textarea value={form.message} onChange={e=>setForm(p=>({...p,message:e.target.value}))} required rows={5} placeholder="Your message..."
                  style={{ width:'100%',background:'transparent',border:'none',borderBottom:'1px solid rgba(10,10,10,0.2)',padding:'10px 0',fontFamily:'var(--font-jost)',fontSize:15,color:'#0a0a0a',outline:'none',resize:'none' }} />
              </div>
              <button type="submit" disabled={sending} className="btn-primary w-full justify-center" style={{ opacity:sending?0.6:1 }}>
                {sending ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
