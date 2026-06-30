'use client';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { motion } from 'framer-motion';

export default function Page() {
  return (
    <>
      <Navbar />
      <main className="pt-[var(--nav-height)]">
        <section style={{ background:'#0a0a0a' }} className="py-20 sm:py-28 text-center section-px">
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.8}}>
            <p className="label-gold mb-4" style={{color:'#c9a96e'}}>Legal</p>
            <h1 style={{fontFamily:'var(--font-cormorant)',fontWeight:300,color:'#f5f0e8',fontSize:'clamp(2.5rem,6vw,4.5rem)',lineHeight:1.1}}>Privacy Policy</h1>
            <div style={{width:48,height:1,background:'#c9a96e',margin:'28px auto 0'}} />
          </motion.div>
        </section>
        <section style={{background:'#faf7f2'}} className="section-py section-px">
          <div className="max-w-3xl mx-auto">
            <p style={{fontFamily:'var(--font-jost)',fontSize:12,color:'rgba(10,10,10,0.4)',letterSpacing:'0.1em',marginBottom:40}}>Last updated: June 2026</p>
              <div key="Information We Collect" style={{ marginBottom:32 }}>
                <h2 style={{ fontFamily:'var(--font-cormorant)',fontWeight:400,fontSize:22,color:'#0a0a0a',marginBottom:10 }}>Information We Collect</h2>
                <p style={{ fontFamily:'var(--font-jost)',fontSize:15,color:'rgba(10,10,10,0.7)',lineHeight:1.85 }}>We collect information you provide directly — name, email, phone, and shipping address — as well as browsing and purchase data to improve your experience on our platform.</p>
              </div>
              <div key="How We Use Your Information" style={{ marginBottom:32 }}>
                <h2 style={{ fontFamily:'var(--font-cormorant)',fontWeight:400,fontSize:22,color:'#0a0a0a',marginBottom:10 }}>How We Use Your Information</h2>
                <p style={{ fontFamily:'var(--font-jost)',fontSize:15,color:'rgba(10,10,10,0.7)',lineHeight:1.85 }}>Your information is used to process orders, send transactional emails, and improve our platform. We do not sell your personal data to third parties under any circumstances.</p>
              </div>
              <div key="Data Security" style={{ marginBottom:32 }}>
                <h2 style={{ fontFamily:'var(--font-cormorant)',fontWeight:400,fontSize:22,color:'#0a0a0a',marginBottom:10 }}>Data Security</h2>
                <p style={{ fontFamily:'var(--font-jost)',fontSize:15,color:'rgba(10,10,10,0.7)',lineHeight:1.85 }}>We use industry-standard encryption (TLS) to protect your data in transit and at rest. Passwords are hashed using bcrypt and never stored in plain text.</p>
              </div>
              <div key="Cookies" style={{ marginBottom:32 }}>
                <h2 style={{ fontFamily:'var(--font-cormorant)',fontWeight:400,fontSize:22,color:'#0a0a0a',marginBottom:10 }}>Cookies</h2>
                <p style={{ fontFamily:'var(--font-jost)',fontSize:15,color:'rgba(10,10,10,0.7)',lineHeight:1.85 }}>We use cookies for session management and analytics. You can disable cookies in your browser settings, but some features may not function correctly.</p>
              </div>
              <div key="Third-Party Services" style={{ marginBottom:32 }}>
                <h2 style={{ fontFamily:'var(--font-cormorant)',fontWeight:400,fontSize:22,color:'#0a0a0a',marginBottom:10 }}>Third-Party Services</h2>
                <p style={{ fontFamily:'var(--font-jost)',fontSize:15,color:'rgba(10,10,10,0.7)',lineHeight:1.85 }}>We use Razorpay for payment processing and Resend for email delivery. These services have their own privacy policies which we encourage you to review.</p>
              </div>
              <div key="Your Rights" style={{ marginBottom:32 }}>
                <h2 style={{ fontFamily:'var(--font-cormorant)',fontWeight:400,fontSize:22,color:'#0a0a0a',marginBottom:10 }}>Your Rights</h2>
                <p style={{ fontFamily:'var(--font-jost)',fontSize:15,color:'rgba(10,10,10,0.7)',lineHeight:1.85 }}>You may request access to, correction of, or deletion of your personal data at any time by contacting us at hello@luxora.in.</p>
              </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
